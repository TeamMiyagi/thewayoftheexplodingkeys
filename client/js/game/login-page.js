$(document).ready(function() {
    var socket;
    $('#game').hide();
    $('#startGameDiv').hide();
    $('#createPlayerButton').on('click', function(e) {
        var playerName = $('#welcomeDiv input').val();
        socket = io();
        socket.emit('new-player', playerName);

        $('#welcomeDiv').hide();    // TODO: use class

        $('#playerName').text(playerName);
        $('#startGameDiv').show();
    });

    $('#startGameButton').on('click', function(e) {
        console.log("Game Started");
    });
});
