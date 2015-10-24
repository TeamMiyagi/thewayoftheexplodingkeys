var express = require("express");
var app = express();
var server;

app.use(express.static(__dirname + "/../client"));
app.use('/public', express.static(__dirname + "/../client"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/../client/index.html");
});

server = app.listen(3000, function() {
    var port = server.address().port;

    console.log("TWOTEK app is listening at %s", port);
});
