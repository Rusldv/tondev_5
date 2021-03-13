"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tvmLinker = exports.solc = exports.solidityUpdate = exports.solidityEnsureInstalled = exports.stdLibPath = exports.linkerPath = exports.compilerPath = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const core_1 = require("../../core");
const utils_1 = require("../../core/utils");
function solidityHome() {
    return path_1.default.resolve(core_1.tondevHome(), "solidity");
}
function compilerVersion() {
    return "0_36_0";
}
function linkerVersion() {
    return "0_1_0";
}
function compilerPath() {
    return path_1.default.resolve(solidityHome(), utils_1.executableName("solc"));
}
exports.compilerPath = compilerPath;
function linkerPath() {
    return path_1.default.resolve(solidityHome(), utils_1.executableName("tvm_linker"));
}
exports.linkerPath = linkerPath;
function stdLibPath() {
    return path_1.default.resolve(solidityHome(), "stdlib_sol.tvm");
}
exports.stdLibPath = stdLibPath;
async function solidityEnsureInstalled(terminal) {
    if (fs_1.default.existsSync(compilerPath())) {
        return;
    }
    terminal.log("Installing solidity compiler...");
    await utils_1.downloadFromBinaries(terminal, stdLibPath(), "stdlib_sol");
    await utils_1.downloadFromBinaries(terminal, compilerPath(), `solc_${compilerVersion()}_{p}`, {
        executable: true,
    });
    await utils_1.downloadFromBinaries(terminal, linkerPath(), `tvm_linker_${linkerVersion()}_{p}`, {
        executable: true,
    });
    terminal.log("Solidity compiler has been installed.");
}
exports.solidityEnsureInstalled = solidityEnsureInstalled;
async function solidityUpdate(terminal) {
    if (fs_1.default.existsSync(solidityHome())) {
        fs_1.default.rmdirSync(solidityHome(), { recursive: true });
    }
    solidityEnsureInstalled(terminal);
}
exports.solidityUpdate = solidityUpdate;
async function runTool(terminal, toolPath, workDir, args) {
    await solidityEnsureInstalled(terminal);
    const out = await utils_1.run(toolPath, args, { cwd: workDir }, utils_1.nullTerminal);
    return out.replace(/\r?\n/g, "\r\n");
}
async function solc(terminal, workDir, args) {
    return runTool(terminal, compilerPath(), workDir, args);
}
exports.solc = solc;
;
async function tvmLinker(terminal, workDir, args) {
    return runTool(terminal, linkerPath(), workDir, args);
}
exports.tvmLinker = tvmLinker;
;
//# sourceMappingURL=installer.js.map