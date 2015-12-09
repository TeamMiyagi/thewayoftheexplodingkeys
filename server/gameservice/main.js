var sentenceService = require('../sentenceservice');
var clients = require('./clients');
var bouts = require('./bouts');
var players = require('./players');
var statusBuilder = require('./statusbuilder');

function getClients() {
    return clients.clients();
}

function getStatus() {
    return statusBuilder.generateStatus(
        clients.clients(), bouts.bouts());
}

function disconnectUser(socket_id) {
    bouts.deleteBouts(socket_id);
    clients.remove(socket_id);
}

function addPlayer(playerName, socket_id, onSuccess, onError) {
    if (doesPlayerAlreadyExist(playerName)) {
        onError();
    }
    else {
        players.add(playerName);
        clients.add(playerName, socket_id);
        onSuccess(socket_id, playerName, getPlayerStats(playerName));
    }
}

function doesPlayerAlreadyExist(playerName) {
    return clients.doesPlayerAlreadyExist(playerName);
}

function getPlayerStats(playerName) {
    return {
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0
    };
}

function findOpponent() {
    return clients.getWaitingClient();
}

function setClientStatus(socket_id, status) {
    clients.setClientStatusById(socket_id, status);
}

function startBout(player1_id, player2_id) {
    clients.setClientStatusById(player1_id, "fighting");
    clients.setClientStatusById(player2_id, "fighting");

    var player1 = clients.getById(player1_id);
    var player2 = clients.getById(player2_id);
    return bouts.create(player1, player2, sentenceService.get());
}



//////////////////////////////////

function stubbedFunction(functionName) {
    console.log('Stubbed function called! (' + functionName + ')');
}


//////////////////////////////////
// Exported accessors
module.exports.clients = getClients;    // returns a map of clients. Keys are the players name.
module.exports.status = getStatus;      // returns object with info such as number of wins/losses
module.exports.findOpponent = findOpponent; // returns client object or null

//////////////////////////////////
// Exported mutators
module.exports.disconnectUser = disconnectUser;
module.exports.addPlayer = addPlayer;
module.exports.setClientStatus = setClientStatus;
module.exports.startBout = startBout;
