# Gitleaks
Find credentials in git repositories

### Download
https://github.com/gitleaks/gitleaks via git clone https://github.com/gitleaks/gitleaks apk add go=1.17 using https://github.com/StringManolo/dev-small and make build 

### Usage  
> gitleaks [args]
  
### Examples   
##### Show version 
```bash
gitleaks version 
```

##### Scan a repo
```bash
git clone --depth 1 https://github.com/stringmanolo/panther.git /tmp/panther && ./gitleaks detect --source /tmp/panther --verbose && rm -rf /tmp/panther
```
