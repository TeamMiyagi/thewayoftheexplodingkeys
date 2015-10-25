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

app.get('/status', function(req, res) {
    res.send(generateStatus());
});

server = http.listen(3000, function() {
    var port = server.address().port;

    console.log('TWOTEK app is listening at %s', port);
});


io.on('connection', function (socket) {
    console.log('User connected');

    socket.on('disconnect', function() {
        console.log('User disconnected');
        boutsService.deleteBouts(socket.id);
        clientsService.remove(socket);
    });

    socket.on('new-player', function(playerName) {
        clientsService.add(playerName, socket);
        socket.emit('loginEvent', createLoggedInEvent(socket.id, playerName));
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

    socket.on('roundComplete', function(roundCompleteMsg) {
        console.log('roundComplete: ' + roundCompleteMsg);
        boutsService.update(socket.id, roundCompleteMsg);

        var roundStatus = boutsService.getRoundStatus(roundCompleteMsg.id);
        if (roundStatus.isComplete) {
            console.log('Round complete!');
            var bout = boutsService.get(roundCompleteMsg.id);
            boutsService.resetBout(bout, sentenceService.get());
            io.sockets.connected[bout.player1.id].emit('roundResult', {
                didYouWin: roundStatus.player1Won,
                nextBout: bout
            });
            io.sockets.connected[bout.player2.id].emit('roundResult', {
                didYouWin: roundStatus.player2Won,
                nextBout: bout
            });
        }
    });

    socket.on('gameOver', function() {
        boutsService.deleteBouts(socket.id);
    });
});

function createLoggedInEvent(playerId, playerName) {
    return {
        type: 'loggedIn',
        player: {
            id: playerId,
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

function generateStatus() {
    return "<html>" +
            "<head>" +
                "<title>TWOTEK Status</title>" +
                '<style>' +
                    'body {background-color:lightgray}' +
                    'span {display: block}' +
                '</style>' +
            "</head>" +
            "<body>" +
                "<h1>TWOTEK Status</h1>" +
                "<div>" +
                    "<h2>Connected players</h2>" +
                    connectedPlayersAsHtml() +
                "</div>" +
                "<div>" +
                    "<h2>Bouts in progress</h2>" +
                    boutsAsHtml() +
                "</div>" +
            "</body>" +
            "</html>";
}

function connectedPlayersAsHtml() {
    var clientsMap = clientsService.clients();
    var playerHtml = "";

    Object.keys(clientsMap).forEach(function(clientKey) {
        var status = clientsMap[clientKey].status || 'idle';
        var statusText = ' (' + status + ')';
        playerHtml += "<span>" + clientsMap[clientKey].name + statusText + "</span>";
    });

    return playerHtml;
}

function boutsAsHtml() {
    var boutsMap = boutsService.bouts();
    var boutsHtml = "";

    Object.keys(boutsMap).forEach(function(boutKey) {
        bout = boutsMap[boutKey];
        boutsHtml += '<span>' + bout.player1.name + ' versus ' + bout.player2.name + '</span>';
    });

    return boutsHtml;
}
