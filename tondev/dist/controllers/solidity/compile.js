"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.solidityCompileCommand = void 0;
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
const installer_1 = require("./installer");
const utils_1 = require("../../core/utils");
exports.solidityCompileCommand = {
    name: "compile",
    title: "Compile Solidity Contract",
    args: [
        {
            isArg: true,
            name: "file",
            type: "file",
            title: "Source file",
            nameRegExp: /\.sol$/i,
        },
    ],
    async run(terminal, args) {
        var _a;
        terminal.log("Starting build...");
        const ext = path_1.default.extname(args.file);
        if (ext !== ".sol") {
            terminal.log(`Choose solidity source file.`);
            return;
        }
        await installer_1.solidityEnsureInstalled(terminal);
        const fileDir = path_1.default.dirname(args.file);
        const fileName = path_1.default.basename(args.file);
        const tvcName = utils_1.changeExt(fileName, ".tvc");
        const codeName = utils_1.changeExt(fileName, ".code");
        const compilerOut = await installer_1.solc(terminal, fileDir, [fileName]);
        const linkerOut = await installer_1.tvmLinker(terminal, fileDir, ["compile", codeName, "--lib", installer_1.stdLibPath()]);
        const generatedTvcName = `${(_a = /Saved contract to file (.*)$/mg.exec(linkerOut)) === null || _a === void 0 ? void 0 : _a[1]}`;
        fs.renameSync(path_1.default.resolve(fileDir, generatedTvcName), path_1.default.resolve(fileDir, tvcName));
        fs.unlinkSync(path_1.default.resolve(fileDir, codeName));
        terminal.log(compilerOut);
        terminal.log(linkerOut);
        terminal.log("Compile complete.");
    },
};
//# sourceMappingURL=compile.js.map