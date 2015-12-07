describe('The Game Service', function() {
    var service = require('../../gameservice');

    describe('on initialisation', function() {
        it('starts with no clients', function() {
            var clientKeys = Object.keys(service.clients());
            expect(clientKeys.length).toBe(0);
        });

        it('has no waiting opponents', function() {
            expect(service.findOpponent()).toBe(null);
        });

        it('can have a player connect', function() {
            var numOfPlayersConnected = 0;
            var onAddPlayerSuccess = function() {
                numOfPlayersConnected++;
            };

            service.addPlayer('p1', 1, onAddPlayerSuccess, function() {});

            expect(numOfPlayersConnected).toBe(1);
            var clientKeys = Object.keys(service.clients());
            expect(clientKeys.length).toBe(1);
        });
    });

    describe('with one player already connected', function() {
        var numOfPlayersConnected = 0;
        var onAddPlayerSuccess = function() {
            numOfPlayersConnected++;
        };
        var onAddPlayerError = function() {};

        beforeEach(function() {
            service.addPlayer('p1', 1, onAddPlayerSuccess, function() {});
        });

        it('player can try to find an opponent', function() {
            expect(service.findOpponent()).toBe(null);
        });

        it('player can disconnect and there will be no connected clients', function() {
            service.disconnectUser(1);

            var clientKeys = Object.keys(service.clients());
            expect(clientKeys.length).toBe(0);
        });

        it ('cannot add another player with the same name', function() {
            service.addPlayer('p1', 2, onAddPlayerSuccess, onAddPlayerError);

            var clientKeys = Object.keys(service.clients());
            expect(clientKeys.length).toBe(1);
        });
    });

    describe('with two players already connected', function() {
        xit('both players are known and idle', function() {
        });

        xit('players can start a bout', function() {
        });

        xit('bout ended if player 1 disconnects', function() {
        });
    });
});
