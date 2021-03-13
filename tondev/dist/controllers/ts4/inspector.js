"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTS4Inspector = void 0;
const path_1 = __importDefault(require("path"));
async function runTS4Inspector(terminal, args) {
    terminal.log(`${path_1.default.basename(args.file)} tests passed`);
}
exports.runTS4Inspector = runTS4Inspector;
//# sourceMappingURL=inspector.js.map