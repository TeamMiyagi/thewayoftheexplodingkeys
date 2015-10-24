var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ip = require('ip').address();
var clients = [];
var connectedClients = {};

app.use(express.static(__dirname + '/../client'));
app.use('/public', express.static(__dirname + '/../public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/../client/index.html');
});

app.get('/ip', function(req, res) {
    res.send({ip: ip});
});

app.get('/clients', function(req, res) {
    res.send(connectedClients);
});

server = http.listen(3000, function() {
    var port = server.address().port;

    console.log('TWOTEK app is listening at %s', port);
});


io.on('connection', function (socket) {
    console.log('User connected');

    socket.on('disconnect', function() {
        console.log('User disconnected');
        removeClient(socket);
    });

  socket.on('new-player', function(playerName) {
      console.log('The name of player: ' + socket.id + ' is ' + playerName);
      socket.emit('loginEvent', createLoggedInEvent());
  });

    socket.on('new-player', function(playerName) {
        addClient(playerName, socket);
        socket.emit('loginEvent', createLoggedInEvent(playerName));
    });
});

function createLoggedInEvent(playerName) {
    return {
        type: 'loggedIn',
        player: {
            name: playerName,
            rank: 1
        }
    };
}

function addClient(playerName, socket) {
    var client = {
        name: playerName,
        id: socket.id
    };
    connectedClients[socket.id] = client;
    console.log(connectedClients);
}

function removeClient(socket) {
    delete connectedClients[socket.id];
    console.log(connectedClients);
}
