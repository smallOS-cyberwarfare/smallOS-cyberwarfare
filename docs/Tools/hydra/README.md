# Hydra
Network Cracking Tool

### Download
https://github.com/vanhauser-thc/thc-hydra via apk add hydra

### Usage  
> hydra [args]
  
### Examples   
##### Show Help 
```bash
hydra
```

##### Brute-force ssh service on port 8022 using a password list
```bash
echo -e "admin\ntest\n1234\nhello\nadmin123\n123456\n12345678" > passwords.txt

hydra -l root -P passwords.txt ssh://127.0.0.1:8022
```

##### Brute-force ftp service in local network
```bash
# Passwords and dictionaries are not included with the password.
# You need to download the passwords lists by yourself

hydra -l user -P passwords.txt ftp://192.168.0.1
```

##### Brute-force http Basic Authentification
```bash
hydra -l admin -P passwords.txt http-get://example.com/admin/
```

##### Brute-force MySQL login using a username list and default password
```bash
hydra -L users.txt -p defaultpass mysql://192.168.0.10
```

##### Brute-force rpd 
```bash
hydra -l administrator -P passwords.txt rdp://192.168.1.100 
```

##### Brute-force SMTP service with email list
```bash
hydra -L emails.txt -p password smtp://mail.example.com
```
