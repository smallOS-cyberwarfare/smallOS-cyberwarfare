# Searchsploit
Command line search tool for Exploit-DB

### Download
https://github.com/offensive-security/exploitdb via git clone https://github.com/offensive-security/exploitdb

### Usage  
> searchsploit [options] term1 [term2] ... [termN]
  
> searchsploit [--help]  
  
### Examples   
##### Show list of available exploits for Chrome
```bash
searchsploit chrome
```

##### Open an exploit in text editor
```bash
searchsploit -x 49745
```

##### Save an exploit in current working directory
```bash
searchsploit -m 49745
```

##### Show the url of the exploit
```bash
searchsploit -w 49745
```

##### Show results as json
```bash
searchsploit -j chrome
```
