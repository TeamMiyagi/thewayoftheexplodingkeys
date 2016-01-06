var _ = require('lodash');
var service = require('../../gameservice');
var sentenceService = require('../../sentenceservice');
var clients = require('../../gameservice/clients');

describe('The Game Service', function() {
    var onAddPlayerError = function() {};
    var onAddPlayerSuccess = function() {};

    describe('on initialisation', function() {
        it('starts with no clients', function() {
            var clientKeys = _.keys(service.clients());
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
            var clientKeys = _.keys(service.clients());
            expect(clientKeys.length).toBe(1);
        });
    });

    describe('with one player already connected', function() {

        beforeEach(function() {
            service.addPlayer('p1', 1, onAddPlayerSuccess, onAddPlayerError);
        });

        it('player can try to find an opponent', function() {
            expect(service.findOpponent()).toBe(null);
        });

        it('player can disconnect and there will be no connected clients', function() {
            service.disconnectUser(1);

            var clientKeys = _.keys(service.clients());
            expect(clientKeys.length).toBe(0);
        });

        it ('cannot add another player with the same name', function() {
            service.addPlayer('p1', 2, onAddPlayerSuccess, onAddPlayerError);

            var clientKeys = _.keys(service.clients());
            expect(clientKeys.length).toBe(1);
        });
    });

    describe('with two players already connected', function() {

        beforeEach(function () {
            service.addPlayer('p1', 1, onAddPlayerSuccess, onAddPlayerError);
            service.addPlayer('p2', 2, onAddPlayerSuccess, onAddPlayerError);
        });

        it('both players are known and idle', function() {
            expect(service.clients()['1'].status).toBe('idle');
            expect(service.clients()['2'].status).toBe('idle');
        });

        it('players can start a bout', function() {
          var sentence = 'sentence';
          spyOn(sentenceService, 'get').and.returnValue(sentence);
          spyOn(clients, 'getById').and.callFake(function(id) {
            if (id === 1) {
              return {
                  name: 'Player 1',
                  id: 1,
                  status: 'fighting'
              }
            } else if (id === 2) {
              return {
                  name: 'Player 2',
                  id: 2,
                  status: 'fighting'
              }
            }
          });
          var bout = service.startBout(1, 2);

          expect(service.clients()['1'].status).toBe('fighting');
          expect(service.clients()['2'].status).toBe('fighting');
          expect(bout).toEqual(jasmine.objectContaining({
            player1: {
              name: 'Player 1',
              id: 1,
              status: 'fighting',
              lives: 3
            },
            player2: {
              name: 'Player 2',
              id: 2,
              status: 'fighting',
              lives: 3
            },
            sentence: sentence
          }));
        });

        xit('player1 is quicker than player2 then player2 lose life', function() {

        });

        xit('bout ended if player 1 disconnects', function() {
        });

    });
});
