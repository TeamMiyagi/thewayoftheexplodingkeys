$(document).ready(function() {
    $.getJSON('/ip', function(data) {
        run(data.ip);
    });
});

var Game = require('./game.js');

var socket;

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
    });

    socket.on('boutStarted', function(boutStartedEvent) {
        console.log(boutStartedEvent);

        $('header').hide();
        $('#findingMatch').hide();
        $('#game').show();
        var game = new Game(boutStartedEvent);
    });
}

function startGame() {
    var playerName = $('#welcomeDiv input').val();
    socket.emit('new-player', playerName);

    $('#welcomeDiv').hide();    // TODO: use class

    $('#playerName').text(playerName);
    $('#startGameDiv').show();
}
