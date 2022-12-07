"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Setting = void 0;
var fs = require("fs");
var path = require("path");
var commandParser_1 = require("../command/commandParser");
var Setting = /** @class */ (function () {
    function Setting() {
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
        };
    }
    Setting.instance = function () {
        if (this._instance === undefined) {
            this._instance = new Setting();
        }
        return this._instance;
    };
    Setting.prototype.init = function (settingsPath) {
        if (!settingsPath)
            this._settingsPath = settingsPath = path.join(__dirname, 'setting.json');
        if (!fs.existsSync(settingsPath))
            return;
        var data = fs.readFileSync(settingsPath, 'utf8');
        if (!data) {
            console.log("Read json failed!");
            return;
        }
        var obj = JSON.parse(data);
        this._proxy = obj['proxy'];
        this._timeout = obj['timeout'];
        this._isProxy = obj['isProxy'];
        this._account = obj['account'];
    };
    Setting.prototype.commandExcute = function (command) {
        // TODO
        var parser = new commandParser_1.CommandParser(command);
        for (var index = 0; index < parser.command.arguments.length; index++) {
            var element = parser.command.arguments[index];
            //this[(element as string)]
        }
        parser.command.arguments;
        return false;
    };
    Setting.prototype.updateJson = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                data = {
                    timeout: this._timeout,
                    isProxy: this._isProxy,
                    proxy: this._proxy,
                    account: this._account,
                };
                fs.writeFileSync(this._settingsPath, JSON.stringify(data));
                return [2 /*return*/];
            });
        });
    };
    Object.defineProperty(Setting.prototype, "proxy", {
        get: function () {
            return this._proxy;
        },
        set: function (value) {
            this._proxy = value;
            this.updateJson();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Setting.prototype, "timeout", {
        get: function () {
            return this._timeout;
        },
        set: function (value) {
            this._timeout = value;
            this.updateJson();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Setting.prototype, "isProxy", {
        get: function () {
            return this._isProxy;
        },
        set: function (value) {
            this._isProxy = value;
            this.updateJson();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Setting.prototype, "account", {
        get: function () { return this._account; },
        set: function (account) { this._account = account; },
        enumerable: false,
        configurable: true
    });
    return Setting;
}());
exports.Setting = Setting;
