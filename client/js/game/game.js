var bout;
var game;
var socket;
var playerId;
var endGameHandlerFunction;

var knockedOutPlayer;
var player1Text;
var player2Text;
var player1Lives;
var player2Lives;
var player1;
var player2;
var sentence;

var sentenceChars;
var startOfRoundMs;

var roundOver;
var roundOverText;
var result;
var countDown;
var oneSecond = 1;
var previousTime;
var gongSound;
var finishGameButton;
var state;

var Game = function(boutInfo, socketInfo, playerInfo, endGameHandler) {
    state = 'COUNT_DOWN';
    bout = boutInfo;
    socket = socketInfo;
    playerId = playerInfo;
    endGameHandlerFunction = endGameHandler;

    game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {
        preload: preload,
        create: create,
        update: update
    });

    $(document).on('keydown', function(e) {
        if (e.keyCode === 8) {
            e.preventDefault();
        }
    });

    return {
        game: game,
        boutInfo: boutInfo
    };
};

function preload() {
    console.log("boutInfo: ", bout);
    // $('body').prepend($('<div>').addClass('mask'));

    game.load.spritesheet('player', 'assets/images/sprites/player-idle.png', 49, 52, 4);
    game.load.spritesheet('player-knockout', 'assets/images/sprites/player-knockout.png', 70, 70, 4);
    game.load.image('player-life', 'assets/images/sprites/life.png', 29, 30);
    game.load.image("background", "assets/images/sprites/game-dojo.jpg", 0, 0, 800, 600);
    game.load.image('scroll', 'assets/images/scrollBackgroundThin.png', 100, 50);

    game.load.audio('gong', 'assets/sounds/asianGongHit.mp3');

    game.stage.disableVisibilityChange = true;
}

function setUpPlayers() {
    if (knockedOutPlayer) {
        knockedOutPlayer.destroy();
    }

    if (player1) {
        player1.destroy();
    }

    if (player2) {
        player2.destroy();
    }

    player1 = game.add.sprite(0, 300, 'player');
    player1.scale.setTo(3, 3);
    player1.animations.add('ready', [0, 1, 2, 3, 2, 1], 3, true);
    player1.animations.play('ready');

    player2 = game.add.sprite(800, 300, 'player');
    player2.scale.setTo(-3, 3);
    player2.animations.add('ready', [0, 1, 2, 3, 2, 1], 3, true);
    player2.animations.play('ready');
}

function setUpKnockedDownPlayer() {
    // This is horrendous
    knockedOutPlayer = (result ? player2 : player1);
    knockedOutPlayer.animations.stop('ready');
    knockedOutPlayer.visible = false;

    if (!result) {
        knockedOutPlayer = game.add.sprite(0, 300, 'player-knockout');
        knockedOutPlayer.scale.setTo(3, 3);
    }
    else {
        knockedOutPlayer = game.add.sprite(800, 300, 'player-knockout');
        knockedOutPlayer.scale.setTo(-3, 3);
    }

    knockedOutPlayer.animations.add('knockout', [0, 1, 2, 3], 6, false);
    knockedOutPlayer.animations.play('knockout');
}

function setUpPlayerLives() {
    var i;

    if (player1Lives) {
        console.log('Player 1 Lives: ', player1Lives);
        player1Lives.forEach(function(life) {
            life.destroy();
        });
    }

    if (player2Lives) {
        console.log('Player 2 Lives: ', player2Lives);

        player2Lives.forEach(function(life) {
            life.destroy();
        });
    }

    player1Lives = [];
    player2Lives = [];

    if (isPlayer1(bout.player1.id)) {
        console.log('i am player 1');
        for (i = 0; i < bout.player1.lives; i++) {
            console.log(i, bout.player1.lives);
            player1Lives.push(game.add.sprite(20 + (40 * i), 50, 'player-life'));
        }
        for (i = 0; i < bout.player2.lives; i++) {
            console.log(i, bout.player2.lives);
            player2Lives.push(game.add.sprite(750 - (40 * i), 50, 'player-life'));
        }
    } else {
        console.log('i am player 2');
        for (i = 0; i < bout.player2.lives; i++) {
            console.log(i, bout.player2.lives);
            player1Lives.push(game.add.sprite(20 + (40 * i), 50, 'player-life'));
        }
        for (i = 0; i < bout.player1.lives; i++) {
            console.log(i, bout.player1.lives);
            player2Lives.push(game.add.sprite(750 - (40 * i), 50, 'player-life'));
        }
    }
}

function isPlayer1(player1Id) {
    console.log('player id: ', playerId, 'player1id: ', player1Id);
    return playerId === player1Id;
}

function create() {
    game.stage.backgroundColor = 0xaaaaaa;
    game.add.tileSprite(0, 0, 800, 600, 'background');

    $('#mask').fadeIn(500);
    $('canvas').addClass('game center-block');

    player1Text = game.add.text(25, 10, bout.player1.name, { fill: '#fff' });
    player2Text = game.add.text(-25, 10, bout.player2.name, { fill: '#fff', align: 'right', boundsAlignH: 'right' });
    player2Text.setTextBounds(0, 0, 800, 600);

    setUpPlayerLives();
    setUpPlayers();

    sentenceChars = bout.sentence.split('');
    startOfRoundMs = Date.now();

    sentence = game.add.text(game.world.centerX, 150, bout.sentence, { fill: '#fff', align: 'center'});
    sentence.anchor.set(0.5);
    sentence.alpha = 0.0;
    //sentence.setTextBounds(0, 0, 800, 600);

    roundOverText = game.add.text(0, 150, '', { fill: '#fff', align: 'center', boundsAlignH: 'center' });
    roundOverText.setTextBounds(0, 0, 800, 600);

    socket.on('roundResult', function(roundResult) {
        console.log(roundResult);

        result = roundResult.didYouWin;
        bout = roundResult.nextBout;
        state = 'ROUND_OVER';

        if (roundResult.nextBout.player1.lives === 0 ||
            roundResult.nextBout.player2.lives === 0) {

                socket.emit('gameOver');

                state = 'GAME_OVER';

                setUpPlayerLives();
                setUpKnockedDownPlayer();

                if (sentence) {
                    sentence.destroy();
                }

                if (isPlayer1(roundResult.nextBout.player1.id)) {
                    if (roundResult.nextBout.player1.lives === 0) {
                        sentence = game.add.text(game.world.centerX, 150, 'GAME OVER!\nYOU LOSE!', { fill: '#fff', align: 'center'});
                        sentence.anchor.set(0.5);
                    } else {
                        sentence = game.add.text(game.world.centerX, 150, 'GAME OVER!\nA WINNER IS YOU!', { fill: '#fff', align: 'center'});
                        sentence.anchor.set(0.5);
                    }
                } else {
                    if (roundResult.nextBout.player2.lives === 0) {
                        sentence = game.add.text(game.world.centerX, 150, 'GAME OVER!\nYOU LOSE!', { fill: '#fff', align: 'center'});
                        sentence.anchor.set(0.5);
                    } else {
                        sentence = game.add.text(game.world.centerX, 150, 'GAME OVER!\nA WINNER IS YOU!', { fill: '#fff', align: 'center'});
                        sentence.anchor.set(0.5);
                    }
                }

                console.log('yay');
                setTimeout(function() {
                    finishGameButton = game.add.button(game.world.centerX, 300, 'scroll', function() {
                        endGameHandlerFunction();
                        cleanup();
                    }, this);
                    finishGameButton.anchor.set(0.5);
                    var text = game.add.text(game.world.centerX, 300, "Find another opponent!", {font: "32px Arial", fill: "#404040"});
                    text.anchor.set(0.5);
                    //finishGameButton.addChild(text);
                },
                3000);
        }
        else {
            console.log('start round timeout...');

            setTimeout(function() {
                console.log('inside start round timeout...');
                setUpPlayerLives();
                setUpPlayers();
                sentenceChars = bout.sentence.split('');
                sentence = game.add.text(game.world.centerX, 150, bout.sentence, { fill: '#fff', align: 'center'});
                sentence.anchor.set(0.5);
                sentence.alpha = 0.0;
                sentence.setTextBounds(0, 0, 800, 600);
                startOfRoundMs = Date.now();
                roundOverText.text = '';
                countDown.text = '3';
                state = 'COUNT_DOWN';
            }, 5000);
        }
    });

    countDown = game.add.text(0, 150, '3', { fill: '#fff', align: 'center', boundsAlignH: 'center' });
    countDown.setTextBounds(0, 0, 800, 600);

    gongSound = game.add.audio('gong');
}

// function finishGameAction() {
//     console.log("Button clicked!");
// }

function update() {
    var countDownInt;
    var deltaTime;

    if (!previousTime) {
        previousTime = game.time.now;
    }

    if (state === 'COUNT_DOWN') {
        countDownInt = parseInt(countDown.text);
        deltaTime = (game.time.now - previousTime) / 1000;
        oneSecond -= deltaTime;

        if (oneSecond < 0) {
            console.log(parseInt(countDown.text));

            if (parseInt(countDown.text) > 1) {
                countDown.text = countDownInt - 1;
            } else {
                countDown.text = '';
                gongSound.play();
                state = 'BOUT_BEGIN';
            }

            oneSecond = 1;
        }
    }

    if (state === 'BOUT_BEGIN') {
        game.input.keyboard.onPressCallback = function(e) {
            var currentCharacter;

            if (e === sentenceChars[0]) {
                currentCharacter = sentence.text.length - sentenceChars.length;
                sentenceChars.shift();
                sentence.addColor('#00ff00', currentCharacter);
                if (sentenceChars.length) {
                    sentence.addColor('#fff', currentCharacter + 1);
                }
            }

            if (e === '!') {
                sentenceChars = "";
            }

            if(!sentenceChars.length) {
                // Add a simple bounce tween to each character's position.
                var tween = game.add.tween(sentence.scale).to( { y: 1.25, x: 1.25 }, 500, Phaser.Easing.Bounce.Out, true);

                socket.emit('roundComplete', {
                    id: bout.id,
                    duration: Date.now() - startOfRoundMs
                });
            }
        };

        sentence.alpha = 1.0;
    }

    if(state === 'ROUND_OVER') {
        game.input.keyboard.onPressCallback = null;
        //roundOver = false;
        roundOverText.text = result === true ? 'Winner!' : 'Boooo! Loser!';
        sentence.text = '';

        setUpKnockedDownPlayer();

        state = 'SOMETHING_ELSE'; // TODO: uhh, probably want to fix this...
    }

    previousTime = game.time.now;
}

function cleanup() {
    bout = null;
    //game = null;
    socket = null;
    playerId = null;
    endGameHandlerFunction = null;
    knockedOutPlayer = null;
    player1Text = null;
    player2Text = null;
    player1Lives = null;
    player2Lives = null;
    player1 = null;
    player2 = null;
    sentence = null;
    sentenceChars = null;
    startOfRoundMs = null;
    roundOver = null;
    roundOverText = null;
    result = null;
    countDown = null;
    oneSecond = null;
    previousTime = null;
    gongSound = null;
    finishGameButton = null;
}

module.exports = Game;
