import { getComicInfo } from "./comicInfo/getComicInfo";
import { Setting } from "./config/setting";
import { ScanComicStatu, SearchComics } from "./file/searchComics";
import { ComicType } from "./type/Comic";

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
        interval += 100;
        if (interval % 3 == 0) {
            log(txt + ".");
        } else if (interval % 3 == 1) {
            log(txt + "..");
        } else {
            log(txt + "...");
        }
    }, 100);
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



    console.log(JSON.stringify(searcher))

}