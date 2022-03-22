import { loadFile, quit, echo } from "./utils.mjs";
import { extractUrlsFromFile } from "../urls/urls.mjs";

const processArguments = () => {
  const cli = {};
  const scriptArgs = process.argv;
  for(let i in scriptArgs) {
    const next = scriptArgs[+i + 1];
    switch(scriptArgs[i]) {
      case "-t":
      case "--target":
        cli.target = extractUrlsFromFile(next);
        cli.targetIsFile = true;
        if (!cli.target) {
          cli.target = [];
	  cli.target.push(next);
          cli.targetIsFile = false;
        }

	if (!next) {
	  echo(`Error: You forgot to provide a target after the --target/-t argument.

Examples of usage: --target https://example.com
--target './listOfDomains/google.txt'

Full example: node web-vulns-scanner.mjs -t https://google.com --xss --open-redirect
`, "critical");
	  quit("", 1);
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

      case "--open-redir-bt":
      case "--open-redir-bt-scan":
      case "--open-redir-bt-scanner":
      case "--open-redir-brute":
      case "--open-redir-bruteforce":
      case "--open-redir-bt-scanner":
      case "--open-redir-brute-force-scan":
      case "--open-redir-brute-force-scanner":
      case "--open-redirect-bt":
      case "--open-redirect-bt-scan":
      case "--open-redirect-bt-scanner":
      case "--open-redirect-brute":
      case "--open-redirect-bruteforce":
      case "--open-redirect-bruteforce-scan":
      case "--open-redirect-bt-scanner":
      case "--open-redirect-brute-force-scan":
      case "--open-redirect-brute-force-scanner":
      case "--open-redirect-full-scan":
        cli.openRedirectFullScan = true;
      break;

      case "--xss-bt":
      case "--xss-bt-scan":
      case "--xss-bt-scanner":
      case "--xss-brute":
      case "--xss-bruteforce":
      case "--xss-bt-scanner":
      case "--xss-brute-force-scan":
      case "--xss-brute-force-scanner":
      case "--xss-bt":
      case "--xss-scan":
      case "--xss-bt-scanner":
      case "--xss-brute":
      case "--xss-bruteforce":
      case "--xss-bruteforce-scan":
      case "--xss-bt-scanner":
      case "--xss-brute-force-scan":
      case "--xss-brute-force-scanner":
      case "--xss-full-scan":
        cli.xssFullScan = true;
      break;

      case "--recursive-url-extraction":
        cli.recursiveUrlExtraction = +next;
      break;

      case "--show-extracted-urls":
        cli.showExtractedUrls = true;
      break;

      case "--filter-urls":
        cli.filter = next;
      break;

      case "--save-urls":
        cli.saveUrls = true;
      break;

      case "--save-prepared-urls":
	cli.savePreparedUrls = true;
      break;

      case "-v":
      case "--verbose":
        cli.verbose = true;
      break;

      case "-d":
      case "--debug":
	cli.verbose = true;
	cli.debug = true;
      break;

      case "--version":
        quit("web-vulns-scanner 1.0.0");

      case "-h":
      case "--help":
        echo(`usage: node web-vulns-scanner.mjs [OPTIONS]
-t --target                             Full url of target
-x --xss                                Scan XSS
   --xss-bruteforce-scan                Test all sinks
-r --open-redirect                      Scan Open Redirect
   --open-redirect-bruteforce-scan      Test all sinks
-v --verbose                            Print more information while scanning
-d --debug                              Print all information while scanning
   --version                            Print current version

   --recursive-url-extraction           Deep level
   --show-extracted-urls                Show all urls found
   --filter-urls                        Only use urls that match a pattern
   --save-urls                          Save all extracted urls
   --save-prepared-urls                 Save the urls ready to exploit to files instead of send requests

example:
node web-vulns-scanner.mjs --show-extracted-urls -t https://google.es --recursive-url-extraction 1 --filter-urls google --xss --open-redirect --debug`);
      quit("", 1);

    }
  }

  if (!cli.target) {
    echo(`You forgot to provide a target.

Examples of usage: --target https://example.com
--target './listOfDomains/google.txt'

Full example: node web-vulns-scanner.mjs -t https://google.com --xss --open-redirect
`, "critical");
    quit("", 1);
  }

  return cli;
}

export default processArguments;
