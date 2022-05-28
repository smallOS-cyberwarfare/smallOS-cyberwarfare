#!/usr/bin/env node
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const exec = __importStar(require("child_process"));
// Show Message and close the program
const exit = (output) => {
    console.log(output);
    process.exit();
};
// Run OS commands
const _run = (args) => {
    try {
        return exec.execSync(args).toString();
    }
    catch (e) {
        return null;
    }
};
// Load a file as utf-8 encoding 
const loadFile = (filename) => {
    let retValue;
    try {
        retValue = fs.readFileSync(filename, { encoding: "utf-8" });
    }
    catch (e) {
        retValue = null;
    }
    return retValue ? retValue.substring(0, retValue.length - 1) : null;
};
// open a file for write or for appending
const open = (filename, mode) => {
    const fd = {};
    fd.internalFd = fs.openSync(filename, mode);
    fd.read = (buffer, position, len) => fs.readSync(fd.internalFd, buffer, position, len, null);
    fd.puts = (str) => fs.writeSync(fd.internalFd, str);
    fd.close = () => fs.closeSync(fd.internalFd);
    return fd;
};
// get list of files under path
const readdir = (path) => {
    try {
        return fs.readdirSync(path);
    }
    catch (e) {
        return null;
    }
};
// import modules under ./serverModules/ folder
const importModules = (modulesList) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        const path = "./serverModules";
        // @ts-ignore
        const promises = modulesList.map(modules => Promise.resolve().then(() => __importStar(require(`${path}/${modules}`))).then(mod => global[`${modules}`] = mod));
        Promise.all(promises)
            .then(results => {
            resolve("This function took me 6 hours of requires and imports. I'm proud");
        });
    });
});
// get new messages from telegram API
const getUpdates = (token) => _run(`curl 'https://api.telegram.org/bot${token}/getUpdates' --silent`);
// delete the messages from telegram API
const deleteMessages = (token) => {
    _run(`curl https://api.telegram.org/bot${token}/getUpdates?offset=${+lastId + 1} --silent`);
};
// Escape quotes to avoid breaking command inside bash shell
const escapeString = (text) => {
    return encodeURIComponent(text).replace(/\'/g, `'"'"'`);
    ;
};
// answer to chat. If response is to big for telegram, send multiple.
const sendResponse = (response, chatId) => {
    if (escapeString(response).length > 4000) {
        _run(`curl 'https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${chatId}&text=${"Response is chunked:"}' --silent `);
        let i = 0;
        do {
            _run(`curl 'https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${chatId}&text=${escapeString(response.substring(i, i + 3500))}' --silent `);
            _run(`sleep 1s`);
            i += 3500;
        } while (i < response.length);
    }
    else {
        _run(`curl 'https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${chatId}&text=${escapeString(response)}' --silent `);
    }
};
// Check if the user is logged in this program
const isLoggedInUser = (username) => {
    for (let i in loggedInUsers) {
        if (username === loggedInUsers[i]) {
            return true;
        }
    }
    return false;
};
// Process the recv messages from telegram and instruct what to do
const processData = (text, username, chatId) => {
    console.log(`${username} send me "${text}" using chat n°${chatId}`);
    // Log the user in this program is password is right
    if (text === "/login " + PASSWORD) {
        loggedInUsers.push(username);
        sendResponse(`${username} is logged in`, chatId);
    }
    // TODO: Limit the amounth of login intents
    // Any user hardcoded commands/modules should go here:
    // Commands for any user (not logged in users too):
    /*
      if (/hello/gi.test(text) || /\/start/gi.test(text)) {
        sendResponse(`Hey ${username}, how are you?`, chatId);
      }
    */
    // Only logged in users commands:
    if (isLoggedInUser(username)) {
        // List Available Modules
        if (text.substring(0, 5).toLowerCase() === "/list") {
            if (!modulesList) {
                sendResponse("No modules available", chatId);
            }
            else {
                sendResponse(modulesList.join("\n"), chatId);
            }
        }
        // TODO: Install new modules
        // TODO: Save new modules
        // TODO: Do not load modules by default, let user chose
        // Run All Modules if they command match with their name
        modulesList.forEach(modules => {
            var _a;
            if (text.substring(1, modules.length + 1).toLowerCase() === modules.toLowerCase()) {
                // @ts-ignore
                sendResponse((_a = global[`${modules}`]) === null || _a === void 0 ? void 0 : _a.default(text), chatId);
            }
        });
    }
};
// load telegram token from file
const TOKEN = loadFile("./token.txt");
if (!TOKEN) {
    exit("Unable to find token.txt file");
}
// load program password from file
const PASSWORD = loadFile("./password.txt");
if (!PASSWORD) {
    exit("Unable to find password.txt file");
}
// get the list of available modules in folder
const modules = readdir("./src/serverModules");
const modulesList = [];
if (modules) {
    // remove .ts extension from modules and add them to modules list
    modules.forEach(moduleName => {
        if (/\.ts/gi.test(moduleName)) {
            modulesList.push(moduleName.split(".ts")[0]);
        }
    });
}
// global array for save the users logged in
const loggedInUsers = [];
// variable to save last mesaage id (to remove old messages from API)
let lastId = 0;
// main function
(() => __awaiter(void 0, void 0, void 0, function* () {
    // wait until all modules are imported
    yield importModules(modulesList);
    // endless loop to keep the program running
    for (;;) {
        // get new messages from telegram API
        const updates = getUpdates(TOKEN);
        if (!updates) {
            // Error when bad internet connection, server down or wrong token
            exit("Unable to retrieve updates");
        }
        // Parse the telegram API as JSON to get an object
        const updatesObj = JSON.parse(updates);
        if ((updatesObj === null || updatesObj === void 0 ? void 0 : updatesObj.ok) !== true) {
            // Error when token is wrong or you're banned
            exit("Telegram API is return an error");
        }
        // Get the array of new messages
        const messages = updatesObj.result;
        if (!messages) {
            // This error should not be possible, a void array is expect
            exit("No messages to parse");
        }
        // loop the array
        messages.forEach((messageArr) => {
            // for each message found, do the next:
            var _a, _b, _c, _d, _e;
            // The message
            const text = (_a = messageArr === null || messageArr === void 0 ? void 0 : messageArr.message) === null || _a === void 0 ? void 0 : _a.text;
            // The user who send the message
            const username = (_c = (_b = messageArr === null || messageArr === void 0 ? void 0 : messageArr.message) === null || _b === void 0 ? void 0 : _b.from) === null || _c === void 0 ? void 0 : _c.username;
            // The id of the chat where the message came from
            const chatId = (_e = (_d = messageArr === null || messageArr === void 0 ? void 0 : messageArr.message) === null || _d === void 0 ? void 0 : _d.chat) === null || _e === void 0 ? void 0 : _e.id;
            // The id of the last message
            lastId = messageArr === null || messageArr === void 0 ? void 0 : messageArr.update_id;
            // If text, username and chatId found:
            if (text && username && chatId) {
                // Instruct what to do with recev message from user in chat
                processData(text, username, chatId);
            }
        });
        // Once the processing of messages end, delete the messages
        deleteMessages(TOKEN);
        // Make a system sleep to avoid waste of resources
        _run(`sleep 10s`);
    }
}))();
