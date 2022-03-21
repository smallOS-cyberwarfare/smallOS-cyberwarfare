usage: node web-services-finder.js [-h] -f file [-o OUTPUT]

#### Arguments:
```
  -h, --help            show this help message and exit.

  -f, --file            domains file (separated by line breaks)
  -r, --range           range of ports to scan
  -p, --proxy           proxy url
  -ph,--proxy-headers   headers you need to send to the proxy
  -sh,--show-headers    include response headers in the output
  -c, --colored-output  use colors in console (don't use if outputing to file)
    , --robots          print a resume of the robots.txt file
```

example:
```
node web-services-finder.js -sh -c --robots -r 80,443,8080 -f domains.txt
```
