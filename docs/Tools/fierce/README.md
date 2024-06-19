# Fierce
A DNS reconnaissance tool for locating non-contiguous IP space.

### Download
https://github.com/mschwager/fierce via git clone https://github.com/mschwager/fierce.git && cd pierce && python3 setup.py install

### Usage  
> pierce [args]
  
### Examples  
##### Help message
```bash
fierce -h
```

##### Scan Google.com 
```bash
fierce --domain google.com
```

##### Expand Scan to Entire Class C Range
```bash
fierce --domain google.com --wide
```

##### Specify DNS servers
```bash
fierce --domain google.com --dns-servers 8.8.8.8 8.8.4.4
```

##### Search specific domains
```bash
fierce --domain google.com --search mail calendar
```

##### Specify subdomains
```bash
fierce --domain google.com --subdomains www mail admin
```
