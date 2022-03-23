# Domsinkfinder
Find DOM sinks in source code by url. Helps to find DOM XSS

### Download
https://github.com/StringManolo/1337/tree/master/dom-sink-finder via git clone https://github.com/StringManolo/1337

### Usage
> domsinkfinder [-t uri]  
  
### Examples
##### Search sinks in a webpage or .js file  
```bash
domsinkfinder -t 'http://www.domxss.com/domxss/01_Basics/00_simple_noHead.html'  
# You can view that name argument is taken from javascript and not scaped, but unscaped instead. This means your code will be added to the webpage in html context.  
# Exploit: http://www.domxss.com/domxss/01_Basics/00_simple_noHead.html?name=<svg onload=alert()>

```
