"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchComics = exports.ScanComicStatu = void 0;
var fs = require("fs");
var Comic_1 = require("../type/Comic");
var ScanComicStatu;
(function (ScanComicStatu) {
    ScanComicStatu[ScanComicStatu["SCANNING"] = 0] = "SCANNING";
    ScanComicStatu[ScanComicStatu["START"] = 1] = "START";
    ScanComicStatu[ScanComicStatu["END"] = 2] = "END";
    ScanComicStatu[ScanComicStatu["ERROR"] = 3] = "ERROR";
})(ScanComicStatu = exports.ScanComicStatu || (exports.ScanComicStatu = {}));
var SearchComics = /** @class */ (function () {
    function SearchComics(parentPath) {
        this._comicCount = 0;
        if (!parentPath)
            this._path = "";
        else
            this._path = parentPath;
        this._comics = [];
    }
    Object.defineProperty(SearchComics.prototype, "comicCount", {
        get: function () { return this._comicCount; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(SearchComics.prototype, "comics", {
        get: function () { return this._comics; },
        enumerable: false,
        configurable: true
    });
    SearchComics.prototype.start = function (callback, parentPath) {
        if (parentPath)
            this._path = parentPath;
        this.readDirSync(this._path, callback);
    };
    SearchComics.prototype.readDirSync = function (path, callback, level, imageType) {
        if (level === void 0) { level = 1; }
        if (imageType === void 0) { imageType = Comic_1.ComicType.ComicImageType.ORIGINAL; }
        var pa = fs.readdirSync(path);
        for (var index = 0; index < pa.length; index++) {
            var element = pa[index];
            var info = fs.statSync(path + "\\" + element);
            if (info.isDirectory()) {
                //console.log("dir: " + path + "\\" + element)
                var type = Comic_1.ComicType.ComicImageType.ORIGINAL;
                if (level == 1) {
                    var comics = {
                        chapter: [],
                        title: element,
                        path: path
                    };
                    this._comics.push(comics);
                }
                else if (level == 2) {
                    if (element != "original")
                        type = Comic_1.ComicType.ComicImageType.WAIFU2X;
                }
                else if (level == 3) {
                    callback(this._comicCount == 0 ? ScanComicStatu.START : ScanComicStatu.SCANNING, this._comicCount, this._comics);
                    var comicTitle = this._comics[this._comics.length - 1].title;
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
            }
            else {
                var splitElem = element.split('.');
                if (["jpg", "png"].includes(splitElem[splitElem.length - 1])) {
                    var imagePath = path + "\\" + element;
                    var comic = this._comics[this._comics.length - 1];
                    comic.chapter[comic.chapter.length - 1].pagesPath.push(imagePath);
                }
                //console.log("file: " + path + "\\" + element);
            }
        }
        callback(ScanComicStatu.END, this._comicCount, this._comics);
    };
    return SearchComics;
}());
exports.SearchComics = SearchComics;
