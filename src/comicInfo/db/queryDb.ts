import { Setting } from "../../config/setting";
import { ComicDbInfo } from "../../type/Comic";


var sqlite3 = require("sqlite3").verbose();
const setting: Setting = Setting.instance();
interface Callback {
    (result: ComicDbInfo[]): void
}

/**
 * 查询漫画信息在数据库中
 * @param title 漫画标题
 * @returns 
 */
export const queryComic = (title: string) => {
    return new Promise((resolve: Callback) => {
        var db = new sqlite3.Database(setting.picacg_qtPath + "\\data\\download.db");
        let result: ComicDbInfo[] = [];
        db.all("select bookId,downloadEpsIds,title from download where title like '" + title + "%'", function (err: any, row?: [{
            bookId: string,
            downloadEpsIds: string,
            title: string
        }]) {
            if (row) {
                row?.forEach(el => {
                    let downloadEpsIds: number[] = JSON.parse(el.downloadEpsIds);
                    result.push({
                        id: el.bookId,
                        title: el.title,
                        episodeCount: downloadEpsIds.length
                    });
                })
            }
            resolve(result);
        })
    });

}