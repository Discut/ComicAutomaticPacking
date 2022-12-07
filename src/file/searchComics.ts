import * as fs from 'fs';
import * as path from 'path';
import { ComicType } from '../type/Comic'

interface ScanComicCallback {
    (status: ScanComicStatu, comicCount: number, comics: ComicType.Comics[]): void
}
export enum ScanComicStatu {
    SCANNING,
    START,
    END,
    ERROR
}

interface ISearchComics {
}

export class SearchComics {
    private _path: string;
    private _comics: ComicType.Comics[];
    private _comicCount: number = 0;

    get comicCount() { return this._comicCount };
    get comics() { return this._comics; }
    constructor(parentPath?: string) {
        if (!parentPath)
            this._path = "";
        else
            this._path = parentPath;
        this._comics = [];
    }
    public start(callback: ScanComicCallback, parentPath?: string) {
        if (parentPath)
            this._path = parentPath;
        this.readDirSync(this._path, callback);
    }
    private readDirSync(path: string, callback: ScanComicCallback, level: number = 1, imageType: ComicType.ComicImageType = ComicType.ComicImageType.ORIGINAL) {
        var pa = fs.readdirSync(path);
        for (let index = 0; index < pa.length; index++) {
            const element = pa[index];
            var info = fs.statSync(path + "\\" + element)
            if (info.isDirectory()) {
                //console.log("dir: " + path + "\\" + element)
                let type = ComicType.ComicImageType.ORIGINAL;
                if (level == 1) {
                    let comics: ComicType.Comics = {
                        chapter: [],
                        title: element,
                        path: path
                    };
                    this._comics.push(comics);
                } else if (level == 2) {
                    if (element != "original")
                        type = ComicType.ComicImageType.WAIFU2X;
                } else if (level == 3) {
                    callback(this._comicCount == 0 ? ScanComicStatu.START : ScanComicStatu.SCANNING, this._comicCount, this._comics);
                    const comicTitle = this._comics[this._comics.length - 1].title
                    this._comics[this._comics.length - 1].chapter.push({
                        Title: element,
                        Series: comicTitle,
                        Number: 0,
                        Count: 0,
                        AlternateSeries: comicTitle,
                        SeriesGroup: comicTitle,
                        Summary: "",
                        Writer: "",
                        Letterer: "",
                        Tags: [],
                        PageCount: 0,

                        pagesPath: [],
                        iamgeType: imageType,

                    });
                    this._comicCount++;
                }
                this.readDirSync(path + "\\" + element, callback, level + 1, type);
            } else {
                const splitElem = element.split('.');
                if (["jpg", "png"].includes(splitElem[splitElem.length - 1])) {
                    const imagePath = path + "\\" + element;
                    const comic = this._comics[this._comics.length - 1];
                    comic.chapter[comic.chapter.length - 1].pagesPath.push(imagePath);
                }
                //console.log("file: " + path + "\\" + element);
            }
        }
        callback(ScanComicStatu.END, this._comicCount, this._comics);
    }
}