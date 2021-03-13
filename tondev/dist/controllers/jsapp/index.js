"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsApps = void 0;
const codeFactory_1 = require("./codeFactory");
exports.JsApps = {
    name: "js-apps",
    title: "JS Applications Helper",
    commands: [{
            name: "create-node",
            title: "Create TON JS App",
            args: [{
                    isArg: true,
                    name: "name",
                    type: "string",
                }, {
                    name: "folder",
                    type: "folder",
                }],
            run: codeFactory_1.createJsApp,
        }],
};
//# sourceMappingURL=index.js.map