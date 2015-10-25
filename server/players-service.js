var players = {};

// If player already exists then does nothing
function addPlayer(playerName) {
    if (players[playerName]) {
        return;
    }

    players[playerName] = {
        name: playerName,
        gamesWon: 0,
        gamesLost: 0
    };
}

function updateForWin(playerName) {
    var player = players[playerName];
    if (!player) {
        console.log('ERROR: attempt to update player data for unknown player:' + playerName);
        return;
    }

    player.gamesWon = player.gamesWon + 1;
}

function updateForLoss(playerName) {
    var player = players[playerName];
    if (!player) {
        console.log('ERROR: attempt to update player data for unknown player:' + playerName);
        return;
    }

    player.gamesLost = player.gamesLost + 1;
}

function getStats(playerName) {
    var player = players[playerName];
    if (!player) {
        console.log('ERROR: attempt to get player data for unknown player:' + playerName);
        return;
    }

    return {
        gamesWon: player.gamesWon,
        gamesLost: player.gamesLost
    };
}

module.exports.add = addPlayer; // If player already exists then does nothing
module.exports.updateForWin = updateForWin;
module.exports.updateForLoss = updateForWin;
module.exports.stats = getStats;
