usage: node web-vulns-scanner.mjs [OPTIONS]

Arguments:
```
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
node web-vulns-scanner.mjs --show-extracted-urls -t https://google.es --recursive-url-extraction 1 --filter-urls google --xss --open-redirect --debug
```

#### --target
can be https://example.com or ./myListOfUrls.txt (linebreak separated)  
  
#### --xss
scan by replacing url arguments by payload  
  
#### --xss-bruteforce-scan
scan all urls by using a list of sinks  
  
#### --open-redirect
scan by replacing url arguments by payload  

#### --open-redirect-bruteforce-scan
scan all urls by using a list of sinks  
  
#### --verbose
show a bit more of information  
  
#### --debug
show all information  
  
#### --recursive-url-extraction
Extract urls from extracted urls. This argument accept a number indicating the number of recursions being made. If you chose **3** , you may end up with a million of urls to scan, that can take hours or even days based on server response time, number of selected scans, etc  
  
#### --show-extracted-urls
NOT IMPLEMENTED YET  
  
#### --filter-urls
Filter the urls using a regular expresion. You can pass a domain, a keyword, etc. Ex: **tiktok** keyword will match domains like tiktok.com, tiktok.es, tiktokcdn.com, twitter.com/tiktok, etc  

#### --save-urls
Save all the extracted urls to the file located at **web-vulns-scanner/output/urls.txt**  

#### --save-prepared-urls
For the --xss and --open-redirect OPTIONS, save the urls in files instead of send the request to the target  
  

#### **COLORS**
The scan uses terminal secuences to display colors. White means a normal log. Green a bit of extra information. In Blue more information is displayed. Yellow show warnings like catched errors you may want to take a look at. Red show found vulnerabilities or errors you probably want to fix  

#### **Outputs**
If a vulnerability is found, it will be saved into the results folder.  The scanner is using a regular expressions to find out when vulnerabilities are found. This will lead to false positives, so when a xss vulnerability is found, take it as "THIS CAN BE A VULNERAVILITY, BUT PROBABLY IS NOT" and not a "THIS IS 100% A VULNERABILITY". In case of a reported open redirect vulnerability, is 99% a open redirect vulnerability  
  
### IMPORTANT:
+ This scanner is dangerous since is sending payloads that can end stored in any of the extracted urls, disrupting the webpage.  
+ This can lead to a bad actor finding the exploit live in the site before you test it if the detection fails or you don't pay attention to the results while scanning.
+ The scanner send a good amounth of requests to extract urls and even more if you're in bruteforce mode. This can lead to slow down small sites.
  
> DO NOT TEST URLS WITHOUT AUTHORIZATION
