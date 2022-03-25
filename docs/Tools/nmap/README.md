# nmap
Multipurpouse Network Scanning Tool

### Download
https://nmap.org/download via apk add nmap

### Usage  
> nmap [Scan Type(s)] [Options] {target specification}
  
> nmap [--help]  
  
### Examples   
##### Scan most popular 1000 ports  
```bash
nmap example.com
```
  
##### Scan most popular X ports  
```bash
nmap --top-ports 10 scanme.nmap.org
```

##### Scan ports by protocol
```bash
nmap scanme.nmap.org -p http,ssh
```

##### Scan a list of ports
```bash
nmap scanme.nmap.org -p22,443
```

##### Scan all ports  
```bash
nmap -p- example.com
```

##### Speed of the scan
```bash
nmap scanme.nmap.org -T0
# Ranges go from 0 (slower) to 5 (faster)
```

##### Find hosts in a network  
```bash
nmap -sn 192.168.43.1/24
```

##### Scan ip networks
```bash
nmap 192.168.43.0-140  
``` 

##### Scan it even if it's down
```bash
nmap scanme.nmap.org -Pn
# With -Pn flags nmap scan hosts even if hosts seems down to ping scan. 
```

##### Multiple targets at once  
```bash
nmap example.com google.com
```

##### Scan hosts from file  
```bash
echo 'example.com
google.com' > hosts.txt
nmap -iL hosts.txt
```

##### Ouput to a file in normal format  
```bash
nmap -oN example.com
# Available output formats -oN/-oX/-oS/-oG/-oA
# oN outputs in Normal format
# oX outputs in XML format
# oS outputs in Sc1pt K1dd13 format
# oG outputs in greapable format
# oA outputs in all the formats
```

##### Detect Service  
```bash
nmap -sV example.com
```

##### Detect Service (better but slower)
```bash
nmap scanme.nmap.org -sV --version-intensity 9
# Ranges go from 0 (faster) to 9 (slower)
```

##### Search for vulnerabilities  
```bash
nmap -Pn --script vuln scanme.nmap.org
```

##### DOS slowloris attack  
```bash
nmap 127.0.0.1 --max-parallelism 800 -Pn --script http-slowloris --script-args http-slowloris.runforever=true
```

##### Fast scan and OS detection
```bash
nmap -A -T4 example.com
```

##### Scan UDP ports
```bash
nmap -sU example.com
```

##### Exclude a host from scan  
```bash
nmap 192.168.0.* --exclude 192.168.0.2
```

##### Exclude hosts of a list from scan
```bash
echo '192.168.0.1
192.168.0.2' > hostsList.txt
nmap 192.168.0.* --excludefile /hostsList.txt
```

##### Scan an Ipv6 
```bash
nmap -6 2606:2800:220:1:248:1893:25c8:1946
```

##### View packets send
```bash
nmap scanme.nmap.org --packet-trace
```

##### Speed of the scan
```bash
nmap scanme.nmap.org -T0
# Ranges go from 0 (slower) to 5 (faster)
```

##### SSH brute-force attack
```bash
nmap --script=ssh-brute.nse scanme.nmap.org -p22
```

##### Specify the dns servers for resolution
```bash
nmap scanme.nmap.org --dns-servers 1.1.1.1
```

##### Show reason why nmap thinks a host or port is in a particular state
```bash
nmap scanme.nmap.org --reason
```

##### Whois Scan
```bash
nmap --script=whois*,ip-geolocation-maxmind,asn-query example.com
```
