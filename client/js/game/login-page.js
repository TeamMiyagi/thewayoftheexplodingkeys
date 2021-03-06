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

    socket.on('loginEvent', function(response) {
        console.log('loginEvent');
        handleLogin(response);
    });

    socket.on('connected', function(playerId) {
        console.log('connected');
    });

    socket.on('boutStarted', function(boutStartedEvent) {
        console.log('boutStarted');
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
    console.log('startGame called');
    var playerName = $('#welcomeDiv input').val();
    socket.emit('new-player', playerName);
}

function handleLogin(response) {
    console.log('handleLogin. response = ' + JSON.stringify(response));
    if (response.success) {
        playerId = response.player.id;
        $('#welcomeDiv').hide();
        $('#playerName').text(response.player.name);
        $('#startGameDiv').show();
    }
    else {
        alert('That name is already in use, please choose another');
    }
}


function endGameHandler() {
    $('#game').empty().hide();
    $('#mask').fadeOut(500);
    $('header').show();

    socket.emit('endGame');

    startGame();
}
