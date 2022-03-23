# Dig  
Domain Information Groper is a flexible tool for interrogating DNS name servers.  

### Download
https://pkgs.alpinelinux.org/package/edge/main/aarch64/bind via apk add bind-tools

### Usage  
> dig [@server] [-b address] [-c class] [-f filename] [-k filename] [-m] [-p port#] [-q name] [-t type] [-x addr] [-y [hmac:]name:key] [-4] [-6] [name] [type] [class] [queryopt...]  
  
> dig [-h]  
  
> dig [global-queryopt...] [query...]  

### Examples   
##### Resolve google.com domain (you get the ip of the domain)  
```bash
dig google.com +short
```


##### Dig from cloudflare servers the google.com domain txt records, short output.  
```bash
dig @1.1.1.1 google.com TXT +short  
```

##### Get list of domains pointing to mail exchange servers  
```bash
dig pastebin.com MX +short 
```

##### List of name servers (name servers hold all the records for the domain, A, AAAA, MX, TXT, CNAME, NS, PTR, SOA...)
```bash
dig example.com NS +short
```

##### List all the records available for the domain
```bash
dig google.com -t ANY
```

##### Reverse lookup (view domains resolving to this ip)  
```bash
dig -x 149.154.167.91  
```

##### Use domains or ips from a file  
```bash
echo -e 'google.com\nexample.com' > listOfDomains.txt;
dig -f listOfDomains.txt +short
```

##### Multiple queries in same command  
```bash
dig google.com A  example.com TXT  -x 140.82.121.4  google.es CNMAE  +short
```

##### Trace the hops (like a traceroute, but for DNS queries)  
```bash
dig example.com +trace +short
```

##### List of name servers for a TLD (.com, .net, .org, .eu, ...)  
```bash
dig NS eu +short
```
