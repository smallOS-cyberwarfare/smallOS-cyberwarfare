#!/usr/bin/env node

import fs from "fs";
import exec from "child_process";
import readline from "readline";


interface FileDescriptor {
  internalFd: number,
  read(buffer: Buffer, position: number, len: number): number,
  puts(str: string): number,
  close(): void
}


const run = (args: string): string => {
  let res = exec.execSync(args).toString()
  return res;
};


const open = (filename: string, mode: string) => {
  const fd: FileDescriptor = {} as any;
  try {
    fd.internalFd = fs.openSync(filename, mode)
    fd.read = (buffer, position, len) => fs.readSync(fd.internalFd, buffer, position, len, null);
    fd.puts = (str) => fs.writeSync(fd.internalFd, str);
    fd.close = () => fs.closeSync(fd.internalFd);
    return fd;
  } catch(err) {
    console.log("open " + err);
    return fd;
  }
}


const javascriptFunctions = `const fs = require("fs");
const exec = require("child_process");

const run = (args) => {
  let res = exec.execSync(args).toString()
  return res;
};

const loadFile = (filename) => {
  let retValue;
  try {
    retValue = fs.readFileSync(filename, { encoding: "utf-8" })
  } catch(e) {
    retValue = null;
  }
  return retValue;
};



`;

// this function is necesary since the input is written directly into a literal string declaration
const encodePipedInput = (input: string) => Buffer.from(input).toString("base64");


// TODO: Use in memory file, not disk
let result = "";
try {

  if (!process.stdin.isTTY) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });

    rl.on("line", line => {
      //console.log("THE LINE IS: " + line);
      //console.log("The arguments are: " + process.argv.join(" ") );
      const fd = open(".internalJsEvaling.js", "w+");
      fd.puts(`${javascriptFunctions}
      const pipedStdin = Buffer.from("${encodePipedInput(line)}", "base64").toString("ascii");
      ${process.argv.splice(2, 1)}`);
      fd.close();
      result = run("node .internalJsEvaling.js 2>&1");
      run("rm .internalJsEvaling.js");
      console.log(result);
    });
    
  } else {
    const fd = open(".internalJsEvaling.js", "w+");
    fd.puts(`${javascriptFunctions}${process.argv.splice(2, 1)}`);
    fd.close();
    result = run("node .internalJsEvaling.js 2>&1");
    run("rm .internalJsEvaling.js");
    console.log(result);
  }

} catch(err) {
  result = `Error running the code: ${err}`;
  console.log(result);
}


