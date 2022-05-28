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
const _run = (args) => {
    try {
        return exec.execSync(args).toString();
    }
    catch (e) {
        return null;
    }
};
const getClientInfo = () => {
    var _a;
    const clientInfo = {};
    // Get Public IP Address
    clientInfo.ip = _run(`curl ifconfig.me --silent`);
    // Get Operative System name
    clientInfo.os = _run(`uname -o`);
    if (clientInfo.os[clientInfo.os.length - 1] === "\n") {
        clientInfo.os = clientInfo.os.substring(0, clientInfo.os.length - 1);
    }
    // Get Kernel Version
    clientInfo.kernel = _run(`uname -r`);
    if (clientInfo.kernel[clientInfo.kernel.length - 1] === "\n") {
        clientInfo.kernel = clientInfo.kernel.substring(0, clientInfo.kernel.length - 1);
    }
    // Get CPU Info
    const cpu = _run(`lscpu --json`);
    if (cpu) {
        const parsedCpu = JSON.parse(cpu);
        if (parsedCpu === null || parsedCpu === void 0 ? void 0 : parsedCpu.lscpu) {
            clientInfo.cpu = {};
            for (let i in parsedCpu.lscpu) {
                switch ((_a = parsedCpu.lscpu[i]) === null || _a === void 0 ? void 0 : _a.field) {
                    case "Architecture:":
                        clientInfo.cpu.architecture = parsedCpu.lscpu[i].data;
                        break;
                    case "CPU op-mode:":
                        clientInfo.cpu.opMode = parsedCpu.lscpu[i].data;
                        break;
                    case "Byte Order:":
                        clientInfo.cpu.byteOrder = parsedCpu.lscpu[i].data;
                        break;
                    case "CPU(s):":
                        clientInfo.cpu.cpus = parsedCpu.lscpu[i].data;
                        break;
                    case "On-line CPU(s) list:":
                        clientInfo.cpu.onlineCpus = parsedCpu.lscpu[i].data;
                        break;
                    case "Thread(s) per core:":
                        clientInfo.cpu.threadsPerCore = parsedCpu.lscpu[i].data;
                        break;
                    case "Core(s) per socket:":
                        clientInfo.cpu.coresPerSocket = parsedCpu.lscpu[i].data;
                        break;
                    case "Socket(s):":
                        clientInfo.cpu.sockets = parsedCpu.lscpu[i].data;
                        break;
                    case "Vendor ID:":
                        clientInfo.cpu.vendor = parsedCpu.lscpu[i].data;
                        break;
                    case "Model:":
                        clientInfo.cpu.model = parsedCpu.lscpu[i].data;
                        break;
                    case "Model name:":
                        clientInfo.cpu.modelName = parsedCpu.lscpu[i].data;
                        break;
                    case "Stepping:":
                        clientInfo.cpu.Stepping = parsedCpu.lscpu[i].data;
                        break;
                    case "CPU max MHz:":
                        clientInfo.cpu.maxClock = parsedCpu.lscpu[i].data;
                        break;
                    case "CPU min MHz:":
                        clientInfo.cpu.minClock = parsedCpu.lscpu[i].data;
                        break;
                    case "BogoMIPS:":
                        clientInfo.cpu.bogoMips = parsedCpu.lscpu[i].data;
                        break;
                    case "Flags:":
                        clientInfo.cpu.flags = parsedCpu.lscpu[i].data;
                }
            }
        }
    }
    // Get RAM info
    clientInfo.ram = {};
    const memoryOutput = _run("cat /proc/meminfo");
    if (memoryOutput) {
        const memory = memoryOutput.split("\n");
        for (let i in memory) {
            if (/memtotal/gi.test(memory[i])) {
                while (/  /.test(memory[i])) {
                    memory[i] = memory[i].replace(/\ \ /g, " ");
                }
                clientInfo.ram.total = (+memory[i].split(" ")[1] / 1024 / 1024).toString().substr(0, 5);
            }
            if (/memavailable/gi.test(memory[i])) {
                while (/  /.test(memory[i])) {
                    memory[i] = memory[i].replace(/\ \ /g, " ");
                }
                clientInfo.ram.available = (+memory[i].split(" ")[1] / 1024 / 1024).toString().substr(0, 5);
            }
        }
    }
    clientInfo.packages = {};
    const installed = _run(`apt list --installed 2> /dev/null | wc -l`);
    if (installed) {
        clientInfo.packages.installed = +installed;
    }
    const upgradable = _run(`apt list --upgradable 2> /dev/null | wc -l`);
    if (upgradable) {
        clientInfo.packages.upgradable = +upgradable;
    }
    const uptime = _run(`uptime -s`);
    if (uptime) {
        clientInfo.systemStarted = uptime;
    }
    if (clientInfo.systemStarted[clientInfo.systemStarted.length - 1] === "\n") {
        clientInfo.systemStarted = clientInfo.systemStarted.substring(0, clientInfo.systemStarted.length - 1);
    }
    return JSON.stringify(clientInfo, null, 2);
};
exports.default = getClientInfo;
