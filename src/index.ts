import { getComicInfo } from "./comicInfo/getComicInfo";
import { Setting } from "./config/setting";
import { ScanComicStatu, SearchComics } from "./file/searchComics";
import { ComicType } from "./type/Comic";
import * as xml2js from 'xml2js';
import * as fs from 'fs';
import * as path from 'path';
const chalk = require("chalk");
import cliProgress = require('cli-progress');
import { program } from 'commander';

import colors = require('ansi-colors');
import { commandParser } from "./command/CommandParser";
import { Archive, ArchiveProgressEventType } from "./file/comicArchiver";
// 入口
export const main = async (): Promise<void> => {
    Setting.instance().init();
    commandParser();
    checkStatus();
    // 判断参数是否被 commander 解析完成
    if (program.args.length == 0)
        await boot(program.opts().scan);
}
// 启动
const boot = async (scanPath: string) => {
    let setting: Setting = Setting.instance();
    let searcher: SearchComics = new SearchComics(scanPath);
    const b1 = new cliProgress.SingleBar({
        format: '扫描文件 |' + colors.cyan('{bar}') + '| {percentage}% || {value}/{total} 文件夹 || 已扫描到漫画数: {comicCount}',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
    });
    // 开始扫描文件夹
    searcher.start((status: ScanComicStatu, dirCount: number, comicCount: number, comics: ComicType.Comics[]) => {
        if (status == ScanComicStatu.END) {
            b1.stop();
        }
        else if (status == ScanComicStatu.START) {
            b1.start(dirCount, 0, {
                comicCount: 0
            });
        } else if (status == ScanComicStatu.SCANNING) {
            b1.update(comics.length, {
                comicCount: comicCount
            });
        }
    });
    console.log('---' + chalk['green']('[扫描文件]完成！') + '---');
    const b2 = new cliProgress.SingleBar({
        format: '获取信息 |' + colors.cyan('{bar}') + '| {percentage}% || {value}/{total} 漫画',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
    });
    b2.start(searcher.comics.length, 0);
    // 循环获取信息
    for (let i = 0; i < searcher.comics.length; i++) {
        let comic = searcher.comics[i];
        if (comic.title) {
            let mangaInfo = await getComicInfo(comic.title);
            let comicInfo = mangaInfo.info;
            let episodes = mangaInfo.episodes;
            // 反转章节顺序（获取的章节顺序是反的）
            if (episodes) episodes.reverse();
            for (let index = 0; index < comic.chapter.length; index++) {
                const chapter = comic.chapter[index];
                chapter.Count = comicInfo?.epsCount ? comicInfo?.epsCount : comic.chapter.length;
                // 查找当前章节属于第几章
                chapter.Number = index + 1;
                if (episodes)
                    for (let i = 0; i < episodes.length; i++) {
                        const element = episodes[i];
                        if (element.title == chapter.Title) {
                            chapter.Number = element.order;
                            episodes.splice(i, 1);
                            break;
                        }
                    }
                chapter.Summary = comicInfo?.description ? comicInfo?.description : "";
                chapter.Writer = comicInfo?.author ? comicInfo?.author : "";
                chapter.Letterer = comicInfo?.chineseTeam ? comicInfo?.chineseTeam : "";
                chapter.Tags = comicInfo?.tags ? comicInfo?.tags : [];
                chapter.Web = comicInfo?._id ? comicInfo?._id : "";
                chapter.PageCount = chapter.pagesPath.length;
            }
        }
        b2.update(i + 1);
    }
    b2.stop();
    console.log('---' + chalk['green']('[获取信息]完成！') + '---');
    // 创建输出目录
    if (!fs.existsSync(path.join(setting.outputPath)))
        fs.mkdirSync(path.join(setting.outputPath));


    // 生成ComicInfo.xml
    var builder = new xml2js.Builder();
    for (let i = 0; i < searcher.comics.length; i++) {
        let comic = searcher.comics[i];
        for (let index = 0; index < comic.chapter.length; index++) {
            const chapter = comic.chapter[index];
            const outputTitle =
                "[" + (comic.title.length >= 10 ? (comic.title.substring(0, 7) + '...') : comic.title) + "]" +
                "(" + (chapter.Title.length >= 8 ? (chapter.Title.substring(0, 5) + '...') : chapter.Title) + ")";


            let obj = {
                ComicInfo: {
                    $: { "xmlns:xsd": "http://www.w3.org/2001/XMLSchema", "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance" },
                    Title: chapter.Title,
                    Series: chapter.Series,
                    Number: chapter.Number,
                    Count: chapter.Count,
                    AlternateSeries: chapter.AlternateSeries,
                    SeriesGroup: chapter.ScanInformation,
                    Summary: chapter.Summary,
                    Writer: chapter.Writer,
                    Letterer: chapter.Letterer,
                    Tags: chapter.Tags.toString(),
                    PageCount: chapter.PageCount,
                }
            };
            let xml = builder.buildObject(obj);
            chapter.comicInfo = xml;
            // 生成压缩包路径
            const zipPath = path.join(setting.outputPath, comic.title)
            if (!fs.existsSync(zipPath)) fs.mkdirSync(zipPath);
            // 开始打包
            const archiver = new Archive(chapter, zipPath, setting.compressionLevel);
            const archiveProgress = new cliProgress.SingleBar({
                format: '打包漫画 |' + colors.cyan('{bar}') + '| {percentage}% || {value}/{total} 文件 || {title}',
                barCompleteChar: '\u2588',
                barIncompleteChar: '\u2591',
                hideCursor: true
            });
            await archiver.setProgressListener((type, p, t) => {
                if (type == ArchiveProgressEventType.PROGRESSING) {
                    archiveProgress.increment({
                        title: (p == t ? "压缩完成" : "正在压缩") + outputTitle,
                    });
                }
                else if (type == ArchiveProgressEventType.START) {
                    archiveProgress.start(chapter.PageCount + 1, 0, {
                        title: "正在压缩 " + outputTitle
                    });
                }
            }).output();
            archiveProgress.stop();
        }
    }
    console.log('---' + chalk['green']('[打包漫画]完成！') + '---');
    console.log('漫画输出目录:' + setting.outputPath)
}
// 检查配置是否正确
const checkStatus = () => {
    if (Setting.instance().account.email.length == 0) {
        console.log(chalk['red']('错误: 请检查账户是否配置'));
        process.exit(-1);
    }
}
