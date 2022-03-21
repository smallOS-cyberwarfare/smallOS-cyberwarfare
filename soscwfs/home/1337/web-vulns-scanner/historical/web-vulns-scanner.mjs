import fetch from "node-fetch";
import fs from "fs";

/* TODO: Include imports in a single module exporting all the functions */
import extractUrlsFromSource from "./modules/extract-urls-from-source.mjs";
import extractParametersFromUrl from "./modules/extract-parameters-from-url.mjs";
import xssParameterInjection from "./modules/xss-parameter-injection.mjs";
import xssTestInjection from "./modules/xss-test-injection.mjs";
import openRedir from "./modules/open-redir.mjs";
import openRedirTest from "./modules/open-redir-test.mjs";

const loadFile = filename => {
  try {
    filename = fs.readFileSync(filename, { encoding: "utf-8" })
  } catch(e) {
    filename = null;
  }
  return filename;
};

const quit = (msg, errorCode=0) => {
  console.log(msg);
  process.exit(errorCode);
}

const verbose = msg => {
  if (cli.verbose) {
    console.log(`+ ${msg}`);
  }
}

const cli = {};
const scriptArgs = process.argv;
for(let i in scriptArgs) {
  const next = scriptArgs[+i + 1];
  switch(scriptArgs[i]) {
    case "-t":
    case "--target":
      cli.target = loadFile(next);
      cli.targetFile = true;
      if (!cli.target) {
        cli.target = next;
	cli.targetFile = false;
      }
    break;

    case "-x":
    case "-xss":
    case "--xss":
      cli.xss = true;
    break;

    case "--xss-payload":
      cli.xssPayload = next;
    break;

    case "-r":
    case "--redir":
    case "--redirect":
    case "--open":
    case "--open-redir":
    case "--open-redirect":
      cli.openRedirect = true;
    break;

    case "--recursive-url-extraction":
      cli.recursiveUrlExtraction = next;
    break;
		  
    case "--show-extracted-urls":
      cli.showExtractedUrls = true;
    break;

    case "--filter-urls":
      cli.filter = next;
    break;

    case "-v":
    case "--verbose":
      cli.verbose = true;
    break;

    case "--version":
      quit("web-vulns-scanner 1.0.0");
		  
    case "-h":
    case "--help":
      quit(`usage: node web-vulns-scanner.mjs [OPTIONS]
-t,--target                       Full url of target
-x,--xss                          Scan XSS
-r,--open-redir                   Scan Open Redirect
-v,--verbose                      Print information about the scanner
  ,--version                      Print current version

  ,--recursive-url-extraction     Deep level 
  ,--show-extracted-urls          Show all urls found
  ,--filter-urls                  Only use urls that match a pattern

example:
node web-vulns-scanner.mjs --show-extracted-urls -t https://google.es --recursive-url-extraction 1 --filter-urls google --xss --open-redirect
`);

  }
}

const extractUrls = async target => {
  verbose(`Extracting urls from ${target}...`);
  const requestOptions = { headers: {} };
  requestOptions.headers["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36";
  verbose(`Setting user agent (${requestOptions.headers["User-Agent"]}) to use in subsequent node-fetch requests`);
  verbose(`Sending request...`);
  let response = await fetch(target, requestOptions);
  verbose(`Response recived, parsing response from server...`);
  const body = await response.text();
  verbose(`Request body extracted as ${body.substr(0,20)}...`);

  verbose(`Extracting urls from source...`);
  let urls = extractUrlsFromSource(body);

  /*if (cli.showExtractedUrls) {
    console.log(`Extracted URLS:
${JSON.stringify(urls, null, 2)}
`);
  }*/

  const numberOfUrls = urls.length;
  verbose(`${numberOfUrls} extracted from ${target} source, removing duplicates`);
  urls = [...new Set(urls)];
  verbose(`${numberOfUrls - urls.length} duplicates removed`);
  /*verbose(`[DEBUG]
${JSON.stringify(urls, null, 2)}
[/DEBUG]

`);*/
  //let params = [];
  let listOfUrlVectors = [];

  verbose(`Replacing parameter values to {{ PAYLOAD }} from query strings and returning full urls`);
  urls.forEach(url => {
    if (extractParametersFromUrl(url)) {
      //params.push(extractParametersFromUrl(url));
      listOfUrlVectors.push(extractParametersFromUrl(url)[2]);
    }
  });
  verbose(`Removing ${numberOfUrls - listOfUrlVectors.length} urls missing parameters in query string`);
  verbose(`${listOfUrlVectors.length} unique urls cointaining parameters extracted from source.
  
`);
  return [listOfUrlVectors, urls];
}

const filterUrls = (urls, pattern) => {
  verbose(`Filtering urls that are not including "${pattern}"...`);
  verbose(`Total urls (${urls.length})`);
  let aux = [];
  const regularExpr = new RegExp(pattern, "g");
  for (let i in urls) {
    if (regularExpr.test(urls[i])) {
console.log(`${urls[i]} passed the test ${regularExpr}`);
      aux.push(urls[i]);
    }
  }
  verbose(`${aux.length} urls matching the pattern`);
  return aux;
}

const XSS = async listOfUrlVectors => {
  verbose("Starting XSS scanner...");
  for (let i in listOfUrlVectors) {
    const url = listOfUrlVectors[i];
    verbose("Scanning " + url);
    const pattern = "{{ PAYLOAD }}";
    const injection = xssParameterInjection(url, pattern, "\"><img onerror=confirm('web-vulns-scanner') src=>");
    verbose(`Injection -> ${injection}`);
    const injected = await xssTestInjection(injection, "\\\<img onerror\\\=confirm\\\(\\\'web");
    verbose(`Injection test -> ${injected}`);
    if (injected) {
      console.log(`
XSS Result:
Injected: ${injected}

Injection: ${injection}


`);
    }
  }
}

const OPENREDIR = async listOfUrlVectors => {
  verbose("Starting Open Rediect scanner...");
  for (let i in listOfUrlVectors) {
    const url = listOfUrlVectors[i];
    verbose("Scanning " + url);
    const pattern = "{{ PAYLOAD }}";
    const openRedirUrl = openRedir(url, pattern, "//example.com");
    verbose(`Injection -> ${openRedirUrl}`);
    const redirect = await openRedirTest(openRedirUrl);
    verbose(`Injection test -> ${redirect}`);
    if (redirect) {
      console.log(`
Open Redirect Result:
FOUND -> ${openRedirUrl}


`);
    }
  }
}



let urls = [];
let originalUrls = [];

if (cli.targetFile) {
  verbose("Target detected as a file,.extracting urls...");
  const targets = cli.target.split("\n");
  targets.pop();
  verbose(`${targets.length} urls detected in file`);
  for (let i in targets) {
    let auxUrls = "";
    let auxOriginalUrls = "";
    if(targets[i]) {
      try {
        [auxUrls, auxOriginalUrls] = await extractUrls(targets[i]);
      } catch(err) {}

      urls.push(auxUrls);
      originalUrls.push(auxOriginalUrls);
    }
  }
  urls = [].concat(...urls);
  urls = [...new Set(urls)];
  originalUrls = [].concat(...originalUrls);
  originalUrls = [...new Set(originalUrls)];
} else {
  try {
    [urls, originalUrls] = await extractUrls(cli.target);
  } catch(err) {}
}

let endUrls = originalUrls;
console.log("STARTING URLS FOR RECURSIVE: " + endUrls.length);
console.log(endUrls);
endUrls = filterUrls(endUrls, cli.filter);
console.log("STARTING URLS FOR RECURSIVE FILTERED: " + endUrls.length);


console.log(`Found ${urls.length}`);
if (cli.recursiveUrlExtraction) {
  for (let i = 0; i < cli.recursiveUrlExtraction; ++i) {
    for (let j in originalUrls) {
//console.log(`Extracting from ${originalUrls[j]}`);
      try {
        const aux = await extractUrls(originalUrls[j]);
        endUrls.push(...aux);
      } catch(err) {}
    }
  }
}


if (!cli.targetFile) {
  endUrls = [].concat(...urls);
  endUrls = [...new Set(urls)];
}
endUrls = filterUrls(urls, cli.filter);
console.log(`${endUrls.length} ARE GOING TO BE USED...`);


let urlVectors = [];
try {
  for (let i in endUrls) {
    if (extractParametersFromUrl(endUrls[i])) {
      urlVectors.push(extractParametersFromUrl(endUrls[i])[2]);
    }
  }
} catch(err) {

}


if (cli.showExtractedUrls) {
  console.log(`Number of urls: ${urls.length}
Number of urls cointaining arguments: ${urlVectors.length}`);
  console.log(`${JSON.stringify(urlVectors, null, 2)}`);
}

if (cli.xss) {
  await XSS(urlVectors);
}

if (cli.openRedirect) {
  await OPENREDIR(urlVectors);
}
