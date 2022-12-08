
import { PicaComicAPI, PicaComicService } from '@l2studio/picacomic-api';
import { Setting } from "../config/setting";
import * as fs from 'fs';
import * as path from 'path';

let client: PicaComicService;
async function createClient(): Promise<PicaComicService> {
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

    const tokenPath = path.resolve(__dirname, '..', 'config');
    const tokenFile = path.join(tokenPath, '.token') // Persistent token
    await fs.openSync(tokenFile, 'w');

    client = new PicaComicService({
        email: settings.account.email,
        password: settings.account.password,
        token: fs.readFileSync(tokenFile, 'utf8'),
        ...opt,
        onReauthorizationToken(token) {
            //console.log('New token:', token)
            fs.writeFileSync(tokenFile, token) // Update persistent token
            //getComicInfo.prototype.token = token;
        }
    });
    return client;
}

export const getComicInfo = async (keyword: string) => {
    const c: PicaComicService = client ? client : await createClient();
    const comis = await c.search({ keyword });
    if (comis.docs.length == 0) {
        return;
    } else {
        const info = await c.fetchComic({ id: comis.docs[0]._id });
        return info;
    }
}