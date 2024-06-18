
var assert = require("assert");
var clim = require("./index");

var expectLog = function(expected) {
  return function(method, prefixes, msg){
    assert.equal((method + " " + prefixes.join(" ")).trim() + " " + msg, expected);
  };
};

// Basic usage
["log", "info", "warn", "error"].forEach(function(method){
  var console = clim();
  clim.logWrite = expectLog(method.toUpperCase() + " message");
  console[method]("message");
});


// Prefix
clim.logWrite = expectLog("LOG prefix message");
clim("prefix").log("message");

// Formatting
clim.logWrite = expectLog("LOG prefix count: 2");
clim("prefix").log("count: %d", 2);


// Objects
clim.logWrite = expectLog("LOG prefix message { foo: 'bar' }");
clim("prefix").log("message", { foo: "bar" });


// Inheriting
(function() {
  var parent = clim("main");
  var child = clim("sub", parent);
  assert(console !== parent, "new object is created");
  clim.logWrite = expectLog("LOG main sub message");
  child.log("message");
}());



// Patching
(function() {
  var original = {};
  var console = clim(original, true);
  assert(console === original, "no new object is created");
  clim.logWrite = expectLog("LOG message");
  console.log("message");
}());


// Patching with prefix
(function() {
  var original = {};
  var console = clim("prefix", original, true);
  assert(console === original, "no new object is created");
  clim.logWrite = expectLog("LOG prefix message");
  console.log("message");
}());


// Inherit from patched object
(function() {
  var original = {};
  var console = clim("prefix", original, true);
  assert(console === original, "no new object is created");

  var child = clim("subprefix", console);
  assert(child !== console, "no new object is created");

  clim.logWrite = expectLog("LOG prefix subprefix message");

  child.log("message");
}());


// Circular references
(function() {
  var console = clim();

  var a = {}, b = {};
  a.other = b;
  b.other = a;

  clim.logWrite = expectLog("LOG Circular object { other: { other: [Circular] } }");
  console.log("Circular object", a);
}());

// Other methods are there too
(function() {
  var console = clim();
  ["dir", "time", "timeEnd", "trace", "assert"].forEach(function(method){
    assert(typeof console.dir === "function");
  });
}());

function expectArrMsg() {
  var args = Array.prototype.slice.call(arguments);

  return function(method, prefix, msg) {
    assert.deepEqual(msg, args, 'should log the called arguments');
  };
}

(function() {
  var child = clim('prefix', {}, {
    noFormat: true,
    patch: true
  });

  clim.logWrite = expectArrMsg('something:is', {foo: 'bar'});
  child.log('something:is', {foo: 'bar'});
}());
