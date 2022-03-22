#!/usr/bin/env node

import * as fs from "fs";
import * as exec from "child_process";

// Show Message and close the program
const exit = (output: string) => {
  console.log(output);
  process.exit();
}

// Run OS commands
const _run = (args: string): string | null => {
  try {
    return exec.execSync(args).toString();
  } catch(e) {
    return null;
  }
}

// Load a file as utf-8 encoding 
const loadFile = (filename: string): string | null => {
  let retValue: string | null;
  try {
    retValue = fs.readFileSync(filename, { encoding: "utf-8" })
  } catch(e) {
    retValue = null;
  }
  return retValue ? retValue.substring(0, retValue.length-1) : null;
}

// fd types
interface FileDescriptor {
  internalFd: number,
  read(buffer: Buffer, position: number, len: number): number,
  puts(str: string): number,
  close(): void
}

// open a file for write or for appending
const open = (filename: string, mode: string) => {
  const fd:FileDescriptor = {} as any;
  fd.internalFd = fs.openSync(filename, mode)
  fd.read = (buffer, position, len) => fs.readSync(fd.internalFd, buffer, position, len, null);
  fd.puts = (str) => fs.writeSync(fd.internalFd, str);
  fd.close = () => fs.closeSync(fd.internalFd);
  return fd;
}

// get list of files under path
const readdir = (path: string): string[] | null => {
  try {
    return fs.readdirSync(path);
  } catch(e) {
    return null;
  }
}

// import modules under ./serverModules/ folder
const importModules = async (modulesList: string[]) => {
  return new Promise( (resolve) => {
    const path = "./serverModules";
    // @ts-ignore
    const promises = modulesList.map( modules => import(`${path}/${modules}`).then( mod => global[`${modules}`] = mod ) );

    Promise.all(promises)
    .then( results => {
      resolve("This function took me 6 hours of requires and imports. I'm proud");
    });
  });
}

// get new messages from telegram API
const getUpdates = (token: string) => _run(`curl 'https://api.telegram.org/bot${token}/getUpdates' --silent`);

// delete the messages from telegram API
const deleteMessages = (token: string) => {
  _run(`curl https://api.telegram.org/bot${token}/getUpdates?offset=${+lastId + 1} --silent`);
}

// Escape quotes to avoid breaking command inside bash shell
const escapeString = (text: string) => {
  return encodeURIComponent(text).replace(/\'/g, `'"'"'`);;
}

// answer to chat. If response is to big for telegram, send multiple.
const sendResponse = (response: string, chatId: number) => {
  if (escapeString(response).length > 4000) {
    _run(`curl 'https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${chatId}&text=${"Response is chunked:"}' --silent `);
    let i = 0;
    do {
      _run(`curl 'https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${chatId}&text=${escapeString(response.substring(i, i + 3500))}' --silent `);
      _run(`sleep 1s`);
      i += 3500;
    } while (i < response.length);
  } else {
    _run(`curl 'https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${chatId}&text=${escapeString(response)}' --silent `);
  }
}

// Check if the user is logged in this program
const isLoggedInUser = (username: string) => {
  for (let i in loggedInUsers) {
    if (username === loggedInUsers[i]) {
      return true;
    }
  }
  return false;
}

// Process the recv messages from telegram and instruct what to do
const processData = (text: string, username: string, chatId: number) => {
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
      } else {
        sendResponse(modulesList.join("\n"), chatId);
      }
    }

    // TODO: Install new modules
    
    // TODO: Save new modules

    // TODO: Do not load modules by default, let user chose

    // Run All Modules if they command match with their name
    modulesList.forEach( modules => {
      if (text.substring(1, modules.length + 1).toLowerCase() === modules.toLowerCase()) {
	// @ts-ignore
	sendResponse(global[`${modules}`]?.default(text), chatId);
      }
    });
  }
}

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
const modulesList: string[] = [];
if (modules) {
  // remove .ts extension from modules and add them to modules list
  modules.forEach( moduleName => {
    if (/\.ts/gi.test(moduleName)) {
      modulesList.push(moduleName.split(".ts")[0]);
    }
  });
}

// global array for save the users logged in
const loggedInUsers: string[] = [];

// variable to save last mesaage id (to remove old messages from API)
let lastId = 0;

// main function
(async () => {
  // wait until all modules are imported
  await importModules(modulesList);

  // endless loop to keep the program running
  for (;;) {
    // get new messages from telegram API
    const updates = getUpdates(TOKEN as string);
    if (!updates) {
      // Error when bad internet connection, server down or wrong token
      exit("Unable to retrieve updates");
    } 

    // Parse the telegram API as JSON to get an object
    const updatesObj = JSON.parse(updates as string);
    if (updatesObj?.ok !== true) {
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
    messages.forEach( (messageArr: any) => {
      // for each message found, do the next:

      // The message
      const text = messageArr?.message?.text;
      // The user who send the message
      const username = messageArr?.message?.from?.username;
      // The id of the chat where the message came from
      const chatId = messageArr?.message?.chat?.id;
      // The id of the last message
      lastId = messageArr?.update_id; 

      // If text, username and chatId found:
      if (text && username && chatId) {
	// Instruct what to do with recev message from user in chat
        processData(text, username, chatId);
      }
    });

    // Once the processing of messages end, delete the messages
    deleteMessages(TOKEN as string);
    // Make a system sleep to avoid waste of resources
    _run(`sleep 10s`);
  }
})();
