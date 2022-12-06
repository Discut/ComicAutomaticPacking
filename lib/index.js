"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Printf = exports.Greeter = void 0;
var Greeter = function (name) { return "Hello ".concat(name); };
exports.Greeter = Greeter;
var Printf = function (msg) { return console.log("Hello world", msg); };
exports.Printf = Printf;
(0, exports.Printf)("你好");
console.log("sdads");
