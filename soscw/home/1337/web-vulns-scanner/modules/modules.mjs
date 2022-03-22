import { openRedirTest, openRedir, openRedirectScanner, openRedirectBruteForceScanner } from "./open-redirect/open-redirect.mjs";
import { xssParameterInjection, xssScanner, xssTestInjection, xssBruteForceScanner } from "./xss/xss.mjs";
import { loadFile, processArguments, quit, multidimensionalArrayToUnidimensional, removeArrayDuplicates, writeToFile, appendToFile, echo } from "./utils/utils.mjs";
import { extractParametersFromUrl, filterUrls, extractUrlsFromSource, prepareUrlsForInjection, extractUrlsFromTarget, extractUrlsFromFile, extractUrlsRecursively } from "./urls/urls.mjs";

export { 

  //open redirect modules
  openRedirTest,
  openRedir,
  openRedirectScanner,
  openRedirectBruteForceScanner,

  //xss modules
  xssParameterInjection,
  xssScanner,
  xssTestInjection,
  xssBruteForceScanner,

  //utils modules
  loadFile,
  processArguments,
  quit,
  multidimensionalArrayToUnidimensional,
  removeArrayDuplicates,
  writeToFile,
  appendToFile,
  echo,

  //urls modules
  extractParametersFromUrl,
  filterUrls,
  extractUrlsFromSource,
  prepareUrlsForInjection,
  extractUrlsFromTarget,
  extractUrlsFromFile,
  extractUrlsRecursively
}
