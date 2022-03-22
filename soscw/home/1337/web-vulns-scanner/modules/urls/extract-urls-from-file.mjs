import { loadFile, echo } from "../utils/utils.mjs";

const extractUrlsFromFile = filename => {
  echo(`Extracting urls from ${filename}`, "debug");
  const contents = loadFile(filename);
  if (contents) {
    let lines = contents.split("\n");
    lines.pop();
    return lines;
  } else {
    return contents;
  }
}

export default extractUrlsFromFile;
