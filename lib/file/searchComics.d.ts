import { ComicType } from '../type/Comic';
interface ScanComicCallback {
    (status: ScanComicStatu, comicCount: number, comics: ComicType.Comics[]): void;
}
export declare enum ScanComicStatu {
    SCANNING = 0,
    START = 1,
    END = 2,
    ERROR = 3
}
export declare class SearchComics {
    private _path;
    private _comics;
    private _comicCount;
    get comicCount(): number;
    get comics(): ComicType.Comics[];
    constructor(parentPath?: string);
    start(callback: ScanComicCallback, parentPath?: string): void;
    private readDirSync;
}
export {};
