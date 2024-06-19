# Nikto
Web App/Server Scanner

### Download
https://github.com/sullo/nikto via apk add nikto

### Usage  
> nikto [-arg]

> nikto [-arg value]
  
### Examples   
##### Show Basic Help  
```bash
nikto 
```

##### Show Advanced Help 
```bash
nikto -H

# There is a good number of options, only most basic usage is covered in this examples 
```

##### Basic Scan 
```bash
nikto -h example.com
```

##### Scan using all plugins
```bash
nikto -h example.com -Tuning x
```

##### Scan using all plugins, check for all possible CGI paths
```bash
nikto -h example.com -Tuning x -c All


```

##### Scan using URI encoding evasion
```bash
nikto -h example.com -evasion 1 # option number 1 used

# Available Evasion Options:
# 1     Random URI encoding (non-UTF8)
# 2     Directory self-reference (/./)
# 3     Premature URL ending
# 4     Prepend long random string
# 5     Fake parameter
# 6     TAB as request spacer
# 7     Change the case of the URL
# 8     Use Windows directory separator (\)
# A     Use a carriage return (0x0d) as a request spacer
# B     Use binary value 0x0b as a request spacer

```

##### Basic Scan with output saved in a file
```bash
nikto -h example.com -o results.txt

# The extension of the file determines the output format used by nikto
# Available formats/file extensions
# .csv   Comma-separated-value
# .htm   HTML Format
# .nbe   Nessus NBE format
# .sql   Generic SQL
# .txt   Plain text
# .xml   XML Format
```


##### Basic Scan with SSL forced on port
```bash
nikto -h example.com:80 --ssl

# You only need this option when the server is configured to run ssl on a weird port number and you want to force nikto to uses ssl on that port.
# For example you don't need to use --ssl arg in the command nikto -h example.com:443
```


