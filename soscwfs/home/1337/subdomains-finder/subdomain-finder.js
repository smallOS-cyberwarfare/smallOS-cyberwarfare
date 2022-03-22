#!/usr/bin/node
const fetch = require("node-fetch");
const fs = require("fs");

const open = (filename, mode) => {
  const fd = {};
  fd.internalFd = fs.openSync(filename, mode);
  fd.read = (buffer, position, len) => fs.readSync(fd.internalFd, buffer, position, len);
  fd.puts = (str) => fs.writeSync(fd.internalFd, str);
  fd.close = () => fs.closeSync(fd.internalFd);
  return fd;
}

const cli = {};
cli.writeMode = "w";
const scriptArgs = process.argv;
for (let i in scriptArgs) {
  switch(scriptArgs[i]) {
    case "-a":
    case "--append":
      cli.writeMode = "a";
    break;

    case "-c":
    case "--csv":
      cli.csv = true;
    break;

    case "-d":
    case "--domain":
      cli.domain = "."+scriptArgs[+i + 1];
    break;

    case "-h":
    case "--help":
      console.log(`usage: node subdomain-finder.js [-h] -d DOMAIN [-o OUTPUT]      
optional arguments:
  -h, --help            show this help message and exit.
  -d DOMAIN, --domain DOMAIN            Target domain.
  -o OUTPUT, --output OUTPUT            Output file.

  -a, --append          append to file, don't overwrite.
  -c, --csv             output in comma separated values.
  -j, --json            output in json format.`);
      process.exit(0);

    case "-j":
    case "--json":
      cli.json = true;
    break;

    case "-o":
    case "--output":
      cli.output = scriptArgs[+i + 1];
    break;
  }
}

if (!cli.domain) {
  console.log(`usage: node subdomain-finder.js [-h] -d DOMAIN [-o OUTPUT]
subdomain-finder.js: error: the following arguments are required: -d/--domain`);
  process.exit(0);
}


fetch(`https://crt.sh/?q=${encodeURIComponent(cli.domain)}&output=json`)
.then( res => res.json())
.then( api => {

  let domains = [];

  for (let i in api) {
    let aux = (api[i].name_value.split("\n") || api[i].name_value);
    for (let j in aux) {
      domains.push(aux[j]);
    }
  }

  domains.push(cli.domain.substring(1));

  domains = [...new Set(domains)];

  if (!domains) {
    console.log("no domains found");
  }

  let resp = "";
  if (cli.json) {
    resp = JSON.stringify(domains);

  } else if (cli.csv) { 
    for(let i in domains) {
      resp += domains[i] + (i == domains.length - 1 ? "" : ",") 
    }
  } else {
    for (let i in domains) {
      resp += domains[i] + (i == domains.length - 1 ? "" : "\n")
    }
  }

  if (cli.output) {
    let fd = open(cli.output, cli.writeMode);
    if (cli.writeMode == "a") {
      if (cli.json || cli.csv) {
        resp = "," + resp;
      } else {
        resp = "\n" + resp;
      }
    } 
    fd.puts(resp);
    fd.close();
  } else {
    console.log(resp);
  }

});
