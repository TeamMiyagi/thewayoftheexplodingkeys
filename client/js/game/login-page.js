$(document).ready(function() {
    var socket = io();

    $('#game').hide();
    $('#startGameDiv').hide();
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
    });

    socket.on('loginEvent', function(loginEvent) {
        console.log(loginEvent);
    });

    socket.on('boutStarted', function(boutStartedEvent) {
        console.log(boutStartedEvent);
    });

});
