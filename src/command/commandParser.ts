
type Command = {
    options: string[];
    arguments: string[];
}

export class CommandParser {

    private _command: Command;

    constructor(command: string) {
        const splitCommand = command.split('=');
        if (splitCommand.length == 0)
            throw "Cant parse command!";
        const options = this.optionsParser(splitCommand[0]);
        const args = splitCommand[1] ? [splitCommand[1]] : [""];
        this._command = {
            options: options,
            arguments: args
        }
    }

    private optionsParser(option: string): string[] {
        const options: string[] = option.split('.');
        return options;
    }

    get command() {
        return this._command;
    }
}