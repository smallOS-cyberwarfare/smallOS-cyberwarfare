Usage: node directory-finder.js [options]

Basic example:
```
node directory-finder.js -f 'dev.txt' -u 'https://www.google.com'
```
  
Options:
```
-a, --user-agent    String or file
-m, --method        String
-u, --url           String
-f, --file          File
-s, --separator     String
  , --headers       String or file
-r, --randomize
-p, --proxy         String or file
-c, --code          String
-h, --help
```

Recommended:
```
node directory-finder.js -f 'common.txt' -u 'https://www.google.com' -a 'agents.txt'
```

##### --user-agent
You can pass an agent string. Using a common 2021 user agent by default. You can pass a filename instead when you want to use multiple user agents, eqch request uses a different user agent.  
  
##### --method
You can pass a mathod name, by default the scanner uses head method since server responses are much smaller. If the server is not responding to head method, you can pass -m 'get'  
  
##### --url
The url you want to test, is recommended to use full cannonical url like -u 'https://www.google.com' to avoid the server responding with 301 redirects to the cannonical domain, so less requests are made per path.  
  
##### --file
The file holding the directories/files you want to test. home,about,admin,robots.txt,site-map.xml  
  
##### --separator
The chracter that delimits each directory name. By defualt line breaks are used. If you have a comma serapared list of values, then you want to use -s ','
The separator is being used ALSO to parse the other files, so you want to have all files using same separator  
  
##### --headers
You can pass a list of headers and directives delimited by : and , Example: --headers 'X-Requested-With: XMLHttpRequest,Referrer: https://example.com' or you can pass a filename instead where each request will be parsed using --separator  
  
##### --randomize
The user agents are chosed randomly  
  
##### --proxy
You can pass an url or a filename instead where each request will be proxied trought one of the proxies listed.
> Not implemented yet. 
  
##### --code
Pattern to return files. !404 for print all urls that dosn't return a 404 status code  

##### --verbose
Print a lot of info.  
    
Another example:
```
node directory-finder.js -u https://google.com -f dev.txt -a 'agents.txt' -r --headers 'X-Requested-With:XMLHttpRequest,Referrer:http://example.com' --code '!404'
```
