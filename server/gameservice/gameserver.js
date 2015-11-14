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



//////////////////////////////////
// Exports
//////////////////////////////////
// Accessor
module.exports.clients = getClients();
module.exports.status = getStatus();

// Mutator
module.exports.disconnectUser = disconnectUser();
