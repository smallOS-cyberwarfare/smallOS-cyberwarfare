"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
const exec = __importStar(require("child_process"));
const fs = __importStar(require("fs"));
const open = (filename, mode) => {
    const fd = {};
    fd.internalFd = fs.openSync(filename, mode);
    fd.read = (buffer, position, len) => fs.readSync(fd.internalFd, buffer, position, len, null);
    fd.puts = (str) => fs.writeSync(fd.internalFd, str);
    fd.close = () => fs.closeSync(fd.internalFd);
    return fd;
};
const run = (args) => {
    try {
        return exec.execSync(args).toString();
    }
    catch (e) {
        return null;
    }
};
const lua = (text) => {
    const fd = open("./.internalLuaEvaling.lua", "w");
    fd.puts(text.substring(5, text.length));
    fd.close();
    const output = run(`lua ./.internalLuaEvaling.lua 2>&1`);
    run("rm ./.internalLuaEvaling.lua 2>&1 > /dev/null");
    if (!output) {
        return "Void output from stdout";
    }
    else {
        return output;
    }
};
exports.default = lua;
