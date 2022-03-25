# Nuclei
Fast and customizable vulnerability scanner based on simple YAML based DSL.  

### Download
https://github.com/projectdiscovery/nuclei via go install -v github.com/projectdiscovery/nuclei/v2/cmd/nuclei@latest  

### Usage  
> nuclei [args]
  
> nuclei [--help]  
  
### Examples   
##### Scan a target
```bash
nuclei -u scanme.nmap.org
```

##### Specify the severity of the templates
```bash
nuclei -u scanme.nmap.org -s info,low,medium,high,critical,unknown # This is the default scan
```

##### Scan a list of targets
```bash
echo 'scanme.nmap.org
https://example.com' > myListOfUrlsOrHosts.txt
nuclei -l myListOfUrlsOrHosts.txt
```

##### Output results to a file 
```bash
nuclei scanme.nmap.org -o results.txt
# Do not edit the file while the scan is running
```

