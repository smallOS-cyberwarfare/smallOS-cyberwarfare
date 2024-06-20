# John (John the Ripper)
Password Cracking Tool

### Download
https://github.com/openwall/john via apk add john

### Usage  
> john [OPTIONS] [FILENAME]
  
### Examples   
##### Show Help
```bash
john
```

##### Crack md5 hash for 'test' password
```bash
echo '098f6bcd4621d373cade4e832627b4f6' > hash.txt
john --format=raw-md5 hash.txt
```

##### Crack hashes using a list of passwords 
```bash
john --wordlist=wordlist.txt hashes.txt
```

##### Show cracked passwords for a file 
```bash
john --show --format=raw-md5 hash.txt 

# Hashes cracked are saved at ~/.john/john.pot
```

##### Show all cracked hashes
```bash
cat ~/.john/john.pot
```

##### Benchmark
```bash
john --test
```

##### Crack unknown hash
```bash
john hash.txt
```

##### Crack unknown hash using a session
```bash
john --session=NAME_OF_MY_SESSION hash.txt

# Use control + c to interrupt the session
```

##### Keep cracking unknown hash using an existing session
```bash
john --restore=NAME_OF_MY_SESSION

# Sessions are saved in working folder as files.
```

