# Crunch
Create dictionaries

### Download
https://github.com/crunchsec/crunch via git clone https://github.com/crunchsec/crunch

### Usage  
> crunch <min> <max> [options]
  
### Examples   
##### Create a wordlist using all combinations of abcd between 1 and 3 number of chars
```bash
crunch 1 3 abcd -o wordlist.txt

# cat wordlist.txt # Print the created wordlist
```

##### Create a wordlist using all combinations of ab between 2 and 4 chars
```bash
crunch 2 4 ab 
```

##### Create a wordlist using all combinations of 'admin', '123' and '456' 
```bash
crunch 2 4 -p admin 123 456 

# 123456admin
# 123admin456
# admin123456
# ...
```

##### Split the result in multiple files
```bash
crunch 2 5 abcdefghijklmn -b 512kib -o START

# The output is 3MB of size.
# With -b 512kib the 3 MB will be splited into files of 512kib of size

# So you will have next files:
# aa-bfgjb.txt
# djegj-fnceb.txt
# idabj-kglnb.txt  
# mkjkj-nnnnn.txt
# bfgjc-djegi.txt  
# fncec-idabi.txt
# kglnc-mkjki.txt
```

###### Using char placeholder replacement
```bash
crunch 32 32 -t example.com/index.php?token=@123

# Generates results like:
#   example.com/index.php?token=a123
#   example.com/index.php?token=b123
#   example.com/index.php?token=c123
```

##### Complete documentation:
- man -> https://www.irongeek.com/i.php?page=backtrack-r1-man-pages/crunch
