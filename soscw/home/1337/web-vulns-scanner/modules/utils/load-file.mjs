import fs from "fs";
import { echo } from "./utils.mjs";

const loadFile = filename => {
  echo(`Testing if ${filename} is a file.. `, "debug");
  try {
    filename = fs.readFileSync(filename, { encoding: "utf-8" });
    echo(`Is a file.`, "debug");
  } catch(e) {
    filename = null;
    echo(`Is a string.`, "debug");
  }
  return filename;
};

export default loadFile;
