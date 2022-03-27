# Subdomainfinder
Search subdomains of a domain.

### Download
https://github.com/StringManolo/1337/tree/master/subdomains-finder via git clone https://github.com/StringManolo/1337

### Usage  
> subdomainfinder -d [domain] 
  
> subdomainfinder -d [domain] [--format] [-o filename.ext]
  
> subdomainfinder [--help]  
  
### Examples   
##### Get subdomains for example.com
```bash
subdomainfinder -d example.com
```

##### Get subdomains for example.com in csv format
```bash
subdomainfinder -d example.com --csv
```

##### Get subdomains for example.com in json format
```bash
subdomainfinder -d example.com --json
```

##### Get subdomains for example.com and save them in domains_example_com.txt
```bash
subdomainfinder -d example.com -o domains_example_com.txt
```

##### Get subdomains for google.com and google.es, save them and append them to same file
```bash
subdomainfinder -d google.com -o domains_google.txt
subdomainfinder -d google.es --append -o domain_google.txt
```
