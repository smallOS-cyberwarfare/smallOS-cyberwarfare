import { echo } from "./utils.mjs";

const removeArrayDuplicates = arr => {
  const len = arr.length;
  arr = [...new Set(arr)];
  echo(`Removed ${len - arr.length} duplicated entries from the array`, "verbose");
  return arr;
}

export default removeArrayDuplicates;
