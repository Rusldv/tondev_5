"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTSTest = void 0;
const path_1 = __importDefault(require("path"));
const utils_1 = require("../../core/utils");
async function createTSTest(terminal, args) {
    const testFilePath = utils_1.uniqueFilePath(path_1.default.dirname(args.file), utils_1.changeExt(path_1.default.basename(args.file), "{}.test.py"));
    terminal.log(`${testFilePath} has created for ${path_1.default.basename(args.file)}`);
}
exports.createTSTest = createTSTest;
//# sourceMappingURL=codeFactory.js.map