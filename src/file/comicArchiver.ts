import { Setting } from '../config/setting';
import { ComicType } from '../type/Comic';
import * as archiver from 'archiver';
import * as fs from 'fs';
import * as path from 'path';
const settings = Setting.instance();
// export const archiver = (chapter: ComicType.Chapter, outputPath: string, level: number = settings.compressionLevel) => {
// }

// interface processCallback {
//     (processed: number, total: number): void;
// }
export enum ArchiveProgressEventType {
    START,
    PROGRESSING,
    END,
    ERROR
}
type processCallback = (type: ArchiveProgressEventType, processed?: number, total?: number) => void;


export class Archive {
    private _processCallback?: processCallback;
    private _archive: archiver.Archiver;
    constructor(chapter: ComicType.Chapter, outputPath: string, level: number = settings.compressionLevel) {
        // 创建压缩包
        const outputStream = fs.createWriteStream(path.join(outputPath, chapter.Title + '(' + ComicType.ComicImageType[chapter.iamgeType] + ')' + ".cbz"));
        this._archive = archiver('zip', { zlib: { level } });// 设置压缩等级
        this.initListener();
        // 第三步，建立管道连接
        this._archive.pipe(outputStream);
        // 添加ComicInfo.xml
        if (chapter.comicInfo)
            this._archive.append(chapter.comicInfo, { name: "ComicInfo.xml" });
        for (let j = 0; j < chapter.pagesPath.length; j++) {
            // 第四步，压缩指定文件
            let stream = fs.createReadStream(chapter.pagesPath[j]);// 读取图片
            // 可能会影响性能
            this._archive.append(stream, { name: path.basename(chapter.pagesPath[j]) });
        }
    }
    public setProgressListener(callback: processCallback): Archive {
        this._processCallback = callback;
        return this;
    }
    // 输出压缩文件
    public async output() {
        if (this._processCallback) {
            this._processCallback(
                ArchiveProgressEventType.START);
        }
        await this._archive.finalize();
    }

    private initListener() {
        this._archive.on("progress", progress => {
            if (this._processCallback) {
                this._processCallback(
                    ArchiveProgressEventType.PROGRESSING,
                    progress.entries.processed,
                    progress.entries.total);
            }
        });

        this._archive.on('end', () => {
            if (this._processCallback) {
                this._processCallback(
                    ArchiveProgressEventType.END);
            }
        });
    }
}