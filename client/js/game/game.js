var bout;
var game;

var player1Text;
var player2Text;
var player1;

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
    game.load.spritesheet('player', 'assets/images/sprites/player.png', 48, 64, 4);
}

function create() {
    game.stage.backgroundColor = 0xaaaaaa;
    $('canvas').addClass('center-block');

    player1Text = game.add.text(0, 0, bout.player1.name, {});
    player2Text = game.add.text(0, 0, bout.player2.name, { align: 'right', boundsAlignH: 'right' });
    player2Text.setTextBounds(0, 0, 800, 600);

    player1 = game.add.sprite(0, 300, 'player');
    player1.scale.setTo(4, 4);
    player1.animations.add('ready', [0, 1, 2, 3, 2, 1], 3, true);
    player1.animations.play('ready');
}

function update() {
}

module.exports = Game;
