# js

Js is a command utility to run javascript as a command in a simple way.

### Use cases

- Run javascript in the fastest way posible preserving your code in the history.
- Empower your shell scripting and trasladate your javascript knowledge to the shell.
- Parse strings, use regexp, split, replace... using the same code everywhere.

### Features

- A pipedStdin global that holds piped input if provided from command line.
- A run global function that allows you to run commands also inside your javascript code.
- A loadFile function to load files in memory.
- Small and portable. 80 lines of code and should work anywhere.
- Only native node modules used, so you don't depend on versions and installs.

### Examples

Run javascript: ```js 'console.log("Hello world")'```

Work with piped streams: ```date | js 'console.log(pipedStdin.split(" ")[3])'```

Fetch a remote resource and return the number of words ```js 'console.log(run("curl --silent http://example.com"))' | wc -w```

### Install

npm install --global command-javascript

### Alternative Install

curl https://github.com/StringManolo/js/blob/c01e68feaaef521304fc7b5d073aec209243a311/bin/js -L > /usr/bin/js 
