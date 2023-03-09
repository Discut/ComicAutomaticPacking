import * as fs from 'fs';
import * as path from 'path';
export class Setting implements Record<string, any> {
    private _proxy: Proxy;
    private _timeout: string;
    private _isProxy: boolean;
    private _settingsPath: string;
    private _account: Account;
    private _outputPath: string = "./";
    private _compressionLevel: number = 0;
    // picacg_qt应用的路径
    private _picacg_qtPath = "";

    set picacg_qtPath(value: string) {
        if (value) this._picacg_qtPath = value;
        this.updateJson();
    }

    get picacg_qtPath() {
        return this._picacg_qtPath;
    }

    set compressionLevel(value: number) {
        if (value < 0) value = 0;
        else if (value > 9) value = 9;
        this._compressionLevel = value;
        this.updateJson();
    }
    get compressionLevel() { return this._compressionLevel; }
    set outputPath(value: string) { this._outputPath = value; this.updateJson(); }
    get outputPath() { return this._outputPath; }
    set proxy(value: Proxy) {
        this._proxy = value;
        this.updateJson();
    }

    get proxy(): Proxy {
        return this._proxy;
    }

    set timeout(value: string) {
        this._timeout = value;
        this.updateJson();
    }
    get timeout() {
        return this._timeout;
    }

    set isProxy(value: boolean) {
        this._isProxy = value;
        this.updateJson();
    }
    get isProxy() {
        return this._isProxy;
    }
    set account(account: Account) { this._account = account; this.updateJson(); }
    get account() { return this._account; }

    private static _instance: Setting;
    private constructor() {
        this._proxy = {
            host: '127.0.0.1',
            port: 7890
        };
        this._timeout = '5000';
        this._isProxy = false;
        this._settingsPath = '';
        this._account = {
            email: '',
            password: ''
        }

    }

    static instance(): Setting {
        if (this._instance === undefined) {
            this._instance = new Setting();
        }
        return this._instance
    }

    public init(settingsPath?: string) {
        if (!settingsPath)
            this._settingsPath = settingsPath = path.join(__dirname, 'setting.json');
        if (!fs.existsSync(settingsPath))
            return;
        const data = fs.readFileSync(settingsPath, 'utf8');
        if (!data) {
            console.log("Read json failed!");
            return;
        }
        const obj = JSON.parse(data);
        this._proxy = obj['proxy'] ? obj['proxy'] : this._proxy;
        this._timeout = obj['timeout'] ? obj['timeout'] : this._timeout;
        this._isProxy = obj['isProxy'] ? obj['isProxy'] : this._isProxy;
        this._account = obj['account'] ? obj['account'] : this._account;
        this.outputPath = obj.outputPath ? obj.outputPath : this._outputPath;
        this.compressionLevel = obj.compressionLevel ? obj.compressionLevel : this.compressionLevel;
        this._picacg_qtPath = obj.picacg_qtPath ? obj.picacg_qtPath : this._picacg_qtPath;
    }

    private async updateJson() {
        let data = {
            timeout: this._timeout,
            isProxy: this._isProxy,
            proxy: this._proxy,
            account: this._account,
            outputPath: this._outputPath,
            compressionLevel: this.compressionLevel,
            picacg_qtPath: this.picacg_qtPath
        };
        fs.writeFileSync(this._settingsPath, JSON.stringify(data));
    }
}

type Proxy = {
    host: string,
    port: number
}
type Account = {
    email: string,
    password: string
}
