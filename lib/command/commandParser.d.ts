type Command = {
    options: string[];
    arguments: string[];
};
export declare class CommandParser {
    private _command;
    constructor(command: string);
    private optionsParser;
    get command(): Command;
}
export {};
