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
exports.jsCreateCommand = void 0;
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const indexJs = `
const {TONClient} = require("@tonclient/core");
const {libNode} = require("@tonclient/lib-node");

TONClient.useBinaryLibrary(libNode);

(async () => {
    try {
        await main(new TONClient({ 
            network: { 
                server_address: "http://localhost:8080" 
            }
        }));
    } catch (err) {
        console.error(err);
    }
})();

async function main(client) {
    console.log((await client.client.version()).version);
}

`;
const packageJson = `
{
    "dependencies": {
        "@tonclient/core": "^1",
        "@tonclient/lib-node": "^1"
    }
}
`;
exports.jsCreateCommand = {
    name: "create",
    title: "Create TON JS App",
    args: [{
            isArg: true,
            name: "name",
            type: "string",
        }, {
            name: "folder",
            type: "folder",
        }],
    async run(terminal, args) {
        const appFolderPath = path_1.default.resolve(args.folder, args.name);
        fs.mkdirSync(appFolderPath, { recursive: true });
        fs.writeFileSync(path_1.default.resolve(appFolderPath, "index.js"), indexJs);
        fs.writeFileSync(path_1.default.resolve(appFolderPath, "package.json"), packageJson);
        terminal.log(`App created in ${appFolderPath}`);
    },
};
//# sourceMappingURL=create.js.map