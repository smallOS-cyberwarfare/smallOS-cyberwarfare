import url from "url";
import { openRedir, openRedirTest } from "./open-redirect.mjs";
import { appendToFile, echo } from "../utils/utils.mjs";

const openRedirectScanner = async (listOfUrlVectors, options) => {
  echo("Starting Open Rediect scanner...");
  let generatedUrls = []; 
  for (let i in listOfUrlVectors) {
    const url = listOfUrlVectors[i];
    echo("Scanning " + url);
    const pattern = "{{ PAYLOAD }}";
    const openRedirUrl = openRedir(url, pattern, "//example.com");
    echo(`Injection -> ${openRedirUrl}`, "debug");
    if (options.onlyGenerateUrls) {
      generatedUrls.push(openRedirUrl);
      break;
    }

    let redirect = {};
    try {
      redirect = await openRedirTest(openRedirUrl);
    } catch(err) {
      echo(`${err.message} fetching ${url}`, "warning");
      return null;
    }
    echo(`Injection test -> ${redirect}`, "debug");
    if (redirect) {
      appendToFile("output/results/open-redirect-scanner-results.txt", `${openRedirUrl}


`);
      echo(`
Open Redirect Result:
FOUND -> ${openRedirUrl}


`, "critical");
    }
  }
  if (options.onlyGenerateUrls) {
    if (generatedUrls) {
      try {
        generatedUrls = generatedUrls.join("\n");
      } catch(err) {}
    }
    appendToFile("./output/prepared/open-redirect-scanner-urls.txt", generatedUrls);
  }
}

export default openRedirectScanner;
