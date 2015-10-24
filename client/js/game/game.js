var bout;
var game;
var socket;

var player1Text;
var player2Text;
var player1;
var player2;
var sentence;

var sentenceChars;



var Game = function(boutInfo, socketInfo) {
    bout = boutInfo;
    socket = socketInfo;

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
    $('body').prepend($('<div>').addClass('mask'));
    game.load.spritesheet('player', 'assets/images/sprites/player-idle.png', 49, 52, 4);
    game.load.image("background", "assets/images/sprites/game-dojo.jpg", 0, 0, 800, 600);
}

function create() {
    game.stage.backgroundColor = 0xaaaaaa;
    game.add.tileSprite(0, 0, 800, 600, 'background');
    
    $('.mask').fadeIn(500);
    $('canvas').addClass('game center-block');

    player1Text = game.add.text(0, 0, bout.player1.name, { fill: '#fff' });
    player2Text = game.add.text(0, 0, bout.player2.name, { fill: '#fff', align: 'right', boundsAlignH: 'right' });
    player2Text.setTextBounds(0, 0, 800, 600);

    player1 = game.add.sprite(0, 300, 'player');
    player1.scale.setTo(3, 3);
    player1.animations.add('ready', [0, 1, 2, 3, 2, 1], 3, true);
    player1.animations.play('ready');

    player2 = game.add.sprite(800, 300, 'player');
    player2.scale.setTo(-3, 3);
    player2.animations.add('ready', [0, 1, 2, 3, 2, 1], 3, true);
    player2.animations.play('ready');

    sentenceChars = bout.sentence.split('');

    sentence = game.add.text(0, 150, bout.sentence, { fill: '#fff', align: 'center', boundsAlignH: 'center' });
    sentence.setTextBounds(0, 0, 800, 600);
}

function update() {
    game.input.keyboard.onPressCallback = function(e) {
        if (e === sentenceChars[0]) {
            sentenceChars.shift();
        }
        if (e === '!') {
            sentenceChars = "";
        }

        if(!sentenceChars.length) {
            socket.emit('roundComplete', {
                id: bout.id,
                duration: Math.random() * 1000
            });
        }
    };
}

module.exports = Game;
