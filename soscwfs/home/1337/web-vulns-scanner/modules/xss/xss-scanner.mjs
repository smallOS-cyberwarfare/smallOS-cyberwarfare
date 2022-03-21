import { xssParameterInjection, xssTestInjection } from "./xss.mjs";
import { appendToFile, echo } from "../utils/utils.mjs";

const xssScanner = async (listOfUrlVectors, options) => {
  echo("Starting XSS scanner...");
  let generatedUrls = [];
  for (let i in listOfUrlVectors) {
    const url = listOfUrlVectors[i];
    echo("Scanning " + url);
    const pattern = "{{ PAYLOAD }}";
    const injection = xssParameterInjection(url, pattern, "\"><img onerror=confirm('web-vulns-scanner') src=>");
    echo(`Injection -> ${injection}`, "debug");
    if (options.onlyGenerateUrls) {
      generatedUrls.push(injection);
      break;
    }
    const injected = await xssTestInjection(injection, "\\\<img onerror\\\=confirm\\\(\\\'web");
    echo(`Injection test -> ${injected}`, "debug");
    if (injected) {
      appendToFile("./output/results/xss-scanner-results.txt", `Injected: ${injected}

${injection}


`);
      echo(`
XSS Result:
Injected: ${injected}

Injection: ${injection}


`, "critical");
    }
  } 
  if (options.onlyGenerateUrls) {
    try {
      generatedUrls = generatedUrls.join("\n");
    } catch(err) {}
    appendToFile("./output/prepared/xss-scanner-urls.txt", generatedUrls);
  }
}

export default xssScanner;
