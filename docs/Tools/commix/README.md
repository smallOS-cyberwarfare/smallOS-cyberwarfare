# Commix
OS Command Injection Exploitation Tool

### Download
https://github.com/commixproject/commix via git clone https://github.com/commixproject/commix

### Usage  
> commix [args]
  
### Examples   
##### Show Help
```bash
commix -h
```

##### SQLI 
```bash
commix --url "http://example.com/page?id=1"
```

##### Vulnerable arguments
```bash
commix --url "http://example.com/login.php" --data "username=admin&password=test" --cookie "sessionid=123"
```

##### Database Enumeration 
```bash
commix --url "http://example.com/page.php?id=1" --dbs
```

##### Database Tables Enumeration
```bash
commix --url "http://example.com/page.php?id=1" --dbms mysql --current-db --tables
```

##### Command Inyection using multiple techniques
```bash
commix -u "http://example.com/page.php?id=1" --url-param id --technique=1,2,3
```

##### Use a list of urls
```bash
commix --url-list "urls.txt"
```

##### Change output format
```bash
commix -u "http://example.com/page.php?id=1" --output-format=html --output-dir="/path/to/output"
```


