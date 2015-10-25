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
    console.log('updateBout: ' + roundCompleteMsg);

    var bout = bouts[roundCompleteMsg.id];
    if (!bout) {
        console.log('Failed to find bout to update');
        return;
    }

    updateDurations(socketId, bout, roundCompleteMsg.duration);

    updateLives(bout);

    console.log('Updated bout: ' + JSON.stringify(bout));
}

function resetDurations(bout) {
    bout.player1Duration = null;
    bout.player2Duration = null;
}

function updateDurations(playerId, bout, duration) {
    if (bout.player1.id === playerId) {
        bout.player1Duration = duration;
        console.log('player1 duration set');
    }
    else if (bout.player2.id === playerId) {
        bout.player2Duration = duration;
        console.log('player2 duration set');
    }
}

function updateLives(bout) {
    var roundStatus = getRoundStatus(bout.id);
    if (roundStatus.isComplete) {
        if (roundStatus.player1Won) {
            bout.player2.lives -= 1;
        } else {
            bout.player1.lives -= 1;
        }
    }
}

function getRoundStatus(boutId) {
    var bout = bouts[boutId];
    var completed = (bout.player1Duration && bout.player2Duration);
    return {
        isComplete: completed,
        player1Won: bout.player1Duration < bout.player2Duration,
        player2Won: bout.player1Duration >= bout.player2Duration
    };
}

function getBout(boutId) {
    return bouts[boutId];
}

module.exports.create = createBout;
module.exports.update = updateBout;
module.exports.get = getBout;
module.exports.getRoundStatus = getRoundStatus;
module.exports.resetDurations = resetDurations;
