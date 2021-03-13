"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.solidityVersionCommand = void 0;
const installer_1 = require("./installer");
async function solcVersion(terminal) {
    var _a, _b;
    const out = await installer_1.solc(terminal, process.cwd(), ["--version"]);
    return (_b = (_a = out.match(/Version:\s*([0-9.]+)/)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : "";
}
exports.solidityVersionCommand = {
    name: "version",
    title: "Show Solidity Version",
    async run(terminal, _args) {
        terminal.log(await solcVersion(terminal));
    },
};
//# sourceMappingURL=version.js.map