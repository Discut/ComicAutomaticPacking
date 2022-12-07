import * as fs from 'fs';
import * as path from 'path';
import { CommandParser } from '../command/commandParser';
export class Setting {
    private _proxy: Proxy;
    private _timeout: string;
    private _isProxy: boolean;
    private _settingsPath: string;
    private _account: Account;

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
        let data = fs.readFileSync(settingsPath, 'utf8');
        if (!data) {
            console.log("Read json failed!");
            return;
        }
        let obj = JSON.parse(data);
        this._proxy = obj['proxy'];
        this._timeout = obj['timeout'];
        this._isProxy = obj['isProxy'];
        this._account = obj['account'];
    }

    public commandExcute(command: string): boolean {
        // TODO
        let parser: CommandParser = new CommandParser(command);
        for (let index = 0; index < parser.command.arguments.length; index++) {
            let element: string = parser.command.arguments[index];
            //this[(element as string)]
        }
        parser.command.arguments
        return false;
    }

    private async updateJson() {
        let data = {
            timeout: this._timeout,
            isProxy: this._isProxy,
            proxy: this._proxy,
            account: this._account,
        }
        fs.writeFileSync(this._settingsPath, JSON.stringify(data));
    }



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
    set account(account: Account) { this._account = account; }
    get account() { return this._account; }
}

type Proxy = {
    host: string,
    port: number
}
type Account = {
    email: string,
    password: string
}
