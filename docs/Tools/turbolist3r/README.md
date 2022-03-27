# Turbolist3r
desc

### Download
package link via download method

### Usage  
> turbolist3r [args]
  
> turbolist3r [--help]  
  
### Examples   
##### Scan a domain from public places
```bash
turbolist3r -d example.com
```

##### Use multiple threads
```bash
turbolist3r -d example.com -t 8  
```

##### Save domains to a file 
```bash
turbolist3r -d example.com -o example_domains.txt
```

##### Reverse DNS analysis (get dns records to aid in subdomain takeover)
```bash
turbolist3r -d example.com -a
```

##### Save DNS records in a file
```bash
turbolist3r -d example.com -a --saverdns example_records.txt
```
