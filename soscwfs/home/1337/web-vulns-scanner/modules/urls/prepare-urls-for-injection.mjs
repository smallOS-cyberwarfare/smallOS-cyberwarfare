import { extractParametersFromUrl } from "./urls.mjs";
import { echo } from "../utils/utils.mjs";

const prepareUrlsForInjection = urls => {
  let listOfUrlVectors = [];
  echo(`Preparing urls for injection`);
  echo(`Replacing parameter values to {{ PAYLOAD }} from query strings and returning full urls`, "verbose");
  for (let i in urls) {
    const url = urls[i];
    if (extractParametersFromUrl(url)) {
      listOfUrlVectors.push(extractParametersFromUrl(url)[2]);
    }
  }
  echo(`Removing ${urls.length - listOfUrlVectors.length} urls missing parameters in query string`, "verbose");
  echo(`${listOfUrlVectors.length} unique urls cointaining parameters extracted from source.
`);
  return listOfUrlVectors;
}

export default prepareUrlsForInjection;
