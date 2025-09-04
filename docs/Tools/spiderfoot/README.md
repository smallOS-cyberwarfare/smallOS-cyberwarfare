# SpiderFoot
SpiderFoot automates OSINT for threat intelligence and mapping your attack surface.

### Download
https://github.com/smicallef/spiderfoot via wget https://github.com/smicallef/spiderfoot/archive/v4.0.tar.gz

### Usage  
> sf [-l] [ip:port] 
  
> sfcli   
  
### Examples   
##### Start Server and Open Web Interface  
```bash
sf -l 127.0.0.1:5001
# Open the url http://localhost:5001/newscan in your browser 
# If you are not an expert, this is easier to use than sfcli
```

##### Start Server and Open CLI Interface 
```bash
sf -l 127.0.0.1:5001 &

# Wait until server is up.
sfcli 

# sfcli command will open a special interactive prompt indicated by sf>


# You can also open 2 termux windows and start 2 soscw instances.
# Use one instance for sf and the other for sfcli if you feel more confortable that way.
```

##### Show help in sfcli (assuming you using sf> interactive shell)
```bash
help
```

##### Show available modules in sfcli (assuming you using sf> interactive shell)
```bash
modules
```

##### Find WHOIS for example.com with logs in sfcli (assuming you using sf> interactive shell)
```bash
start example.com -m sfp_whois -w

# To show results, run the command data SCANID (SCANID IS SHOWN IN LOGS)
# For example: data 1F2314BC
```
