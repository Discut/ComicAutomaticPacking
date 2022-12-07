export namespace ComicType {
    export type Chapter = {
        Title: string;
        Series: string;
        Number: number;
        Count: number;
        AlternateSeries: string;
        SeriesGroup: string;
        Summary: string;
        Writer: string;
        Letterer: string;
        Tags: string[];
        Web?: string;
        PageCount: number;
        AgeRating?: string;
        ScanInformation?: string;

        pagesPath: string[];
        iamgeType: ComicImageType;
        comicInfo?:string;

    }
    export type Comics = {
        chapter: Chapter[];
        title: string;
        path: string;
    }
    export enum ComicImageType {
        ORIGINAL,
        WAIFU2X
    }
}
