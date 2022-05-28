"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zlib_1 = __importDefault(require("zlib"));
const fs_1 = __importDefault(require("fs"));
// import path from "path";
const fdir_1 = require("fdir");
// TODO: Options to filter for files
// TODO: Option to only chose files by name
const readdir = (directory) => {
    const api = new fdir_1.fdir().withFullPaths().crawl(directory);
    const files = api.sync();
    return files;
};
const loadFile = (filename) => {
    return fs_1.default.readFileSync(filename);
};
const compressBuffer = (data, speed) => {
    return zlib_1.default.brotliCompressSync(data, {
        params: {
            [zlib_1.default.constants.BROTLI_PARAM_QUALITY]: speed
        }
    });
};
//TODO: Check if available size to dump the system
const backup = (options) => {
    options = options.substring(8, options.length);
    const [path, speed] = options.split(" ");
    return "Backup Done";
};
exports.default = backup;
