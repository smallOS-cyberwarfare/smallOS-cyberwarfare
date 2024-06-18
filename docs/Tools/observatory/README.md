# Observatory
Get http headers security related info from Mozilla Observatory 

### Download
https://github.com/mozilla/observatory-cli via npm install -g observatory-cli

### Usage  
> observatory domain.tld [--format=FORMAT_TYPE] [--rescan] [--zero] [--attemps] [--quiet] 
  
> name [other args] [other args]   
  
> name [--help]  
  
### Examples   
##### Get csv for example.com  
```bash
observatory example.com --format=csv
```

##### Get Report for google.com 
```bash
observatory google.com --format=report
```

