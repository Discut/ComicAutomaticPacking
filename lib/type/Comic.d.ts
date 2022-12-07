export declare namespace ComicType {
    type Chapter = {
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
    };
    type Comics = {
        chapter: Chapter[];
        title: string;
        path: string;
    };
    enum ComicImageType {
        ORIGINAL = 0,
        WAIFU2X = 1
    }
}
