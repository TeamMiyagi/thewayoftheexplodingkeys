var connectedClients = {};
var clientConnectionsLog = [];

// TODO: make this by ID
function addClient(playerName, socket) {
    var client = {
        name: playerName,
        id: socket.id
    };

    connectedClients[socket.id] = client;
    // clientConnectionsLog.append('new player: ' + playerName + '. Total now ' + Object.keys(connectedClients).length);

    console.log(connectedClients);
}

function getWaitingClient() {
    var opponent;
    Object.keys(connectedClients).forEach(function(clientId) {
        var client = connectedClients[clientId];
        if (client.status === "findingMatch") {
            opponent = client;
        }
    });

    return opponent;
}

// TODO: make this by id
function removeClient(socket) {
    delete connectedClients[socket.id];
    console.log(connectedClients);
}

function getClientById(id) {
    return connectedClients[id];
}

function setClientStatusById(id, status) {
    var client = connectedClients[id];
    if (client) {
        client.status = status;
    }

    console.log(connectedClients);
}

function getLog() {
    return clientConnectionsLog;
}

// Mutating functions
module.exports.add = addClient;
module.exports.remove = removeClient;

// Accessor functions
module.exports.clients = connectedClients;
module.exports.getById = getClientById;
module.exports.getWaitingClient = getWaitingClient;
module.exports.setStatusById = setClientStatusById;
module.exports.log = getLog();
