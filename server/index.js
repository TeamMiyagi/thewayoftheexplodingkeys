var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ip = require('ip').address();
var sentenceService = require('./sentence-service');

var clients = [];
var connectedClients = {};

app.use(express.static(__dirname + '/../client'));
app.use('/public', express.static(__dirname + '/../public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/../client/index.html');
});

app.get('/ip', function(req, res) {
    var env = process.env.NODE_ENV;
    var ipToReturn = ip;
    if (!env || env !== 'local') {
        ipToReturn = '52.17.219.89';
    }
    return res.send({ip: ipToReturn});
});

app.get('/clients', function(req, res) {
    res.json(connectedClients);
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
        addClient(playerName, socket);
        socket.emit('loginEvent', createLoggedInEvent(playerName));
    });

    socket.on('findMatch', function() {
        console.log("findMatch");
        var sourceClient = connectedClients[socket.id];
        var opponent;

        Object.keys(connectedClients).forEach(function(clientId) {
            var client = connectedClients[clientId];
            if (client.status === "findingMatch") {
                opponent = client;
            }
        });

        if (opponent) {
            startBout(socket.id, opponent.id);
        }
        else {
            if (sourceClient) {
                sourceClient.status = "findingMatch";
            }
        }

        console.log(connectedClients);
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

function startBout(player1Id, player2Id) {
    console.log("startBout");

    var bout = {
        id: createBoutId(),
        player1Id: player1Id,
        player2Id: player2Id,
        sentence: sentenceService.get()
    };

    var player1Msg = bout;
    var player2Msg = {
        id: bout.id,
        player1Id: bout.player2Id,
        player2Id: bout.player1Id
    };

    io.sockets.connected[player1Id].emit('boutStarted', player1Msg);
    io.sockets.connected[player2Id].emit('boutStarted', player2Msg);

    console.log(connectedClients);
}

function createBoutId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}
