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
exports.stringTerminal = exports.nullTerminal = exports.consoleTerminal = exports.uniqueFilePath = exports.run = exports.downloadFromBinaries = exports.changeExt = exports.executableName = void 0;
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const fs = __importStar(require("fs"));
const child_process_1 = require("child_process");
const http = __importStar(require("http"));
const zlib = __importStar(require("zlib"));
function executableName(name) {
    return `${name}${os.platform() === "win32" ? ".exe" : ""}`;
}
exports.executableName = executableName;
function changeExt(path, newExt) {
    return path.replace(/\.[^/.]+$/, newExt);
}
exports.changeExt = changeExt;
function downloadAndGunzip(dest, url) {
    return new Promise((resolve, reject) => {
        const request = http.get(url, response => {
            if (response.statusCode !== 200) {
                reject({
                    message: `Download from ${url} failed with ${response.statusCode}: ${response.statusMessage}`,
                });
                return;
            }
            let file = fs.createWriteStream(dest, { flags: "w" });
            let opened = false;
            const failed = (err) => {
                if (file) {
                    file.close();
                    file = null;
                    fs.unlink(dest, () => {
                    });
                    reject(err);
                }
            };
            const unzip = zlib.createGunzip();
            unzip.pipe(file);
            response.pipe(unzip);
            request.on("error", err => {
                failed(err);
            });
            file.on("finish", () => {
                if (opened && file) {
                    resolve();
                }
            });
            file.on("open", () => {
                opened = true;
            });
            file.on("error", err => {
                if (err.code === "EEXIST" && file) {
                    file.close();
                    reject("File already exists");
                }
                else {
                    failed(err);
                }
            });
        });
    });
}
async function downloadFromBinaries(terminal, dstPath, src, options) {
    src = src.replace("{p}", os.platform());
    const srcUrl = `http://sdkbinaries.tonlabs.io/${src}.gz`;
    terminal.write(`Downloading from ${srcUrl} to ${dstPath} ...`);
    const dstDir = path.dirname(dstPath);
    if (!fs.existsSync(dstDir)) {
        fs.mkdirSync(dstDir, { recursive: true });
    }
    await downloadAndGunzip(dstPath, srcUrl);
    if ((options === null || options === void 0 ? void 0 : options.executable) && os.platform() !== "win32") {
        fs.chmodSync(dstPath, 0o755);
    }
    terminal.write("\n");
}
exports.downloadFromBinaries = downloadFromBinaries;
function run(name, args, options, terminal) {
    return new Promise((resolve, reject) => {
        try {
            const isWindows = os.platform() === "win32";
            const spawned = isWindows
                ? child_process_1.spawn("cmd.exe", ["/c", name].concat(args), {
                    env: process.env,
                    ...options,
                })
                : child_process_1.spawn(name, args, {
                    env: process.env,
                    ...options,
                });
            const errors = [];
            const output = [];
            spawned.stdout.on("data", function (data) {
                const text = data.toString();
                output.push(text);
                terminal.log(text);
            });
            spawned.stderr.on("data", (data) => {
                const text = data.toString();
                errors.push(text);
                terminal.writeError(text);
            });
            spawned.on("error", (err) => {
                reject(err);
            });
            spawned.on("close", (code) => {
                if (code === 0) {
                    resolve(output.join(""));
                }
                else {
                    reject(errors.join(""));
                }
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.run = run;
function uniqueFilePath(folderPath, namePattern) {
    let index = 0;
    while (true) {
        const filePath = path.resolve(folderPath, namePattern.replace("{}", index === 0 ? "" : index.toString()));
        if (!fs.existsSync(filePath)) {
            return filePath;
        }
        index += 1;
    }
}
exports.uniqueFilePath = uniqueFilePath;
exports.consoleTerminal = {
    write(text) {
        process.stdout.write(text);
    },
    writeError(text) {
        process.stderr.write(text);
    },
    log(...args) {
        console.log(...args);
    },
};
exports.nullTerminal = {
    write(_text) {
    },
    writeError(_text) {
    },
    log(..._args) {
    },
};
function stringTerminal() {
    return {
        output: "",
        error: "",
        write(text) {
            this.output += text;
        },
        writeError(text) {
            this.error += text;
        },
        log(...args) {
            this.write(`${args.map(x => `${x}`).join(" ")}\n`);
        },
    };
}
exports.stringTerminal = stringTerminal;
//# sourceMappingURL=utils.js.map