# Shodan
Search engine for devices

### Download
https://github.com/achillean/shodan-python via pip install shodan

### Usage  
> shodan [OPTIONS] COMMAND [ARGS]...
  
> shodan [--help]  
  
### Examples   
##### Set your token
```bash
  shodan init 69dc1f599a996e505d467bf552232536
# get your token from here https://account.shodan.io/
```

##### Show info from a host
```bash
shodan host $(dig example.com +short | head -n 1)
```

##### Show info from an IP
```bash
shodan host 93.184.216.34
```

##### Print your public IP Address
```bash
shodan myip
```

##### Print the number of devices your query matchs
```bash
shodan count openssh
```

##### Save 10 first results matching the query as openssh-data.json.gz
```bash
shodan download --limit 10 openssh-data openssh
```

##### Show the downloaded file
```bash
shodan parse openssh.json.gz
```

##### Get ip and port from downloaded file
```bash
shodan parse --fields ip_str,port --separator : openssh.json.gz
```

##### Summary info about a query 
```bash
shodan stats openssh
```

##### Summary info about a query. Custom results
```bash
shodan stats --facets domain,port,asn openssh
```

##### Check if an IP address is a honeypot
```bash
shodan honeyscore 93.184.216.34
```

##### Print your api token
```bash
cat /home/.config/shodan/api_key
```
