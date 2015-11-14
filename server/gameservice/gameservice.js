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

function addPlayer(playerName, socket_id) {
    playersService.add(playerName);
    clientsService.add(playerName, socket_id);
}

function doesPlayerAlreadyExist(playerName) {
    stubbedFunction('doesPlayerAlreadyExist');
    return false;
}

function getPlayerStats(playerName) {
    stubbedFunction('getPlayerStats');
}

function findOpponent() {
    // TODO...
}

//////////////////////////////////

function stubbedFunction(functionName) {
    console.log('Stubbed function called! (' + functionName + ')');
}

//////////////////////////////////
// Exports
//////////////////////////////////
// Accessor
module.exports.clients = getClients;
module.exports.status = getStatus;
module.exports.doesPlayerAlreadyExist = doesPlayerAlreadyExist;
module.exports.playerStats = getPlayerStats;
module.exports.findOpponent = findOpponent;

// Mutator
module.exports.disconnectUser = disconnectUser;
module.exports.addPlayer = addPlayer;
