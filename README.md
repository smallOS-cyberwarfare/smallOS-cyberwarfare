# small

smallOS-cyberwarfare (soscw) is a userland Linux distro made to attack organizations in cyber warfare scennarios. This is the aarch64 version patched to run with proot-distro under termux. No root needed.

##### List of Commands  
### Attack
- dig (scan dns)
- dirfinder (folders scanner)  
- dirstalk (folders scanner)  
- domsinkfinder (XSS-DOM sinks highlighter)
- impulse (ddos tools)  
- ncat (empowered netcat)
- nmap (network scanner)
- nuclei (vuln scanner)  
- searchsploit (search exploits)
- shodan (search machines)
- sqlmap (automatic sqli)  
- subdomainfinder (fast/basic subdomain finder)
- tgbot (telegram remote administration tool)  
- turbolist3r (subdomain finder)  
- webservicesfinder (detect webservices in indicated ports)
- webvulnsscanner (xss/openredirect brtueforce scanner)

### Dictionaries  
- https://raw.githubusercontent.com/daviddias/node-dirbuster/master/lists/directory-list-2.3-small.txt [dirstalk]

### Utils  
- 7z (compress/decompress)
- APK (Package Manager)
- createproject (save files or dirs to be created where you want)
- git (manage paackages)  
- lynx (http client, in shell/cli browser)  
- npm (manage node packages)  
- tmux (manage multiple sessions)
- tor (start tor service)  
- torsocks (run a command trought tor network)  
- vim (text editor, includes configuration and emmet plugin)   
  
### Programming  
- bash  
- go  
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

Download Size: **650 Megabytes**  
Installing size: **2 Gigabytes + 650 Megabytes**
Installed Size: **2 Gigabytes**  
Arch: **Aarch64**  
  
Notice: This program only works in Aarch64. If you enter the command "uname -m" and aarch64 is not displayed, you can't use any of this software. 

##### Full Install on Termux

```bash
git clone https://github.com/smallOS-cyberwarfare/smallOS-cyberwarfare
cd smallOS-cyberwarfare
pkg install proot-distro 7z
7z x soscwfs.7z
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
  
- Any hash to check integrity?
$ sha1sum soscwfs.7z
> e7ccc6e1396fd9e1cb24b8c16d7a063b57bda2c7  soscwfs.7z

- How can i save some storage?  
Delete the soscwfs.7z file to save 650 Megabytes after the system has been installed.  

