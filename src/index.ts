import { getComicInfo } from "./comicInfo/getComicInfo";
import { Setting } from "./config/setting";
import { ScanComicStatu, SearchComics } from "./file/searchComics";
import { ComicType } from "./type/Comic";
import * as xml2js from 'xml2js';
import * as archiver from 'archiver';
import * as fs from 'fs';
import * as path from 'path';

var log = require('single-line-log').stdout;
let blok: string;

export const main = async (): Promise<void> => {
    //console.log("Hello world!!");
    const argv: string[] = process.argv;
    //console.log(argv);
    let setting: Setting = Setting.instance();
    setting.init()
    setting.isProxy = true;

    //console.log(JSON.stringify(setting))

    //console.log(process.cwd());

    let searcher: SearchComics = new SearchComics(process.cwd());
    blok = "scanning..."
    let timer = setInterval(() => {
        log(blok);
        blok = "scanning."
    }, 100);
    searcher.start((status: ScanComicStatu, comicCount: number, comics: ComicType.Comics[]) => {
        if (status == ScanComicStatu.END)
            clearInterval(timer);
    });
    let interval: number = 0
    let txt = "";
    let timer1 = setInterval(() => {
        interval = (interval + 1) % 5;
        switch (interval % 200) {
            case 0:
                log(txt + ".");
                break;
            case 1:
                log(txt + "..");
                break;
            case 2:
                log(txt + "...");
                break;
            case 3:
                log(txt + "....");
                break;
            case 4:
                log(txt + ".....");
                break;
        }
    }, 200);
    for (let i = 0; i < searcher.comics.length; i++) {
        let comic = searcher.comics[i];
        if (comic.title) {
            txt = comic.title;
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
    }
    clearInterval(timer1);
    fs.mkdirSync(path.join(searcher.comics[0].path, "out"));
    console.log("创建输出目录");
    let interval1: number = 0
    let txt1 = "";
    let timer2 = setInterval(() => {
        interval1 = (interval1 + 1) % 5;
        switch (interval1 % 200) {
            case 0:
                log(txt1 + ".");
                break;
            case 1:
                log(txt1 + "..");
                break;
            case 2:
                log(txt1 + "...");
                break;
            case 3:
                log(txt1 + "....");
                break;
            case 4:
                log(txt1 + ".....");
                break;
        }
    }, 200);
    // 生成ComicInfo.xml
    var builder = new xml2js.Builder();
    for (let i = 0; i < searcher.comics.length; i++) {
        let comic = searcher.comics[i];
        for (let index = 0; index < comic.chapter.length; index++) {
            const chapter = comic.chapter[index];
            txt1 = "正在压缩 [" + comic.title + "](" + chapter.Title + ")";
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

            const zipPath = path.join(comic.path, "out", comic.title)
            if (!fs.existsSync(zipPath)) {
                fs.mkdirSync(zipPath);
            }

            const output = fs.createWriteStream(path.join(zipPath, chapter.Title + ".cbz"));// 将压缩包保存到当前项目的目录下，并且压缩包名为test.zip
            const archive = archiver('zip', { zlib: { level: 0 } });// 设置压缩等级
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
            }
            // 第五步，完成压缩
            archive.finalize();
        }
    }


    clearInterval(timer2);


}