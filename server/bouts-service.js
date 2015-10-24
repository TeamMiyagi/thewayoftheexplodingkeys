var bouts = {};

function createBout(player1, player2, sentence) {
    var id = createBoutId();
    var bout = {
        id: id,
        player1: initPlayer(player1),
        player2: initPlayer(player2),
        sentence: sentence
    };

    bouts[id] = bout;
    console.log(bouts);
    return bout;
}

function initPlayer(player) {
    player.lives = 3;
    return player;
}

function createBoutId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

function updateBout(socketId, roundCompleteMsg) {
    var bout = bouts[roundCompleteMsg.id];
    if (!bout) {
        console.log("Failed to find bout to update");
        return;
    }

    console.log("Updating bout: " + bout);

    // which player?
    if (bout.player1.id === socketId) {
        bout.player1Duration = roundComplete.duration;
        console.log("player1 duration set")
    }
    else if (bout.player1.id === socketId) {
        bout.player1Duration = roundComplete.duration;
        console.log("player2 duration set")
    }
    else {
        console.log("Ouch, no idea who just completed a bout");
    }
}

module.exports.create = createBout;
module.exports.updateBout = updateBout;
