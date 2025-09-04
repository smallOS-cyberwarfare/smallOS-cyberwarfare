# aicodegen
Talk an AI from your terminal. Tunned to answer only code so you can run it directly.
  
### Download
Unavailable. Custom script made by stringmanolo at gist.github.com

### Usage
> aicodegen [text]
  
### Examples
##### Ask for a javascript that prints 1 + 1
```bash
aicodegen 'Node script that prints in console the result of 1+1'
```  
  
##### Integrate aicodegen into your command
```bash
echo "Today's date is: $(eval $(aicodegen 'bash oneliner that prints the current date in YYYY-MM-DD format'))"
```
