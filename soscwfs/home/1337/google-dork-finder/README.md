usage: node google-dork-finder.js [options]

```
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
```

example:  
node google-dork-finder.js -t example.com -g
