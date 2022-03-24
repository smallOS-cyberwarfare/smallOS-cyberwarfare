# Ncat  
Read and Write to machines across networks (empowered rewrite of nc/netcat)  
  
### Download
https://github.com/nmap/nmap/tree/master/ncat via apk add nmap-ncat

### Usage
> ncat [-l] [-k] [ip/hostname + port]  
  
> ncat [ip/hostname] [port] 
Text to send [enter]  
  
> ncat [--help]  
  
### Examples
##### Request a webpage
```bash
echo 'GET / HTTP/1.1
Host: example.com
Accept: */*


' > example_request.txt;
ncat example.com 80 < example_request.txt
```  
  
##### Answer always a static webpage
```bash
echo 'HTTP/1.1 200 OK
Content-Length: 84

<h1>Hello, this is my webpage!</h1><br><a href="//example.com">Go to Example</a>


' > miWeb.html;

while true; do
  ncat -l 127.0.0.1 2080 < miWeb.html
done
# Open in browser http://127.0.0.1:2080
```
