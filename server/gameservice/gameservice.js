var sentenceService = require('../sentence-service'); // TODO: needs moving
var clientsService = require('./clients');
var boutsService = require('./bouts');
var playersService = require('./players');
var statusBuilder = require('./statusbuilder');

function getClients() {
    return clientsService.clients();
}

function getStatus() {
    return statusBuilder.generateStatus(
        clientsService.clients(), boutsService.bouts());
}

function disconnectUser(socket_id) {
    boutsService.deleteBouts(socket_id);
    clientsService.remove(socket_id);
}

function addPlayer(playerName, socket_id, onSuccess, onError) {
    if (doesPlayerAlreadyExist(playerName)) {
        onError();
    }
    else {
        playersService.add(playerName);
        clientsService.add(playerName, socket_id);
        onSuccess(socket_id, playerName);
    }
}

function doesPlayerAlreadyExist(playerName) {
    stubbedFunction('doesPlayerAlreadyExist');
    return false;
}

function getPlayerStats(playerName) {
    stubbedFunction('getPlayerStats');
}

function findOpponent() {
    return clientsService.getWaitingClient();
}

function setClientStatus(socket_id, status) {
    clientsService.setClientStatusById(socket_id, status);
}

function startBout(player1_id, player2_id) {
    clientsService.setClientStatusById(player1_id, "fighting");
    clientsService.setClientStatusById(player2_id, "fighting");

    var player1 = clientsService.getById(player1_id);
    var player2 = clientsService.getById(player2_id);
    return boutsService.create(player1, player2, 'wax on, wax off'/*sentenceService.get()*/);
}



//////////////////////////////////

function stubbedFunction(functionName) {
    console.log('Stubbed function called! (' + functionName + ')');
}


//////////////////////////////////
// Exported accessors
module.exports.clients = getClients;
module.exports.status = getStatus;
// module.exports.doesPlayerAlreadyExist = doesPlayerAlreadyExist;
module.exports.playerStats = getPlayerStats;
module.exports.findOpponent = findOpponent;

//////////////////////////////////
// Exported mutators
module.exports.disconnectUser = disconnectUser;
module.exports.addPlayer = addPlayer;
module.exports.setClientStatus = setClientStatus;
module.exports.startBout = startBout;
