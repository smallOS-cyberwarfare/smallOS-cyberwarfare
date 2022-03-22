"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const help = (text) => {
    console.log("help called");
    const helpCommand = text.substring(5, text.length);
    if (helpCommand) {
        console.log("Returning help command");
        return "Help Recv (" + helpCommand + ")";
    }
    else {
        console.log("Else called");
        return `
- Not Implemented Commands:

/backup path host
Send all the files from the path (recursively) to a remote host.

/dumpNetwork
Capture the network traffic

/findCredentials
Find files holding sensitive information in the filesystem

/pe
Try to log as root in the system 

/keylogger
Save key logs

/persistence
Make the malware persist in the system

/pivot
Try to spread the malware to other computers, devices and networks

/ransomware path host <key>
Encrypt all the files from the path (recursively). Ask the encryption key to remote host or provide it from telegram

/stealth
Make the program hidde it's processes

/sendMail email subject message
Send a email



- Ready To Use Commands:
  
/help <command>
Show this help message. If command is also provideed, show command extended help message.

/list
Show loaded modules

/getClientInfo
Show miscellanea information from the client machine (ip, cpu, ram, packages...)

/run command
Run shell commands and bash code

/go code
Run go code

/cpp code
Run c++ (clang g++) code

/js code
Run javascript (node) code

/lua code
Run lua code

/python code
Run python code

`;
    }
};
exports.default = help;
