# Impulse  
Denial Of Service (DOS) ToolKit  
  
### Download
https://github.com/LimerBoy/Impulse via git clone https://github.com/LimerBoy/Impulse

### Usage
> impulse [--method SMS/EMAIL/NTP/SYN/UDP/POD/ICMP/HTTP/Slowloris/Memcached] [--target phone/email/ip/ip:port/url] [--time seconds] [--threads number]  
  
> impulse [--help]
  
### Examples
##### Send multiple sms from password recovery supporting services like telegram, google, ...
```bash
impulse --method SMS --time 20 --threads 16 --target +7999999999
```


