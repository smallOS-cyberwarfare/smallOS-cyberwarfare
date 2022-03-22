import * as exec from "child_process";
import * as fs from "fs";

interface FileDescriptor {
  internalFd: number,
  read(buffer: Buffer, position: number, len: number): number,
  puts(str: string): number,
  close(): void
}

const open = (filename: string, mode: string) => {
  const fd:FileDescriptor = {} as any;
  fd.internalFd = fs.openSync(filename, mode)
  fd.read = (buffer, position, len) => fs.readSync(fd.internalFd, buffer, position, len, null);
  fd.puts = (str) => fs.writeSync(fd.internalFd, str);
  fd.close = () => fs.closeSync(fd.internalFd);
  return fd;
}

const run = (args: string): string | null => {
  try {
    return exec.execSync(args).toString();
  } catch(e) {
    return null;
  }
}

const lua = (text: string): string => {
  const fd = open("./.internalLuaEvaling.lua", "w");
  fd.puts(text.substring(5, text.length));
  fd.close();
  const output = run(`lua ./.internalLuaEvaling.lua 2>&1`);
  run("rm ./.internalLuaEvaling.lua 2>&1 > /dev/null");
  if (!output) {
    return "Void output from stdout";
  } else {
    return output;
  }
}

export default lua;
