$(document).ready(function() {
    $.getJSON('/ip', function(data) {
        run(data.ip);
    });
});

var Game = require('./game.js');
var boutId;

var socket;
var playerId;

function run(ip) {
    socket = io('http://' + ip +':3000');

    $('#game').hide();
    $('#startGameDiv').hide();
    $('#findingMatch').hide();

    $('#createPlayerInput').focus();
    $('#createPlayerButton').on('click', startGame);
    $('#createPlayerInput').keydown(function(e) {
        if (e.keyCode === 13) {
            startGame();
        }
    });

    $('#startGameButton').on('click', function(e) {
        console.log("Game Started");
        socket.emit('findMatch');

        $('#startGameDiv').hide();
        $('#findingMatch').show();
    });

    socket.on('loginEvent', function(loginEvent) {
        console.log(loginEvent);
        playerId = loginEvent.player.id;
    });

    socket.on('connected', function(playerId) {

    });

    socket.on('boutStarted', function(boutStartedEvent) {
        console.log(boutStartedEvent);
        boutId = boutStartedEvent.id;

        $('header').fadeOut();
        $('#findingMatch').fadeOut(400, function() {
            $('#game').fadeIn();
        });

        console.log('boutStarted listener is called');
        var game = new Game(boutStartedEvent, socket, playerId, endGameHandler);
    });
}

function startGame() {
    var playerName = $('#welcomeDiv input').val();
    socket.emit('new-player', playerName);

    $('#welcomeDiv').hide();    // TODO: use class

    $('#playerName').text(playerName);
    $('#startGameDiv').show();
}

function endGameHandler() {
    $('#game').empty().hide();
    $('#mask').fadeOut(500);
    $('header').show();

    socket.emit('endGame');

    startGame();
}
