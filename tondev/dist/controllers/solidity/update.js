"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.solidityUpdateCommand = void 0;
const installer_1 = require("./installer");
exports.solidityUpdateCommand = {
    name: "update",
    title: "Update Solidity Compiler",
    async run(terminal, _args) {
        installer_1.solidityUpdate(terminal);
    },
};
//# sourceMappingURL=update.js.map