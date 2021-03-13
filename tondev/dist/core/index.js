"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tondevHome = void 0;
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
function tondevHome() {
    //return path_1.default.resolve(os_1.default.homedir(), ".tondev");
    return './.tools'
}
exports.tondevHome = tondevHome;
//# sourceMappingURL=index.js.map