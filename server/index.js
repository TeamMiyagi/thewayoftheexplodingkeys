var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ip = require('ip').address();
// var sentenceService = require('./sentence-service');
// var clientsService = require('./clients-service');
// var boutsService = require('./bouts-service');
// var playersService = require('./players-service');
var gameService = require('./gameservice');

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
    res.json(gameService.clients()); // was res.json(clientsService.clients());
});

app.get('/status', function(req, res) {
    res.send(gameService.status()); // was res.send(generateStatus());
});

server = http.listen(3000, function() {
    var port = server.address().port;
    console.log('TWOTEK app is listening at %s', port);
});


io.on('connection', function (socket) {
    console.log('User connected');

    socket.on('disconnect', function() {
        console.log('User disconnected');
        gameService.disconnectUser(socket.id);
        // was:
        // boutsService.deleteBouts(socket.id);
        // clientsService.remove(socket);
    });

    socket.on('new-player', function(playerName) {
        if (gameService.doesPlayerAlreadyExist(playerName)) {
        // if (clientsService.doesPlayerAlreadyExist(playerName)) {
            socket.emit('loginEvent', { success: false });
        }
        else {
            gameService.add(playerName);
            // was
            // playersService.add(playerName);
            // clientsService.add(playerName, socket);
            socket.emit('loginEvent', createLoggedInEvent(socket.id, playerName));
        }
    });

    socket.on('findMatch', function() {
        console.log("findMatch");
        var sourceClient = gameService.getClientById(socket.id);
        // was: var sourceClient = clientsService.getById(socket.id);

        var opponent = gameService.getWaitingClient();
        // var opponent = clientsService.getWaitingClient();
        if (opponent) {
            gameService.startBout(socked.it, opponent.id);
            // was:
            // clientsService.setStatusById(socket.id, "fighting");
            // clientsService.setStatusById(opponent.id, "fighting");
            // startBout(socket.id, opponent.id);
        }
        else {
            console.log("About to call clientsService.setStatusById, " + socket.id);
            gameService.setStatusById(socket.id, "findingMatch");
            // clientsService.setStatusById(socket.id, "findingMatch");
        }

        console.log("findMatch end");
    });

    socket.on('roundComplete', function(roundCompleteMsg) {
        console.log('roundComplete: ' + roundCompleteMsg);
        gameService.updateBoutStatus(socket.id, roundCompleteMsg);
        // was: boutsService.update(socket.id, roundCompleteMsg);

        // TODO!
        var roundStatus = boutsService.getRoundStatus(roundCompleteMsg.id);
        if (roundStatus.isComplete) {
            console.log('Round complete!');
            updateStatsForPlayers(roundCompleteMsg.id);
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
        gameService.gameOver(socket.id);
        // was boutsService.deleteBouts(socket.id);
    });

    socket.on('endGame', function() {
        gameService.endGame(socket.id);
        // clientsService.setStatusById(socket.id, 'idle');
    });
});

function updateStatsForPlayers(boutId) {
    // TODO
}

function createLoggedInEvent(playerId, playerName) {
    return {
        type: 'loggedIn',   // probably not used
        success: true,
        player: {
            id: playerId,
            name: playerName,
            stats: playersService.stats(playerName)
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
