
import { PicaComicAPI } from '@l2studio/picacomic-api';
import { Setting } from "../config/setting";



export const getComicInfo = async (keyword: string) => {
    let settings: Setting = Setting.instance();
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
    const client = await new PicaComicAPI(opt);
    // 获取令牌
    if (!getComicInfo.prototype.token)
        getComicInfo.prototype.token = await client.signIn(settings.account);
    const token = getComicInfo.prototype.token;
    const comis = await client.search({ token, keyword });
    if (comis.docs.length == 0) {
        return;
    } else {
        const info = await client.fetchComic({ token, id: comis.docs[0]._id });
        return info;
    }
}