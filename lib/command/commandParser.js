"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandParser = void 0;
var CommandParser = /** @class */ (function () {
    function CommandParser(command) {
        var splitCommand = command.split('=');
        if (splitCommand.length == 0)
            throw "Cant parse command!";
        var options = this.optionsParser(splitCommand[0]);
        var args = splitCommand[1] ? [splitCommand[1]] : [""];
        this._command = {
            options: options,
            arguments: args
        };
    }
    CommandParser.prototype.optionsParser = function (option) {
        var options = option.split('.');
        return options;
    };
    Object.defineProperty(CommandParser.prototype, "command", {
        get: function () {
            return this._command;
        },
        enumerable: false,
        configurable: true
    });
    return CommandParser;
}());
exports.CommandParser = CommandParser;
