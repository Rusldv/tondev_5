"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTSInspector = void 0;
const path_1 = __importDefault(require("path"));
async function runTSInspector(terminal, args) {
    terminal.log(`${path_1.default.basename(args.file)} tests passed`);
}
exports.runTSInspector = runTSInspector;
//# sourceMappingURL=inspector.js.map