import { extractUrlsFromTarget } from "./urls.mjs";
import { multidimensionalArrayToUnidimensional, removeArrayDuplicates, echo } from "../utils/utils.mjs";

const extractUrlsRecursively = async (urls, deepLevel) => {
  echo(`Extracting recursively ${deepLevel} times from a total of ${urls.length} diferent urls`);
  let recursiveUrls = [];
  let lastPool;
  for (let i = 0; i < deepLevel; ++i) {
    let recursiveUrlsExtractedFromTargets = [];                            let listOfUrls;
    if (i == 0) {
      listOfUrls = urls;
    } else {
      listOfUrls = lastPool;                                               }
    for (let j in listOfUrls) {
      const urlsExtractedFromTarget = await extractUrlsFromTarget(listOfUrls[j]);
      recursiveUrlsExtractedFromTargets.push(urlsExtractedFromTarget);     }
    recursiveUrlsExtractedFromTargets = multidimensionalArrayToUnidimensional(recursiveUrlsExtractedFromTargets);
    recursiveUrlsExtractedFromTargets = removeArrayDuplicates(recursiveUrlsExtractedFromTargets);
    recursiveUrls.push(recursiveUrlsExtractedFromTargets);
    lastPool = recursiveUrlsExtractedFromTargets;
  }
  recursiveUrls = multidimensionalArrayToUnidimensional(recursiveUrls);
  recursiveUrls = removeArrayDuplicates(recursiveUrls);
  urls = recursiveUrls;
  echo(`A total of ${urls.length} has been extracted`);
  return urls;
}

export default extractUrlsRecursively;
