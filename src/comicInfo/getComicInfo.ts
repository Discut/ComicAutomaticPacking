
import { PicaComicAPI, PicaComicService } from '@l2studio/picacomic-api';
import { Setting } from "../config/setting";
import * as fs from 'fs';
import * as path from 'path';
import { ComicInfo, ComicEpisode } from '@l2studio/picacomic-api';
import { queryComic } from './db/queryDb';
import { ComicDbInfo, ComicType } from '../type/Comic';
type MangaInfo = {
    info?: ComicInfo,
    episodes?: ComicEpisode[]
}

let client: PicaComicService;
async function createClient(): Promise<PicaComicService> {
    const settings: Setting = Setting.instance();
    const opt: {
        timeout: number,
        proxy?: {
            host: string,
            port: number
        }
    } = {
        timeout: Number(settings.timeout) ? Number(settings.timeout) : 5000,
    };
    if (settings.isProxy)
        opt.proxy = settings.proxy;

    const tokenPath = path.resolve(__dirname, '..', 'config');
    const tokenFile = path.join(tokenPath, '.token') // Persistent token
    await fs.openSync(tokenFile, 'w');

    client = new PicaComicService({
        email: settings.account.email,
        password: settings.account.password,
        token: fs.readFileSync(tokenFile, 'utf8'),
        ...opt,
        onReauthorizationToken(token) {
            // console.log('New token:', token)
            fs.writeFileSync(tokenFile, token) // Update persistent token
            // getComicInfo.prototype.token = token;
        }
    });
    return client;
}

export const getComicInfo = async (comic: ComicType.Comics): Promise<MangaInfo> => {
    const c: PicaComicService = client ? client : await createClient();
    let comicId: string = "";
    const keyword = comic.title;
    let comics: ComicDbInfo[] = await queryComic(keyword);
    // 数据库中无法找到
    if (comics.length == 0) {
        const comis = await c.search({ keyword });
        if (comis.docs.length === 0)
            return {};
        else
            comicId = comis.docs[0]._id;
    } else {
        let which = comics[0];
        comics.forEach(el => {
            if (Math.abs(el.episodeCount - comic.chapter.length) <= Math.abs(which.episodeCount - comic.chapter.length))
                which = el;
        })
        comicId = which.id;
    }
    const info = await c.fetchComic({ id: comicId });
    const episodes = await getComicEpisodes(comicId, 1);
    return { info, episodes };
}

/**
 * @function 获取漫画章节信息
 * @param id 漫画id
 * @param pageIndex 漫画章节分页索引值
 * @return 漫画章节列表
 */
const getComicEpisodes: any = async (id: string, pageIndex = 1) => {
    const epi = await client.fetchComicEpisodes({
        comicId: id, page: pageIndex
    });
    const episodes = epi.docs;
    if (epi.pages <= pageIndex)
        return episodes;
    else
        return episodes.concat(await getComicEpisodes(id, pageIndex + 1));
}