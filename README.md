# SOSCW

smallOS-cyberwarfare (soscw) is a userland Linux distro made to attack organizations in cyber warfare scennarios.  
This is the aarch64 version patched to run with proot-distro under termux. No root needed.  

##### List of Commands  
### Attack
- dig (scan dns)
- dirfinder (folders scanner)  
- dirstalk (folders scanner)  
- domsinkfinder (XSS-DOM sinks highlighter) 
- fierce (DNS reconnaissance tool)
- gitleaks (find credentials in git repositories)
- impulse (ddos tools) 
- john (offline password cracker)
- ngrok (share localhost services)
- ncat (empowered netcat)
- nmap (network scanner)
- nikto (web server/app scanner)
- nuclei (vuln scanner)
- observatory (http headers vuln scanner)
- searchsploit (search exploits)
- shodan (search machines)
- sqlmap (automatic sqli)  
- subdomainfinder (fast/basic subdomain finder)
- userlookup (OSINT on username)

### Dictionaries  
- https://raw.githubusercontent.com/daviddias/node-dirbuster/master/lists/directory-list-2.3-small.txt [dirstalk]

### Utils  
- 7z (compress/decompress)
- APK (Package Manager)
- createproject (save files or dirs to be created where you want)
- git (manage paackages)  
- js (run javascript commands directly in your terminal)  
- lynx (http client, in shell/cli browser)  
- npm (manage node packages)  
- ssh (openssh client to connect to remote servers)
- sshd (openssh server)
- tgbot (telegram remote administration tool)  
- tmux (manage multiple sessions)
- tor (start tor service)  
- torsocks (run a command trought tor network)  
- tree (pretty print all subdirectories and files)
- vim (text editor, includes configuration and emmet plugin)   
  
### Programming  
- bash  
- go 
- perl
- python3  
- node (javasript)
- quickjs (javascript)  

### Alias  
- l = ls  
- la = ls -a  
- v = vim  
- c = clear  
- cl = clear && ls  
- .. = cd ..  
- ... = cd ../..  
- .... = cd ../../..  
- ..... = cd ../../../..  
- pserv = python -m http.server  
- gitc = git clone  
- h = history  
- q = exit  

##### Requeriments

Download Size: **342-1700 Megabytes**  
Installing size: **1.7 Gigabytes**  
Installed Size: **1.7 Gigabytes**  
Arch: **Aarch64**  
System: **Termux**  
  
Notice: This program only works in Aarch64. If you enter the command "uname -m" and aarch64 is not displayed, you will be unable to use this software. 

##### Full Install on Termux

```bash
# Download:  
git clone https://github.com/smallOS-cyberwarfare/smallOS-cyberwarfare  
    
# Change Directory:  
cd smallOS-cyberwarfare  
  
# Install Dependency  
pkg install proot-distro  
  
# Install The System:  
./install_in_proot_distro.sh  
```

##### Usage

- Login into soscw:
```bash
soscw
```

- Run a command inside soscw:
```bash
soscw ls -a
```

- Exit from soscw:
```bash
q
```

##### Documentation  
[Available Tools](https://github.com/smallOS-cyberwarfare/smallOS-cyberwarfare/tree/master/docs#documentation)  
  
##### FAQ
- What is soscw?  
Is a fork of smallOS, a Linux Userland Distribution based on a fork of Alpine Linux Mini Root Filsystem. I removed all not necesary files, compiled dinamically to musl some packages and stripped all debug information to reduce the size of the binaries. Removed comentaries and spaces from files, etc. I configured all the tools and modified the system configuration files so the system is ready for usage.

- Can this program mess with my Termux files?    
No, soscw unlike default proot-distros, is enought isolated from Termux. You can't access the /data directory, sdcard, etc.  
  
- I have root, can i use it?    
You should NOT run this program if you have your device rooted. Some root files that you can't delete without root are attached. If you have root you can delete them by accident. 
   
- Can i use it as my main system?    
Yes, you can. It's my main system too.    
  
- Can i add more packages?  
Yes, you can use apk, git or curl to install new packages   
