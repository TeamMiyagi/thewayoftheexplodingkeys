function generateStatus(clientsMap, boutsMap) {
    return "<html>" +
            "<head>" +
                "<title>TWOTEK Status</title>" +
                '<style>' +
                    'body {background-color:lightgray}' +
                    'span {display: block}' +
                '</style>' +
            "</head>" +
            "<body>" +
                "<h1>TWOTEK Status</h1>" +
                "<div>" +
                    "<h2>Connected players</h2>" +
                    connectedPlayersAsHtml(clientsMap) +
                "</div>" +
                "<div>" +
                    "<h2>Bouts in progress</h2>" +
                    boutsAsHtml(boutsMap) +
                "</div>" +
            "</body>" +
            "</html>";
}

function connectedPlayersAsHtml(clientsMap) {
    var playerHtml = "";

    Object.keys(clientsMap).forEach(function(clientKey) {
        var status = clientsMap[clientKey].status || 'idle';
        var statusText = ' (' + status + ')';
        playerHtml += "<span>" + clientsMap[clientKey].name + statusText + "</span>";
    });

    return playerHtml;
}

function boutsAsHtml(boutsMap) {
    var boutsHtml = "";

    Object.keys(boutsMap).forEach(function(boutKey) {
        bout = boutsMap[boutKey];
        boutsHtml += '<span>' + bout.player1.name + ' versus ' + bout.player2.name + '</span>';
    });

    return boutsHtml;
}

module.exports.generateStatus = generateStatus;
