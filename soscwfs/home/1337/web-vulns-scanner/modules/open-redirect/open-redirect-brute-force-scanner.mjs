import { echo, appendToFile } from "../utils/utils.mjs";
import { openRedirTest } from "./open-redirect.mjs";

const openRedirectBruteForceScanner = async urls => {
  const sinks = [
      "?page",
      "?url",
      "?rurl",
      "login?to",
      "?ret",
      "?r2",
      "?img",
      "?action",
      "?u",
      "?return",
      "?return_path",
      "?returnTo",
      "?return_to",
      "?r",
      "?URL",
      "?next",
      "?redirect",
      "?redirectBack",
      "?AuthState",
      "?referer",
      "?referrer",
      "?redir",
      "?l",
      "?image_url",
      "?aspxerrorpath",
      "?image_path",
      "?ActionCodeURL",
      "?return_url",
      "?link",
      "?q",
      "?location",
      "?ReturnUrl",
      "?uri",
      "?referrer",
      "?returnURL",
      "?forward",
      "?file",
      "?rb",
      "?end_display",
      "?urlact",
      "?from",
      "?go",
      "?goto",
      "?path",
      "?redirect_url",
      "?old",
      "?pathlocation",
      "?successTarget",
      "?returnURL",
      "?urlsito",
      "?newurl",
      "?Url",
      "?back",
      "?ref",
      "?topic",
      "?resource",
      "?href",
      "?returnto",
      "?continue",
      "?view",
      "?target",
      "?lnk",
      "?out",
      "?dest",
      "?destination",
      "?loginto",
      "?checkout_url",
      "?return_path",
      "?source",
      "/?page",
      "/?url",
      "/?rurl",
      "/login?to",
      "/?ret",
      "/?r2",
      "/?img",
      "/?u",
      "/?return",
      "/?return_path",
      "/?returnTo",
      "/?return_to",
      "/?r",
      "/?URL",
      "/?next",
      "/?redirect",
      "/?redirectBack",
      "/?AuthState",
      "/?referer",
      "/?referrer",
      "/?redir",
      "/?l",
      "/?image_url",
      "/?aspxerrorpath",
      "/?image_path",
      "/?ActionCodeURL",
      "/?return_url",
      "/?link",
      "/?q",
      "/?location",
      "/?ReturnUrl",
      "/?uri",
      "/?referrer",
      "/?returnURL",
      "/?forward",
      "/?file",
      "/?rb",
      "/?end_display",
      "/?urlact",
      "/?from",
      "/?go",
      "/?goto",
      "/?path",
      "/?redirect_url",
      "/?old",
      "/?pathlocation",
      "/?successTarget",
      "/?returnURL",
      "/?urlsito",
      "/?newurl",
      "/?Url",
      "/?back",
      "/?ref",
      "/?topic",
      "/?resource",
      "/?href",
      "/?returnto",
      "/?continue",
      "/?out",
      "/?view",
      "/?target",
      "/?lnk",
      "/?dest",
      "/?destination",
      "/?loginto",
      "/?action",
      "/?checkout_url",
      "/?return_path",
      "/?source"
  ];

  echo(`Staring bruteforce open redirect. ${sinks.length * urls.length} will be made`);

  for (let i in urls) {
    const url = urls[i];
    if (url.indexOf("?")>-1) {
    for(let j in sinks) {
      let preparedUrl = url.substr(0,url.indexOf("?")) + sinks[j] + "=//example.com";
      let aux;
      try {
        echo(`Injection -> ${preparedUrl}`, "debug");
        aux = await openRedirTest(preparedUrl);
      } catch(err) {
        echo(`${err.message} fetching ${preparedUrl}`, "warning");
      }

      if (aux) {
        appendToFile("output/results/open-redirect-scanner-results.txt", `${openRedirUrl}


`);
        echo(`\nOpen Redirect Result:\nFOUND -> ${openRedirUrl}\n\n\n`, "critical");
        }
      }
    } else {
      for(let j in sinks) {
        let preparedUrl = url + sinks[j] + "=//example.com";
        let aux;
        try {
          echo(`Injection -> ${preparedUrl}`, "debug");
          aux = await openRedirTest(preparedUrl);
        } catch(err) {
          echo(`${err.message} fetching ${preparedUrl}`, "warning");
        }

        if (aux) {
          appendToFile("output/results/open-redirect-scanner-results.txt", `${openRedirUrl}


`);
          echo(`\nOpen Redirect Result:\nFOUND -> ${openRedirUrl}\n\n\n`, "critical");
        }
      }
    }
  } 
}

export default openRedirectBruteForceScanner;
