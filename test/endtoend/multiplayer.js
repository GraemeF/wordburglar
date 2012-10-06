var TestGameServer = require('./helpers/TestGameServer');

describe('Multiplayer', function () {
  var server;

  beforeEach(function (done) {
    server = new TestGameServer();
    server.start(done);
  });

  afterEach(function (done) {
    server.stop(done);
  });

  describe('when a player joins', function () {
    var player1;

    beforeEach(function (done) {
      player1 = server.createPlayer();
      player1.join(done);
    });

    afterEach(function (done) {
      player1.leave(done);
    });

    it('player 1 should see 1 player', function (done) {
      soon(function () {
        player1.getNumberOfPlayers().should.equal(1);
      }, this, done);
    });

    describe('and submits "Bob" as their name', function () {
      beforeEach(function (done) {
        player1.setPlayerName('Bob', done);
      });

      it('should show "Bob" has 0 points', function (done) {
        soon(function () {
          player1.getPlayerScore('Bob').should.equal(0);
        }, this, done);
      });

      describe('and another player joins', function () {
        var player2;

        beforeEach(function (done) {
          player2 = server.createPlayer();
          player2.join(done);
        });

        afterEach(function (done) {
          player2.leave(done);
        });

        it('player 1 should show 2 players', function (done) {
          soon(function () {
            player1.getNumberOfPlayers().should.equal(2);
          }, this, done);
        });

        it('player 2 should show 2 players', function (done) {
          soon(function () {
            player2.getNumberOfPlayers().should.equal(2);
          }, this, done);
        });

        it('should show "Bob" as the other player name', function (done) {
          soon(function () {
            player2.getPlayerNames().should.contain('Bob');
          }, this, done);
        });

        describe('and player 1 scores a point', function () {
          beforeEach(function (done) {
            player1.mark({start: {x: 5, y: 0}, end: {x: 3, y: 0}}, done);
          });

          it('should show player 1 that they have scored a point', function (done) {
            soon(function () {
              player1.getPlayerScore('Bob').should.equal(1);
            }, this, done);
          });

          it('should show player 2 that player 1 has scored a point', function (done) {
            soon(function () {
              player2.getPlayerScore('Bob').should.equal(1);
            }, this, done);
          });
        })
      });
    });
  });
});