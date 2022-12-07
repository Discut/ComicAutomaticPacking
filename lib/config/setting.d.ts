export declare class Setting {
    private _proxy;
    private _timeout;
    private _isProxy;
    private _settingsPath;
    private _account;
    private static _instance;
    private constructor();
    static instance(): Setting;
    init(settingsPath?: string): void;
    commandExcute(command: string): boolean;
    private updateJson;
    set proxy(value: Proxy);
    get proxy(): Proxy;
    set timeout(value: string);
    get timeout(): string;
    set isProxy(value: boolean);
    get isProxy(): boolean;
    set account(account: Account);
    get account(): Account;
}
type Proxy = {
    host: string;
    port: number;
};
type Account = {
    email: string;
    password: string;
};
export {};
