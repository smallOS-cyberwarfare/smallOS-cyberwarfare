
var util = require("util");
var clim;

module.exports = clim = function (prefix, parent, patch) {
  var ob;
  var noFormat = false;
  // Fiddle optional arguments
  patch = Array.prototype.slice.call(arguments, -1)[0];
  if (typeof patch === 'object') {
    noFormat = patch.noFormat;
    patch = patch.patch;
  }
  if (typeof patch !== "boolean") patch = false;
  if (typeof prefix === "object" && prefix !== null) {
    parent = prefix;
    prefix = undefined;
  }

  if (patch && parent) {
    // Modify given object when patching is requested
    ob = parent;
  }
  else {
    // Otherwise create new object
    ob = {};
    if (parent && parent._prefixes) {
      // and inherit prefixes from the given object
      ob._prefixes = parent._prefixes.slice();
    }
  }

  // Append new prefix
  if (!ob._prefixes) ob._prefixes = [];
  if (prefix) ob._prefixes.push(prefix);

  ob.log = createLogger("LOG", ob._prefixes, noFormat);
  ob.info = createLogger("INFO", ob._prefixes, noFormat);
  ob.warn = createLogger("WARN", ob._prefixes, noFormat);
  ob.error = createLogger("ERROR", ob._prefixes, noFormat);
  consoleProxy(ob);

  return ob;
};

clim.getWriteStream = function() {
  return process.stderr;
};

// By default write all logs to stderr
clim.logWrite = function(level, prefixes, msg){
  var line = clim.getTime() + " " + level;
  if (prefixes.length > 0) line += " " + prefixes.join(" ");
  line += " " + msg;
  clim.getWriteStream(level).write(line + "\n");
};


clim.getTime = function(){
  return new Date().toString();
};


// Just proxy methods we don't care about to original console object
function consoleProxy(ob){
  // list from http://nodejs.org/api/stdio.html
  var methods = ["dir", "time", "timeEnd", "trace", "assert"];
  methods.forEach(function(method){
    if (ob[method]) return;
    ob[method] = function(){
      return console[method].apply(console, arguments);
    };
  });
}

function createLogger(method, prefixes, noFormat) {
  return function () {
    // Handle formatting and circular objects like in the original
    var msg = noFormat ?
            Array.prototype.slice.call(arguments)
          : util.format.apply(this, arguments);

    clim.logWrite(method, prefixes, msg);
  };
}
