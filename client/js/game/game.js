var bout;
var game;

var player1Text;
var player2Text;

var Game = function(boutInfo) {
    bout = boutInfo;

    game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {
        preload: preload,
        create: create,
        update: update
    });

    return {
        game: game,
        boutInfo: boutInfo
    };
};

function preload() {
    console.log("boutInfo: ", bout);
}

function create() {
    game.stage.backgroundColor = 0xaaaaaa;
    $('canvas').addClass('center-block');

    player1Text = game.add.text(0, 0, bout.player1Id, {});
    player2Text = game.add.text(500, 0, bout.player2Id, { align: 'right' });
}

function update() {
}

module.exports = Game;
