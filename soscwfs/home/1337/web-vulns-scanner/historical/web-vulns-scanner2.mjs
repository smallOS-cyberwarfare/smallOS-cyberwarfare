import {
  extractUrlsFromTarget,
  prepareUrlsForInjection,
  filterUrls,
  processArguments,
  multidimensionalArrayToUnidimensional,
  removeArrayDuplicates,
  xssScanner,
  openRedirectScanner
} from "./modules/modules.mjs";


const userSelected = processArguments();

console.log(userSelected.target);

let urlsExtractedFromTargets = []
for (let i in userSelected.target) {
  const urlsExtractedFromTarget = await extractUrlsFromTarget(userSelected.target[i]);
  urlsExtractedFromTargets.push(urlsExtractedFromTarget);
}

urlsExtractedFromTargets = multidimensionalArrayToUnidimensional(urlsExtractedFromTargets);
urlsExtractedFromTargets = removeArrayDuplicates(urlsExtractedFromTargets);


if (userSelected.recursiveUrlExtraction) {
  console.log(`Extracting recursively ${userSelected.recursiveUrlExtraction} times from a total of ${urlsExtractedFromTargets.length} diferent urls`);
  let recursiveUrls = [];
  let lastPool;
  for (let i = 0; i < userSelected.recursiveUrlExtraction; ++i) {
    let recursiveUrlsExtractedFromTargets = [];
    let listOfUrls;
    if (i == 0) {
      listOfUrls = urlsExtractedFromTargets;
    } else {
      listOfUrls = lastPool;
    }
    for (let j in listOfUrls) {
      const urlsExtractedFromTarget = await extractUrlsFromTarget(listOfUrls[j]);
      recursiveUrlsExtractedFromTargets.push(urlsExtractedFromTarget);
    }
    recursiveUrlsExtractedFromTargets = multidimensionalArrayToUnidimensional(recursiveUrlsExtractedFromTargets);
    recursiveUrlsExtractedFromTargets = removeArrayDuplicates(recursiveUrlsExtractedFromTargets);
    recursiveUrls.push(recursiveUrlsExtractedFromTargets);
    lastPool = recursiveUrlsExtractedFromTargets;
  }
  recursiveUrls = multidimensionalArrayToUnidimensional(recursiveUrls);
  recursiveUrls = removeArrayDuplicates(recursiveUrls);
  urlsExtractedFromTargets = recursiveUrls;
  console.log(`A total of ${urlsExtractedFromTargets.length} has been extracted`);
}

let urlVectors;
if (userSelected.filter) {
  urlVectors = filterUrls(urlsExtractedFromTargets, userSelected.filter);
}

if (userSelected.saveUrls) {
  
}

urlVectors = prepareUrlsForInjection(urlsExtractedFromTargets);

const xssOptions = {};
const openRedirOptions = {};
if (userSelected.savePreparedUrls) {
  xssOptions.onlyGenerateUrls = true;
  openRedirOptions.onlyGenerateUrls = true;
}


if (userSelected.xss) {
  await xssScanner(urlVectors, xssOptions);
}

if (userSelected.openRedirect) {
  await openRedirectScanner(urlVectors, openRedirOptions);
}
