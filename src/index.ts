import { getComicInfo } from "./comicInfo/getComicInfo";
import { Setting } from "./config/setting";
import { ScanComicStatu, SearchComics } from "./file/searchComics";
import { ComicType } from "./type/Comic";
import * as xml2js from 'xml2js';
import * as archiver from 'archiver';
import * as fs from 'fs';
import * as path from 'path';
const chalk = require("chalk");
import cliProgress = require('cli-progress');

// note: you have to install this dependency manually since it's not required by cli-progress
import colors = require('ansi-colors');

var log = require('single-line-log').stdout;
let blok: string;

export const main = async (): Promise<void> => {
    const argv: string[] = process.argv;
    let setting: Setting = Setting.instance();
    setting.init()

    let searcher: SearchComics = new SearchComics(process.cwd());
    const b1 = new cliProgress.SingleBar({
        format: '扫描文件 |' + colors.cyan('{bar}') + '| {percentage}% || {value}/{total} 文件夹 || 已扫描到漫画数: {comicCount}',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
    });
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
    console.log('---' + chalk['red']('[扫描文件]完成！') + '---\n');
    const b2 = new cliProgress.SingleBar({
        format: '获取信息 |' + colors.cyan('{bar}') + '| {percentage}% || {value}/{total} 漫画',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
    });
    b2.start(searcher.comics.length, 0);
    for (let i = 0; i < searcher.comics.length; i++) {
        let comic = searcher.comics[i];
        if (comic.title) {
            let comicInfo = await getComicInfo(comic.title);
            for (let index = 0; index < comic.chapter.length; index++) {
                const chapter = comic.chapter[index];
                chapter.Count = comicInfo?.epsCount ? comicInfo?.epsCount : comic.chapter.length;
                chapter.Number = index + 1;
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
    console.log('---' + chalk['red']('[获取信息]完成！') + '---\n');
    // 创建输出目录
    if (!fs.existsSync(path.join(setting.outputPath)))
        fs.mkdirSync(path.join(setting.outputPath));


    // 生成ComicInfo.xml
    var builder = new xml2js.Builder();
    for (let i = 0; i < searcher.comics.length; i++) {
        let comic = searcher.comics[i];
        for (let index = 0; index < comic.chapter.length; index++) {
            const chapter = comic.chapter[index];


            const b3 = new cliProgress.SingleBar({
                format: '打包漫画 |' + colors.cyan('{bar}') + '| {percentage}% || {value}/{total} 文件 || {title}',
                barCompleteChar: '\u2588',
                barIncompleteChar: '\u2591',
                hideCursor: true
            });
            b3.start(chapter.PageCount, 0, {
                title: "正在压缩 [" + comic.title + "](" + chapter.Title + ")"
            });
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

            const zipPath = path.join(setting.outputPath, comic.title)
            if (!fs.existsSync(zipPath)) {
                fs.mkdirSync(zipPath);
            }

            const output = fs.createWriteStream(path.join(zipPath, chapter.Title + '(' + ComicType.ComicImageType[chapter.iamgeType] + ')' + ".cbz"));// 将压缩包保存到当前项目的目录下，并且压缩包名为test.zip
            const archive = archiver('zip', { zlib: { level: setting.compressionLevel } });// 设置压缩等级
            // 第三步，建立管道连接
            archive.pipe(output);
            archive.append(xml, { name: "ComicInfo.xml" });
            for (let j = 0; j < chapter.pagesPath.length; j++) {
                // 第四步，压缩指定文件
                let stream = fs.createReadStream(chapter.pagesPath[j]);// 读取当前目录下的hello.txt
                let paths = chapter.pagesPath[j].split("\\");
                let imageName = paths[paths.length - 1]; //paths[paths.length - 2] + "." + paths[paths.length - 1];
                // 可能会影响性能
                archive.append(stream, { name: imageName });
                b3.increment({
                    title: "正在压缩 [" + comic.title + "](" + chapter.Title + ")"
                });
            }
            // 第五步，完成压缩
            b3.update(chapter.pagesPath.length,
                {
                    title: "输出漫画 [" + comic.title + "](" + chapter.Title + ") 请稍后"
                });
            await archive.finalize();
            b3.update(chapter.pagesPath.length,
                {
                    title: "输出漫画 [" + comic.title + "](" + chapter.Title + ") 完成！！"
                });
            b3.stop();
        }
    }
    console.log('---' + chalk['red']('[打包漫画]完成！') + '---\n');
    console.log('漫画输出目录:' + setting.outputPath)
}