# Console.Log IMproved - clim

A little Node.js module which improves the behavior of the logging methods of the
`console` object without changing its API. Just drop it in.

http://esa-matti.suuronen.org/blog/2012/09/30/improving-console-dot-log-for-node-dot-js/

## Improvements

Improvements affect only `log`, `info`, `warn` and `error` methods.

  - Add timestamp
  - Add log level LOG/INFO/WARN/ERROR
  - Always log to stderr
  - Allow prefixing and inheriting

## Installation

    npm install clim

## Usage

### Function Signature

_Object_ newconsole = clim( [_String_ prefix], [_Object_ parent], [_Boolean/Object_ patch parent] )

All parameters are optional.

Just shadow the original `console` object and use it like always:

```javascript
var console = require("clim")();
console.log("message");
console.info("message");
console.warn("message");
console.error("message");
```


Or if you want process wide improved console object you can monkeypatch the
original object by passing it and `true` to `clim`:


```javascript
require("clim")(console, true);
console.log("message");
```

Or if you don't want to use the `util.format` and just pass the arguments to
`clim.logWrite`, you can use `noFormat` option to do that:

```javascript
var console = require("clim")("", {}, {
  noFormat: true,
  patch: false
});

console.log("message")
```

### Prefix Inheriting

Add prefix to your log messages by passing it as the first argument:

```javascript
var console = require("clim")("myapp");
console.log("message");
```

    Sun Sep 30 2012 16:45:57 GMT+0300 (EEST) INFO myapp message


Inherit prefixes from some other console object by passing it as the second
parameter:

```javascript
var clim = require("clim");

var console = clim("myapp");
console.log("message");

function somefunc(){
  var logger = clim("somefunc", console);
  logger.warn("in function");
}

somefunc();
```

    Sun Sep 30 2012 16:59:12 GMT+0300 (EEST) INFO myapp message
    Sun Sep 30 2012 16:59:12 GMT+0300 (EEST) WARNING myapp somefunc in function

### Customizing


Change date format by overriding `getTime`:

```javascript
clim.getTime = function(){
  return new Date().toString();
};
```

Change global log target and formatting details by overriding `logWrite`:

```javascript
clim.logWrite = function(level, prefixes, msg) {
  // Default implementation writing to stderr
  var line = clim.getTime() + " " + level;
  if (prefixes.length > 0) line += " " + prefixes.join(" ");
  line += " " + msg;
  process.stderr.write(line + "\n");

  // or post it web service, save to database etc...
};
```


## Design Philosophies

  - Keep the same api as in the original [console](http://nodejs.org/api/stdio.html) object
  - Small
  - No dependecies
  - Tests
  - MIT Licensed
