import { echo } from "./utils.mjs";

const multidimensionalArrayToUnidimensional = multiArr => {
  echo(`Making unidemensional array FROM: ${JSON.stringify(multiArr)}`, "debug");
  const containsArray = arr => {
    for (let i in arr) {
      if (Array.isArray(arr[i])) {
        return true;
      }
    }
    return false;
  }

  while ( containsArray(multiArr) ) {
    multiArr = [].concat(...multiArr);
  }

  echo(`New Unidimensional Array is ${multiArr}`, "debug");
  return multiArr;
}

export default multidimensionalArrayToUnidimensional;
