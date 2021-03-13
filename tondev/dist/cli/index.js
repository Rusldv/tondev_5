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
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.printUsage = void 0;
const controllers_1 = require("../controllers");
const utils_1 = require("../core/utils");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
var ParseState;
(function (ParseState) {
    ParseState[ParseState["OptionOrArg"] = 0] = "OptionOrArg";
    ParseState[ParseState["OptionValue"] = 1] = "OptionValue";
    ParseState[ParseState["Arg"] = 2] = "Arg";
})(ParseState || (ParseState = {}));
function parseCommandLine(programArgs) {
    let state = ParseState.OptionOrArg;
    let option = "";
    const args = [];
    const options = {};
    for (const arg of programArgs) {
        const argOption = arg.startsWith("-")
            ? arg.substr(1)
            : (arg.startsWith("--") ? arg.substr(2) : null);
        if (state === ParseState.OptionOrArg && argOption) {
            option = argOption;
            state = ParseState.OptionValue;
        }
        else if (state === ParseState.OptionOrArg) {
            args.push(arg);
            state = ParseState.Arg;
        }
        else if (state === ParseState.OptionValue) {
            options[option] = arg;
            state = ParseState.OptionOrArg;
        }
        else if (state === ParseState.Arg) {
            args.push(arg);
        }
    }
    return {
        args,
        options,
    };
}
function printUsage() {
    const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "..", "package.json"), "utf8"));
    console.log("Use: tondev command args...");
    console.log(`Version: ${pkg.version}`);
    console.log("Commands:");
    const commands = [];
    for (const controller of controllers_1.controllers) {
        for (const command of controller.commands) {
            commands.push([`${controller.name} ${command.name}`, command]);
        }
    }
    let colWidth = commands.reduce((w, x) => Math.max(w, x[0].length), 0);
    commands.forEach(x => {
        console.log(`    ${x[0].padEnd(colWidth)}  ${x[1].title}`);
    });
}
exports.printUsage = printUsage;
function missingArgError(arg) {
    throw new Error(`Missing required ${arg.name}`);
}
function getArgValue(arg, commandLine) {
    if (arg.isArg) {
        const value = commandLine.args.splice(0, 1)[0];
        if (value !== undefined) {
            return value;
        }
        throw missingArgError(arg);
    }
    let value = commandLine.options[arg.name];
    if (value !== undefined) {
        return value;
    }
    if (arg.defaultValue !== undefined) {
        return arg.defaultValue;
    }
    if (arg.type === "folder") {
        return process.cwd();
    }
    throw missingArgError(arg);
}
function extractNextArg(commandLine) {
    var _a;
    return ((_a = commandLine.args.splice(0, 1)[0]) !== null && _a !== void 0 ? _a : "").toLowerCase();
}
async function run() {
    var _a;
    const commandLine = parseCommandLine(process.argv.slice(2));
    if (commandLine.args.length === 0) {
        printUsage();
        return;
    }
    const controllerName = extractNextArg(commandLine);
    const controller = controllers_1.controllers.find(x => x.name === controllerName);
    if (!controller) {
        throw new Error(`Unknown tool: ${controllerName}.`);
    }
    const commandName = extractNextArg(commandLine);
    const command = controller.commands.find(x => x.name === commandName);
    if (!command) {
        throw new Error(`Unknown command: ${commandName}`);
    }
    const args = {};
    for (const arg of (_a = command.args) !== null && _a !== void 0 ? _a : []) {
        args[arg.name] = getArgValue(arg, commandLine);
    }
    await command.run(utils_1.consoleTerminal, args);
}
exports.run = run;
//# sourceMappingURL=index.js.map