#!/usr/bin/node
const exec = require("child_process");

const run = args => {
  const res = exec.execSync(args).toString()
  return res;
};

const cli = {};
cli.COLORS = {
  RED: "\x1b[31m",
  RESET: "\x1b[0m",
  YELLOW:"\x1b[33m",
  BLUE: "\x1b[34m",
  GREEN: "\x1b[32m"
};

const scriptArgs = process.argv;
for (let i in scriptArgs) {
switch(scriptArgs[i]) {
    case "-b":
    case "--backup-files":
      cli.backupFiles = true;
    break;

    case "-c":
    case "--config-files":
      cli.configFiles = true;
    break;
    
    case "-d":
    case "--directory-listing":
      cli.directoryListing = true;
    break;

    case "-e":
    case "--exposed-databases":
      cli.exposedDatabases = true;
    break;

    case "-g":
    case "--git":
      cli.git = true;
    break;

    case "-l":
    case "--log":
      cli.logFiles = true;
    break;

    case "-L":
    case "--login-urls":
      cli.loginUrls = true;
    break;

    case "-p":
    case "--public-documents":
      cli.publicDocuments = true;
    break;

    case "-P":
    case "--php-errors":
      cli.phpErrors = true;
    break;

    case "--php-info":
      cli.phpInfo = true;
    break;

    case "--pastes":
      cli.pastes = true;
    break;

    case "-s":
    case "--source":
      cli.source = true;
    break;

    case "-S":
    case "--sql-errors":
      cli.sqlErrors = true;
    break;

    case "--stackoverflow":
      cli.stackoverflow = true;
    break;

    case "-t":
    case "--target":
      cli.target = encodeURI(scriptArgs[+i + +1]);
    break;

    case "-v":
    case "--view":
      cli.view = true;
    break;

    case "-h":
    case "--help":
      console.log(`

usage: node google-dork-finder.js [options]
  -b  --backup-files         .bkf, .bkp, .bak, .old, .backup
  
  -c  --config-files         .xml, .conf, .cnf, .reg, .inf, .rdp, .cfg, .txt, .ora, .ini, .env
  
  -d  --directory-listing    index of dir list
  
  -e  --exposed-databases    .sql, .dbf, .mdb
  
  -g  --git                  github.com, gitlab.com
  
  -h  --help                 this message
  
  -l  --log                  .log
  
  -L  --login-urls           login in url
  
  -p  --public-documents     .doc, .docx, .odt, .rtf, .sxw, .psw, .ppt, .pptx, .pps, .csv
  
  -P  --php-errors           .php errors in document

      --pastes               pastebin.com, paste2.org, pastehtml.com, slexy.org, snipplr.com, snipt.net, textsnip.com, bitpaste.app, justpaste.it, heypasteit.com, hastebin.com, dpaste.org, dpaste.com, codepad.org, jsitor.com, codepen.io, jsfiddle.net, dotnetfiddle.net, phpfiddle.org, ide.geeksforgeeks.org, repl.it, ideone.com, paste.debian.net, paste.org, paste.org.ru, codebeautify.org, codeshare.io, trello.com
 
      --php-info             .php info files

  -s  --source               source code of target 

  -S  --sql-errors           sql syntax errors in document    

      --stackoverflow        stackoverflow.com

  -t  --target               Your target. Can be a domain, a full url, etc. Based on the arguments of your chose.  

  -v  --view                 text representation of the target.


`);
  process.exit(0);
  }
}

let checkResults = res => {
  /* Check if connection error */

  /* Check if captcha */
    /* Use good proxy chain list to evade captcha */
    /* Instruct user to evade if dynamic ip */

  /* Check if not found */
  if (new RegExp("ningún resultado", "gim").test(res.replace(/\n/gm, " ")) || new RegExp("no obtuvo", "gim").test(res.replace(/\n/gm, " "))) {
    console.log(`${cli.COLORS.GREEN}Everything fine but nothing found.${cli.COLORS.RESET}`);
    process.exit(0);
  } else {
    console.log(res);
  }

  /* check if more than one page of results */
}

if (!cli.target) {
  console.log(`Missing target.
  write ${cli.COLORS.RED}node google-dork-finder.js --help${cli.COLORS.RESET} to show usage.
  `);
  process.exit(0);
}

if (cli.backupFiles) {
  checkResults(run(`lynx --dump -useragent='User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36' 'https://www.google.com/search?q=site:${cli.target}+ext:bkf+|+ext:bkp+|+ext:bak+|+ext:old+|+ext:backup' 2>/dev/null`).split(cli.target).slice(3).join(cli.target));
} 

else if (cli.configFiles) {
  checkResults(run(`lynx -useragent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36' --dump 'https://www.google.com/search?q=site:${cli.target}+ext:xml+|+ext:conf+|+ext:cnf+|+ext:reg+|+ext:inf+|+ext:rdp+|+ext:cfg+|+ext:txt+|+ext:ora+|+ext:ini+|+ext:env' 2>/dev/null`).split(cli.target).slice(3).join(cli.target));;
} 

else if (cli.directoryListing) {
  checkResults(run(`lynx -useragent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36' --dump 'https://www.google.com/search?q=site:${cli.target}+intitle:index.of' 2>/dev/null`).split(cli.target).slice(3).join(cli.target));

} else if (cli.exposedDatabases) {
  checkResults(run(`lynx -useragent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36' --dump 'https://www.google.com/search?q=site:${cli.target}+ext:sql+|+ext:dbf+|+ext:mdb' 2>/dev/null`).split(cli.target).slice(3).join(cli.target));
}

else if (cli.exposedDatabases) {
  checkResults(run(`lynx -useragent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36' --dump 'https://www.google.com/search?q=site:${cli.target}+intext:'"'"'sql syntax near'"'"'+|+intext:'"'"'syntax error has occurred'"'"'+|+intext:'"'"'incorrect syntax near'"'"'+|+intext:'"'"'unexpected end of SQL command'"'"'+|+intext:'"'"'Warning: mysql_connect()'"'"'+|+intext:'"'"'Warning: mysql_query()'"'"'+|+intext:'"'"'Warning: pg_connect()'"'"'' 2>/dev/null`).split(cli.target).slice(3).join(cli.target));
}

else if (cli.git) {
  checkResults(run(`lynx -useragent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36' --dump 'https://www.google.com/search?q="${cli.target}"+site:github.com+|+site:gitlab.com' 2>/dev/null`).split(cli.target).slice(3).join(cli.target));
}

else if (cli.logFiles) {
  checkResults(run(`lynx -useragent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36' --dump 'https://www.google.com/search?q=site:${cli.target}+ext:log' 2>/dev/null`).split(cli.target).slice(3).join(cli.target));
}

else if (cli.loginUrls) {
  checkResults(run(`lynx -useragent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36' --dump 'https://www.google.com/search?q=site:${cli.target}+inurl:login+|+inurl:ingresar' 2>/dev/null`).split(cli.target).slice(3).join(cli.target));
}

else if (cli.publicDocuments) {
  checkResults(run(`lynx -useragent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36' --dump 'https://www.google.com/search?q=site:${cli.target}+ext:doc+|+ext:docx+|+ext:odt+|+ext:rtf+|+ext:sxw+|+ext:psw+|+ext:ppt+|+ext:pptx+|+ext:pps+|+ext:csv' 2>/dev/null`).split(cli.target).slice(3).join(cli.target));
}

else if (cli.pastes) {
  checkResults(run(`lynx -useragent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36'--dump 'https://www.google.com/search?q=${cli.target}+site:pastebin.com+|+site:paste2.org+|+site:pastehtml.com+|+site:slexy.org+|+site:snipplr.com+|+site:snipt.net+|+site:textsnip.com+|+site:bitpaste.app+|+site:justpaste.it+|+site:heypasteit.com+|+site:hastebin.com+|+site:dpaste.org+|+site:dpaste.com+|+site:codepad.org+|+site:jsitor.com+|+site:codepen.io+|+site:jsfiddle.net+|+site:dotnetfiddle.net+|+site:phpfiddle.org+|+site:ide.geeksforgeeks.org+|+site:repl.it+|+site:ideone.com+|+site:paste.debian.net+|+site:paste.org+|+site:paste.org.ru+|+site:codebeautify.org +|+site:codeshare.io+|+site:trello.com' 2>/dev/null`));
}

else if (cli.phpErrors) {
  checkResults(run(`lynx -useragent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36' --dump 'https://www.google.com/search?q=site:${cli.target}+'"'"'PHP Parse error'"'"'+|+'"'"'PHP Warning'"'"'+|+'"'"'PHP Error'"'"'' 2>/dev/null`).split(cli.target).slice(3).join(cli.target));
}

else if (cli.phpInfo) {
  checkResults(run(`lynx -useragent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36' --dump 'https://www.google.com/search?q=site:${cli.target}+ext:php+intitle:phpinfo+'"'"'published by the PHP Group'"'"'' 2>/dev/null`).split(cli.target).slice(3).join(cli.target));
}

else if (cli.source) {
  console.log(run(`lynx -useragent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36' --source ${decodeURIComponent(cli.target)} 2>/dev/null`));
}

else if (cli.sqlErrors) {
  checkResults(run(`lynx -useragent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36' --dump 'https://www.google.com/search?q=site:${cli.target}+intext:'"'"'sql syntax near'"'"'+|+intext:'"'"'syntax error has occurred'"'"'+|+intext:'"'"'incorrect syntax near'"'"'+|+intext:'"'"'unexpected end of SQL command'"'"'+|+intext:'"'"'Warning: mysql_connect()'"'"'+|+intext:'"'"'Warning: mysql_query()'"'"'+|+intext:'"'"'Warning: pg_connect()'"'"'' 2>/dev/null`).split(cli.target).slice(3).join(cli.target));
}

else if (cli.stackoverflow) {
  checkResults(run(`lynx -useragent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36' --dump 'https://www.google.com/search?q=${cli.target}+site:stackoverflow.com' 2>/dev/null`).split(cli.target).slice(3).join(cli.target));
}

else if (cli.view) {
  console.log(run(`lynx -useragent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36' --dump '${decodeURIComponent(cli.target)}' 2>/dev/null`).split(cli.target).slice(3).join(cli.target));
}

else {
  console.log(`Missing argument. You need at least 1 argument more.
  write ${cli.COLORS.RED}node google-dork-finder.js --help${cli.COLORS.RESET} to show usage.

  `);
  process.exit(0);
}

