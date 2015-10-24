$(document).ready(function() {
    $('#game').hide();
    $('#startGameDiv').hide();
    $('#createPlayerButton').on('click', function(e) {
        $('#welcomeDiv').hide();    // TODO: use class

        $('#playerName').text($('#welcomeDiv input').val());
        $('#startGameDiv').show();
    });

    $('#startGameButton').on('click', function(e) {
        console.log("Game Started");
    });
});
