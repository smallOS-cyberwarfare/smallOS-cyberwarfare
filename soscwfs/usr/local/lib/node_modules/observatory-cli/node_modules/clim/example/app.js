express = require("express");
clim = require("../index");

var console = clim("APP");

app = express();

app.listen(8080, function(){
  console.log("now listening on port %d", 8080);
});


app.get("/", function(req, res) {
  var logger = clim("root", console);
  logger.log("Request");
  res.send('<a href=/sub>sub<a/>');
});

app.get("/sub", function(req, res) {
  var logger = clim("sub", console);
  logger.log("Request");
  res.send('<a href=/>root<a/>');
});
