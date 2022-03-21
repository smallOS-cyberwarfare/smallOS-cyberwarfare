#!/usr/bin/node
const fetch = require("node-fetch");
const fs = require("fs");

String.prototype.replaceAll = function(search, replacement) {
  const target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

const cli = {};
const COLORS = {
  RED: "\x1b[31m",
  RESET: "\x1b[0m",
  YELLOW:"\x1b[33m",
  BLUE: "\x1b[34m",
  GREEN: "\x1b[32m"
};

const scriptArgs = process.argv;
for (let i in scriptArgs) {
  const next = scriptArgs[+i + 1];
  switch(scriptArgs[i]) {

    case "-h":
    case "--help":
      console.log(`usage: node dom-sink-finder.js -t target
optional arguments:
  -h, --help            show this help message and exit.
  -t, --target          url to inspect
`)
      process.exit(0);

    case "-t":
    case "--target":
      cli.target = next;

    break;

    case "-s":
      cli.scrap = true;
  }
}

if (!cli.target) {
  console.log(`Missing -t argument`);
  process.exit(0);
}

const getUrls = (source, baseUrl) => {
  const url =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi
  let foundUrls = [];
  const script = /<script.*?src=['"](.*?)['"]/gi;
  const link = /<link.*?href=['"](.*?)['"]/gi;

  if(baseUrl[6] !== "/") {
    baseUrl = "http://" + baseUrl;
  }

  const getUrl = str => {
    let url = "";
    for(let i = 0; i < str.length; ++i) {
      if (str[i] == "s" && str[+i + 1] == "r" && str[+i + 2] == "c" && str[+i +3] == "=") {
        if (str[+i +4] == "'") {
          i += 5;
          while (str[i] != "'") {
            url += str[i];
            if (i > str.length) {
              throw `bug1`;
            }
            ++i;
          } 
          return url;
        }

        if (str[+i +4] == '"') {
          i += 5;
          while (str[i] != '"') {
            url += str[i];
            if (i > str.length) {
              throw `bug2`;
            }
            ++i;
          }
          return url;
        }
      }

      if (str[i] == "h" && str[+i + 1] == "r" && str[+i + 2] == "e" && str[+i +3] == "f" && str[+i +4] == "=") {
        if (str[+i +5] == "'") {
          i += 6;
          while (str[i] != "'") {
            url += str[i];
            if (i > str.length) {
              throw `bug3`;
            }
            ++i;
          }
          return url;
        }
                                            
        if (str[+i +5] == '"') {
          i += 6;
          while (str[i] != '"') {
            url += str[i];
            if (i > str.length) {
              throw `bug4`;
            }
            ++i;
          }
          return url;
        }
      }

    }
      //throw `error, no comma found in ${source}`;

  }

  source.replaceAll(script, url => {
    url = getUrl(url);
    if (url[0] == "." && url[1] == "/") {
      url = `${baseUrl}/${url.substring(2)}`;
    } else if (url[0] == "/" && url[1] == "/") {
      url = `${baseUrl}/${url.substring(2)}`;
    } else {
      if (url[4] == ":") {
        if (url.substr(0, 4) == "data") {
          return;
        }
      }

      if (url[6] !== "/") {
        url = `${baseUrl}/${url}`;
      }
    }

    foundUrls.push(url);
  });

  source.replaceAll(link, url => {
    url = getUrl(url); 
    if (url[0] == "." && url[1] == "/") {
      url = `${baseUrl}/${url.substring(2)}`;
    } else if (url[0] == "/" && url[1] == "/") { 
      url = `${baseUrl}/${url.substring(2)}`;
    } else {
      if (url[4] == ":") {
        if (url.substr(0, 4) == "data") {
          return;
        }
      }

      if (url[6] !== "/") {
        url = `${baseUrl}/${url}`;
      }
    }

    foundUrls.push(url);
  });

  source.replaceAll(url, url => {

    if (url[4] == ":") {
      if (url.substr(0, 4) == "data") {
        return;
      }
    }

    foundUrls.push(url);
  });


  return [...new Set(foundUrls)];

}


const baseSinks = "action,add,after,animate,append,arguments,baseURI,before,code,constructor,createContextualFragment,decodeURI,dialogArguments,documentURI,data,domain,eval,file:,frames,Function,has,hash,href,import url,index,indexedDB,init,innerHTML,insertAdjacentHTML,insertAfter,insertBefore,javascript,JSON,jQuery,localStorage,location,name,onevent,onmessage,open,outerHTML,parent,parseHTML,pathname,prepend,pushState,referrer,replaceAll,replaceWith,search,self,sessionStorage,setInterval,setTimeout,showModalDialog,scape,src,tel:,top,url,urlunencoded,value,wrap,wrapAll,wrapInner,write,writeln".split(",");


fetch(cli.target)
.then( data => data.text())
.then( source => {

  const urls = getUrls(source, cli.target);
  let nSinks = 0;

  for(let i in baseSinks) {
    source = source.replaceAll(new RegExp(baseSinks[i], "gi"), url => {
      ++nSinks;
      return `${COLORS.RED}${baseSinks[i]}${COLORS.RESET}` 
    });
  }

  console.log(`${source}
\n
Sinks Found: ${nSinks}
`);

  console.log(`You may be interested on analice this urls too:
${urls.join("\n")}

${urls.length} urls found in ${cli.target} source code
`);
})
.catch( err => console.log(`Error: ${err}`));
