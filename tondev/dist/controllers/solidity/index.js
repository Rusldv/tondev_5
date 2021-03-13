"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Solidity = void 0;
const create_1 = require("./create");
const compile_1 = require("./compile");
const version_1 = require("./version");
const update_1 = require("./update");
exports.Solidity = {
    name: "sol",
    title: "Solidity Compiler",
    commands: [
        create_1.solidityCreateCommand,
        compile_1.solidityCompileCommand,
        version_1.solidityVersionCommand,
        update_1.solidityUpdateCommand
    ],
};
//# sourceMappingURL=index.js.map