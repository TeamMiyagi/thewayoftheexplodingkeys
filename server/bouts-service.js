var bouts = {};

function createBout(player1, player2, sentence) {
    var id = createBoutId();
    var bout = {
        id: id,
        player1: player1,
        player2: player2,
        sentence: sentence
    };

    bouts[id] = bout;
    console.log(bouts);
    return bout;
}

function createBoutId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

module.exports.create = createBout;
