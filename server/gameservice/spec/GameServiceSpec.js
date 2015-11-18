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
    });
});
