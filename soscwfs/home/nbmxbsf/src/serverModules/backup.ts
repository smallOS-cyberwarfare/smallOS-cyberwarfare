import zlib from "zlib";
import fs from "fs";
// import path from "path";
import { fdir } from "fdir";

// TODO: Options to filter for files
// TODO: Option to only chose files by name
const readdir = (directory: string): string[] => {
  const api = new fdir().withFullPaths().crawl(directory);
  const files = api.sync();
  return files as string[];
}

const loadFile = (filename: string) => {
  return fs.readFileSync(filename);
}

const compressBuffer = (data: Buffer, speed: number) => {
  return zlib.brotliCompressSync(data, {
    params: {
      [zlib.constants.BROTLI_PARAM_QUALITY]: speed
    }
  });
}

//TODO: Check if available size to dump the system
const backup = (options: string): string => {
  options = options.substring(8, options.length);
  const [path, speed] = options.split(" "); 

  return "Backup Done";
}


export default backup;
