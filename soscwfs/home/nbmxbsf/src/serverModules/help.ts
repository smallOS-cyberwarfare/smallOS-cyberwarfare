const help = (text: string) => {
  console.log("help called");
  const helpCommand = text.substring(6, text.length);
  if (helpCommand) {
    switch(helpCommand) {
      case "backup":
        return `/command path
path is the filesystem path you wabt to backup. Example:
/backup /home`;
      /* TODO: End all the help commands */
        default:
	  return `There is no help for ${helpCommand}.`;
    }


    return "Help Recv (" + helpCommand + ")";
  } else {
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

/ransomware mode key path speed
Encrypt/Decrypt all the files under path
mode  -> e,d
key   -> your_key
path  -> /home/folderToEncrypt
speed -> 1,2,3,4,5,6,7,8,9,10,11 (faster to slowest)

`;
  }
}


export default help;
