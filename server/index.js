var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ip = require('ip').address();
var clients = [];

app.use(express.static(__dirname + '/../client'));
app.use('/public', express.static(__dirname + '/../public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/../client/index.html');
});

app.get('/ip', function(req, res) {
    res.send({ip: ip});
});

server = http.listen(3000, function() {
    var port = server.address().port;

    console.log('TWOTEK app is listening at %s', port);
});


io.on('connection', function (socket) {
  console.log('User connected');

  socket.on('disconnect', function() {
    console.log('User disconnected');
  });

  socket.on('new-player', function(playerName) {
      console.log('The name of player: ' + socket.id + ' is ' + playerName);
      socket.emit('loginEvent', createLoggedInEvent());
  });
});

function createLoggedInEvent() {
    return {
        type: 'loggedIn'
    };
}
