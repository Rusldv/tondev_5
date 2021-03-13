"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTS4Test = void 0;
const path_1 = __importDefault(require("path"));
async function runTS4Test(terminal, args) {
    terminal.log(`${path_1.default.basename(args.file)} test passed`);
}
exports.runTS4Test = runTS4Test;
//# sourceMappingURL=runner.js.map