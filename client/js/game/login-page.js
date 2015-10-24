$(document).ready(function() {
    $.getJSON('/ip', function(data) {
        run(data.ip);
    });
});

var Game = require('./game.js');

function run(ip) {
    var socket = io('http://' + ip +':3000');

    $('#game').hide();
    $('#startGameDiv').hide();
    $('#findingMatch').hide();

    $('#createPlayerButton').on('click', function(e) {
        var playerName = $('#welcomeDiv input').val();
        socket.emit('new-player', playerName);

        $('#welcomeDiv').hide();    // TODO: use class

        $('#playerName').text(playerName);
        $('#startGameDiv').show();
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

        $('#findingMatch').hide();
        $('#game').show();
        var game = new Game(boutStartedEvent);
    });
}
