#!/usr/bin/env node

import {
  extractUrlsFromTarget,
  extractUrlsRecursively,
  prepareUrlsForInjection,
  filterUrls,
  processArguments,
  multidimensionalArrayToUnidimensional,
  removeArrayDuplicates,
  xssScanner,
  xssBruteForceScanner,
  openRedirectScanner,
  openRedirectBruteForceScanner,
  appendToFile
} from "./modules/modules.mjs";


global.userSelected = processArguments();

console.log(userSelected.target);

let urlsExtractedFromTargets = []
for (let i in userSelected.target) {
  const urlsExtractedFromTarget = await extractUrlsFromTarget(userSelected.target[i]);
  urlsExtractedFromTargets.push(urlsExtractedFromTarget);
}

urlsExtractedFromTargets = multidimensionalArrayToUnidimensional(urlsExtractedFromTargets);
urlsExtractedFromTargets = removeArrayDuplicates(urlsExtractedFromTargets);

if (userSelected.filter) {
  urlsExtractedFromTargets = filterUrls(urlsExtractedFromTargets, userSelected.filter);
}

if (userSelected.recursiveUrlExtraction) {
  urlsExtractedFromTargets = await extractUrlsRecursively(urlsExtractedFromTargets, userSelected.recursiveUrlExtraction);
}

let urlVectors = urlsExtractedFromTargets;

if (userSelected.filter) {
  urlVectors = filterUrls(urlsExtractedFromTargets, userSelected.filter);
}

if (userSelected.saveUrls) {
  appendToFile("./output/urls.txt", urlVectors.join("\n"));
}

if (userSelected.xssFullScan) {
  console.log("FULL")
  await xssBruteForceScanner(urlVectors);
}

if (userSelected.openRedirectFullScan) {
  await openRedirectBruteForceScanner(urlVectors);
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
