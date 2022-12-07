"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
var getComicInfo_1 = require("./comicInfo/getComicInfo");
var setting_1 = require("./config/setting");
var searchComics_1 = require("./file/searchComics");
var log = require('single-line-log').stdout;
var blok;
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var argv, setting, searcher, timer, interval, txt, timer1, i, comic, comicInfo, index, chapter;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                argv = process.argv;
                setting = setting_1.Setting.instance();
                setting.init();
                setting.isProxy = true;
                searcher = new searchComics_1.SearchComics(process.cwd());
                blok = "scanning...";
                timer = setInterval(function () {
                    log(blok);
                    blok = "scanning.";
                }, 100);
                searcher.start(function (status, comicCount, comics) {
                    if (status == searchComics_1.ScanComicStatu.END)
                        clearInterval(timer);
                });
                interval = 0;
                txt = "";
                timer1 = setInterval(function () {
                    interval += 100;
                    if (interval % 3 == 0) {
                        log(txt + ".");
                    }
                    else if (interval % 3 == 1) {
                        log(txt + "..");
                    }
                    else {
                        log(txt + "...");
                    }
                }, 100);
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < searcher.comics.length)) return [3 /*break*/, 4];
                comic = searcher.comics[i];
                if (!comic.title) return [3 /*break*/, 3];
                txt = comic.title;
                return [4 /*yield*/, (0, getComicInfo_1.getComicInfo)(comic.title)];
            case 2:
                comicInfo = _a.sent();
                for (index = 0; index < comic.chapter.length; index++) {
                    chapter = comic.chapter[index];
                    chapter.Count = (comicInfo === null || comicInfo === void 0 ? void 0 : comicInfo.epsCount) ? comicInfo === null || comicInfo === void 0 ? void 0 : comicInfo.epsCount : comic.chapter.length;
                    chapter.Number = index + 1;
                    chapter.Summary = (comicInfo === null || comicInfo === void 0 ? void 0 : comicInfo.description) ? comicInfo === null || comicInfo === void 0 ? void 0 : comicInfo.description : "";
                    chapter.Writer = (comicInfo === null || comicInfo === void 0 ? void 0 : comicInfo.author) ? comicInfo === null || comicInfo === void 0 ? void 0 : comicInfo.author : "";
                    chapter.Letterer = (comicInfo === null || comicInfo === void 0 ? void 0 : comicInfo.chineseTeam) ? comicInfo === null || comicInfo === void 0 ? void 0 : comicInfo.chineseTeam : "";
                    chapter.Tags = (comicInfo === null || comicInfo === void 0 ? void 0 : comicInfo.tags) ? comicInfo === null || comicInfo === void 0 ? void 0 : comicInfo.tags : [];
                    chapter.Web = (comicInfo === null || comicInfo === void 0 ? void 0 : comicInfo._id) ? comicInfo === null || comicInfo === void 0 ? void 0 : comicInfo._id : "";
                    chapter.PageCount = chapter.pagesPath.length;
                }
                _a.label = 3;
            case 3:
                i++;
                return [3 /*break*/, 1];
            case 4:
                clearInterval(timer1);
                console.log(JSON.stringify(searcher));
                return [2 /*return*/];
        }
    });
}); };
exports.main = main;
