var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ip = require('ip').address();
var gameService = require('./gameservice');
console.log(gameService);


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

    socket.on('error', function(error) {
        console.log('ERROR! ERROR! ERROR! ABORTING!');
        console.log(error);
    });

    socket.on('disconnect', function() {
        logSocketMsg('User disconnected');
        gameService.disconnectUser(socket.id);
    });

    socket.on('new-player', function(playerName) {
        logSocketMsg('new-player');
        gameService.addPlayer(playerName, socket.id, handlePlayerAdded(socket), handlePlayerNotAdded(socket));
    });

    socket.on('findMatch', function() {
        logSocketMsg('findMatch');
        var opponent = gameService.findOpponent();

        if (opponent) {
            var bout = gameService.startBout(socket.id, opponent.id);
            var player1Msg = bout;
            var player2Msg = {
                id: bout.id,
                player1: bout.player2,
                player2: bout.player1,
                sentence: bout.sentence
            };

            io.sockets.connected[socket.id].emit('boutStarted', player1Msg);
            io.sockets.connected[opponent.id].emit('boutStarted', player2Msg);
        }
        else {
            gameService.setClientStatus(socket.id, 'findingMatch');
        }

        console.log("findMatch end");
    });

    socket.on('roundComplete', function(roundCompleteMsg) {
        logSocketMsg('roundComplete');
        // console.log('roundComplete: ' + roundCompleteMsg);
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
        logSocketMsg('gameOver');
        gameService.gameOver(socket.id);
        // was boutsService.deleteBouts(socket.id);
    });

    socket.on('endGame', function() {
        logSocketMsg('endGame');
        gameService.endGame(socket.id);
        // clientsService.setStatusById(socket.id, 'idle');
    });
});

function updateStatsForPlayers(boutId) {
    // TODO
}

function handlePlayerAdded(socket) {
    return function(playerId, playerName, playerStats) {
        var loggedInEvent = {
            type: 'loggedIn',   // probably not used
            success: true,
            player: {
                id: playerId,
                name: playerName,
                stats: playerStats
            }
        };
        socket.emit('loginEvent', loggedInEvent);
    };
}

function handlePlayerNotAdded(socket) {
    return function() {
        socket.emit('loginEvent', { success: false });
    };
}


function logSocketMsg(msgTitle) {
    console.log('received socket message: **' + msgTitle + '**');
}
