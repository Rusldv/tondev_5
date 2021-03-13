"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TS4 = void 0;
const codeFactory_1 = require("./codeFactory");
const runner_1 = require("./runner");
const inspector_1 = require("./inspector");
exports.TS4 = {
    commands: [{
            name: "create-ts4-test",
            title: "Create TS4 Test",
            args: [{
                    name: "folder",
                    type: "folder",
                }],
            run: codeFactory_1.createTS4Test,
        }, {
            name: "run-ts4-test",
            title: "Run TS4 Test",
            args: [{
                    isArg: true,
                    name: "file",
                    type: "file",
                    nameRegExp: /\.test\.py$/,
                },
            ],
            run: runner_1.runTS4Test,
        }, {
            name: "run-ts4-inspector",
            title: "Run TS4 Inspector",
            args: [{
                    isArg: true,
                    name: "file",
                    type: "file",
                    nameRegExp: /\.test\.py$/,
                }],
            run: inspector_1.runTS4Inspector,
        }],
};
//# sourceMappingURL=index.js.map