var connectedClients = {};

// TODO: make this by ID
function addClient(playerName, socket) {
    var client = {
        name: playerName,
        id: socket.id,
        status: 'idle'
    };

    connectedClients[socket.id] = client;

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
    console.log('clients before: ', connectedClients);
    delete connectedClients[socket.id];
    console.log('clients after: ', connectedClients);
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

function getClients() {
    return connectedClients;
}

// Mutating functions
module.exports.add = addClient;
module.exports.remove = removeClient;

// Accessor functions
module.exports.clients = getClients;
module.exports.getById = getClientById;
module.exports.getWaitingClient = getWaitingClient;
module.exports.setStatusById = setClientStatusById;
