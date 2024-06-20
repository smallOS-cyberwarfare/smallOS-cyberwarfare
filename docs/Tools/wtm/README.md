# WebTextMiner
WebTextMiner extracts text from webs to create wordlists usefull for brute-force attacks

### Download
https://github.com/StringManolo/wtm via git clone https://github.com/StringManolo/wtm

### Usage  
> wtm [--arg value]    
  
### Examples   

##### Show Usage
```bash
wtm -h
```

##### Extract wordslist as passwords.txt from example.com source code
```bash
wtm -u https://example.com -f passwords.txt

cat passwords.txt # Print Extracted Words
```

##### Extract wordslist as passwords.txt from example.com source code and all the urls fond inside
```bash
wtm -u https://example.com -f passwords.txt -d 2

# -d is deep level (url recursion)
```



