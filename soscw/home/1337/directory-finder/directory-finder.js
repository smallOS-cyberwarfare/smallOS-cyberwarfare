#!/usr/bin/node
const fetch = require("node-fetch");
const fs = require("fs");
const loadFile = filename => {
  try {
    filename = fs.readFileSync(filename, { encoding: "utf-8" })
  } catch(e) {
    filename = null;
  }
  return filename;
};

const cliArgs = {};
const scriptArgs = process.argv.splice(2);
for (const i in scriptArgs) {
  const current = scriptArgs[i];
  const next = scriptArgs[+i + 1];
  switch(current) {
    case "-a":
    case "--agent":
    case "--userAgent":
    case "--user-agent":
      cliArgs.userAgent = loadFile(next);
      if (cliArgs.userAgent) {
        cliArgs.splitUserAgent = true;
      } else {
        cliArgs.userAgent = next;
      }

    break;

    case "-c":
    case "--code":
      cliArgs.code = next;
    break;
		  
    case "-m":
    case "--method":
      cliArgs.method = next;
    break;

    case "-u":
    case "--url":
      cliArgs.url = next;
    break;

    case "-f":
    case "--file":
      cliArgs.file = loadFile(next);
    break;

    case "-s":
    case "--separator":
      cliArgs.separator = next;
    break;

    case "-r":
    case "--randomize":
      cliArgs.randomize = true;
    break;

    case "-header":
    case "-headers":
    case "--header":
    case "--headers":
      cliArgs.headers = loadFile(next);
      if (cliArgs.headers) {
        cliArgs.splitHeaders = true;
      } else {
        cliArgs.headers = next;
      }
    break;

    case "-p":
    case "--proxy":
    case "--proxys":
    case "--proxies":
      cliArgs.proxy = loadFile(next);
      if (cliArgs.proxy) {
        cliArgs.splitProxy = true;
      } else {
        cliArgs.proxy = next;
      }
    break;

    /* TODO: proxies, save config, load config,
    case "-t":
    case "--timer":

    */

    case "-v":
    case "--verbose":
      cliArgs.v = true;
    break;

    case "-h":
    case "--help":
      cliArgs.help = true;
  }
}

if (cliArgs.help) {
  console.log(`Usage: node directory-finder.js [options]

Basic example:
node directory-finder.js -f 'dev.txt' -u 'https://www.google.com'

-a, --user-agent    String or file
-m, --method        String
-u, --url           String
-f, --file          File
-s, --separator     String
  , --headers       String or file
-r, --randomize
-p, --proxy         String or file
-c, --code          String
-v, --verbose
-h, --help          

Recommended:
node directory-finder.js -f 'common.txt' -u 'https://www.google.com' -a 'agents.txt' 

--user-agent   You can pass an agent string. Using a common 2021 user agent by default. You can pass a filename instead when you want to use multiple user agents, eqch request uses a different user agent.

--method   You can pass a mathod name, by default the scanner uses head method since server responses are much smaller. If the server is not responding to head method, you can pass -m 'get'

--url   The url you want to test, is recommended to use full cannonical url like -u 'https://www.google.com' to avoid the server responding with 301 redirects to the cannonical domain, so less requests are made per path.

--file   The file holding the directories/files you want to test. home,about,admin,robots.txt,site-map.xml

--separator   The chracter that delimits each directory name. By defualt line breaks are used. If you have a comma serapared list of values, then you want to use -s ','
The separator is being used ALSO to parse the other files, so you want to have all files using same separator

--headers   You can pass a list of headers and directives delimited by : and , Example: --headers 'X-Requested-With: XMLHttpRequest,Referrer: https://example.com' or you can pass a filename instead where each request will be parsed using --separator

--randomize   The user agents are chosed randomly

--proxy  You can pass an url or a filename instead where each request will be proxied trought one of the proxies listed.

--code   Pattern to return files. !404 for print all urls that dosn't return a 404 status code 

--verbose   Print a lot of info.

Another example:
node directory-finder.js -u https://google.com -f dev.txt -a 'agents.txt' -r --headers 'X-Requested-With:XMLHttpRequest,Referrer:http://example.com' --code '!404'

`);
  process.exit(0);
}

const verbose = text => cliArgs.v && console.log(` + ${text}`);

if (!cliArgs.url) {
  console.log("Missing argument --url https://example.com");
  process.exit(0);
}

if (!cliArgs.file) {
  console.log("Missing argument --file myList.txt");
  process.exit(0);
}

if (!cliArgs.separator) {
  //console.log("Missing argument --separator ' '\nUsing line break as a separator...");
  cliArgs.separator = "\n";
}
cliArgs.file = cliArgs.file.split(cliArgs.separator);

if (cliArgs.userAgent) {
  if (cliArgs.splitUserAgent) {
    cliArgs.userAgent = cliArgs.userAgent.split(cliArgs.separator);
    cliArgs.userAgent.pop();
  }
} else {
  cliArgs.userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36"; 
}

if (cliArgs.headers) {
  if (cliArgs.splitHeaders) {
    cliArgs.headers = cliArgs.headers.split(cliArgs.separator);
    cliArgs.headers.pop();
  } else {
    if (/\,/g.test(cliArgs.headers)) {
      cliArgs.headers = cliArgs.headers.split(",");
      cliArgs.splitHeaders = true;
    }
  }
}

if (!cliArgs.code) {
  cliArgs.code = 200;
}


const GET = async (url, requestOptions) => {
  try {
    verbose(`Sending request to ${url} ...`);
    const response = await fetch(url, requestOptions);
//console.log(`Response status ${response.status}`);
    
    verbose(`${url} - ${response.status}`);
    switch (response.status) {
      case 200:
        if (cliArgs.code == 200 || cliArgs.code == "!404") {
	  console.log(url);
        }
	//console.log(response.body);
      break;

      case 301:
      case 302:
        GET(response.headers.get("location"), requestOptions);	
      break;

      case 404:
	"don't trigger 404 on default";
      break;

      default:
        if (cliArgs.code == "!404") {
          console.log(url);
        }
    }
  } catch (error) {
        //console.log(error);
  }
}


const scan = async () => {
  const len = cliArgs.file.length;
  for (let i = 0, j = 0; i < len; ++i) {
    let requestOptions = {};
    requestOptions.headers = {};
    requestOptions.method = cliArgs.method || "head";
    requestOptions.redirect = "manual";
    if (cliArgs.splitHeaders) {
      for(let k in cliArgs.headers) {
        const headerName = cliArgs.headers[k].split(":")[0]
        let directive = cliArgs.headers[k].split(":");
	directive.shift();
	directive = directive.join(":");
	requestOptions.headers[headerName] = directive;
      }
    } else {
      if (cliArgs.headers) {
        const headerName = cliArgs.headers.split(":")[0];
	let directive = cliArgs.headers.split(":");
	directive.shift();
	directive = directive.join(":");
        requestOptions.headers[headerName] = directive;
      }
    }

//console.log(JSON.stringify(requestOptions, null, 2));

    if (cliArgs.splitUserAgent) {
      if (j >= cliArgs.userAgent.length) {
//console.log("j is reset");
        j = 0;
      }
      if (cliArgs.randomize) {
        requestOptions.headers["User-Agent"] = cliArgs.userAgent[Math.floor(Math.random() * cliArgs.userAgent.length - 1) + 1];
   
      } else {
        requestOptions.headers["User-Agent"] = cliArgs.userAgent[j++];
      }
    } else {
      if (cliArgs.userAgent) {
	requestOptions.headers["User-Agent"] = cliArgs.userAgent;
      }
    }


    const url = `${cliArgs.url}/${cliArgs.file[i]}`;
    GET(url, requestOptions);
  }
}

verbose(`Number of directories (${cliArgs.file.length})`);
scan();
