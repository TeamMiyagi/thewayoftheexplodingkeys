var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ip = require('ip').address();
var sentenceService = require('./sentence-service');
var clientsService = require('./clients-service');
var boutsService = require('./bouts-service');


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
    res.json(clientsService.clients());
});

server = http.listen(3000, function() {
    var port = server.address().port;

    console.log('TWOTEK app is listening at %s', port);
});


io.on('connection', function (socket) {
    console.log('User connected');

    socket.on('disconnect', function() {
        console.log('User disconnected');
        clientsService.remove(socket);
    });

    socket.on('new-player', function(playerName) {
        clientsService.add(playerName, socket);
        socket.emit('loginEvent', createLoggedInEvent(playerName));
    });

    socket.on('findMatch', function() {
        console.log("findMatch");
        var sourceClient = clientsService.getById(socket.id);

        var opponent = clientsService.getWaitingClient();
        if (opponent) {
            clientsService.setStatusById(socket.id, "fighting");
            clientsService.setStatusById(opponent.id, "fighting");
            startBout(socket.id, opponent.id);
        }
        else {
            console.log("About to call clientsService.setStatusById, " + socket.id);
            clientsService.setStatusById(socket.id, "findingMatch");
        }

        console.log("findMatch end");
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

function startBout(player1Id, player2Id) {
    console.log("startBout");
    var player1 = clientsService.getById(player1Id);
    var player2 = clientsService.getById(player2Id);

    var bout = boutsService.create(player1, player2, sentenceService.get());

    var player1Msg = bout;
    var player2Msg = {
        id: bout.id,
        player1: bout.player2,
        player2: bout.player1,
        sentence: bout.sentence
    };

    io.sockets.connected[player1.id].emit('boutStarted', player1Msg);
    io.sockets.connected[player2.id].emit('boutStarted', player2Msg);
}
