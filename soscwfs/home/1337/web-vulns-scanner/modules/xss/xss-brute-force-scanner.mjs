import { xssTestInjection } from "./xss.mjs";
import { appendToFile, echo } from "../utils/utils.mjs";

const xssBruteForceScanner = async urls => {
  const sinks = [
    "?callback",
    "?q",
    "?s",
    "?search",
    "?id",
    "?lang",
    "?keyword",
    "?query",
    "?page",
    "?keywords",
    "?year",
    "?view",
    "?email",
    "?type",
    "?name",
    "?p",
    "?month",
    "?immagine",
    "?list_type",
    "?url",
    "?terms",
    "?categoryid",
    "?key",
    "?l",
    "?begindate",
    "?enddate",
    "?categoryid2",
    "?t",
    "?cat",
    "?category",
    "?action",
    "?bukva",
    "?redirect_uri",
    "?firstname",
    "?username",
    "?password",
    "?pass",
    "?c",
    "?lastname",
    "?uid",
    "?startTime",
    "?eventSearch",
    "?categoryids2",
    "?categoryids",
    "?sort",
    "?m",
    "?tag",
    "?title",
    "/?callback",
    "/?q",
    "/?s",
    "/?search",
    "/?id",
    "/?lang",
    "/?keyword",
    "/?query",
    "/?page",
    "/?keywords",
    "/?year",
    "/?view",
    "/?email",
    "/?type",
    "/?name",
    "/?p",
    "/?month",
    "/?immagine",
    "/?list_type",
    "/?url",
    "/?terms",
    "/?categoryid",
    "/?key",
    "/?l",
    "/?begindate",
    "/?enddate",
    "/?categoryid2",
    "/?t",
    "/?cat",
    "/?category",
    "/?action",
    "/?bukva",
    "/?redirect_uri",
    "/?firstname",
    "/?username",
    "/?password",
    "/?pass",
    "/?c",
    "/?lastname",
    "/?uid",
    "/?startTime",
    "/?eventSearch",
    "/?categoryids2",
    "/?categoryids",
    "/?sort",
    "/?m",
    "/?tag",
    "/?title"
  ];

  echo(`Staring bruteforce open redirect. ${sinks.length * urls.length} will be made`);

  const payload = "\"><img onerror=confirm('web-vulns-scanner') src=>"

  for(let i in urls) {
    const url = urls[i];
    for(let j in sinks) {
      if (url.indexOf("?")>-1) {
        let preparedUrl = url.substr(0,url.indexOf("?")) + sinks[j] + "=" + payload;
        let injected;
        try {
	  echo(`Injection -> ${preparedUrl}`, "debug");
          injected = await xssTestInjection(preparedUrl, "\\\<img onerror\\\=confirm\\\(\\\'web");
	  echo(`Injection test -> ${injected}`, "debug");
        } catch(err) {
          echo(`${err.message} fetching ${preparedUrl}`, "warning");
        }
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
      } else {
        let preparedUrl = url + sinks[j] + "=" + payload;
        let injected;
        try {
	  echo(`Injection -> ${preparedUrl}`, "debug");
          injected = await xssTestInjection(preparedUrl, "\\\<img onerror\\\=confirm\\\(\\\'web");
	  echo(`Injection test -> ${injected}`, "debug");
        } catch(err) {
          echo(`${err.message} fetching ${preparedUrl}`, "warning");
        }

        if (injected) {
          appendToFile("output/results/xss-scanner-results.txt", `Injected: ${injected}

${injection}

`);
          echo(`\nXSS Result:

Injected: ${injected}
Injection: ${injection}

`, "critical");
	  
        }
      }
    }
  }
}


export default xssBruteForceScanner;
