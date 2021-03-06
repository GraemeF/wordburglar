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

        describe('and player 1 scores points', function () {
          beforeEach(function (done) {
            player1.mark({start: {x: 5, y: 0}, end: {x: 3, y: 0}}, done);
          });

          it('should show player 1 that they have scored points', function (done) {
            soon(function () {
              player1.getPlayerScore('Bob').should.be.greaterThan(0);
            }, this, done);
          });

          it('should show player 2 that player 1 has scored points', function (done) {
            soon(function () {
              player2.getPlayerScore('Bob').should.be.greaterThan(0);
            }, this, done);
          });

          describe('and player 1 disconnects', function () {
            beforeEach(function (done) {
              player1.leave(done);
            });

            describe('and reconnects', function () {
              beforeEach(function (done) {
                player1.join(done);
              });

              it('should show player1 has points', function (done) {
                soon(function () {
                  player1.getPlayerScore('Bob').should.be.greaterThan(0);
                }, this, done);
              });

              describe('and player 1 scores again', function () {
                var player1Score;

                beforeEach(function (done) {
                  player1Score = player1.getPlayerScore('Bob');
                  player1.mark({start: {x: 5, y: 0}, end: {x: 3, y: 0}}, done);
                });

                it('should show player1 has more points', function (done) {
                  soon(function () {
                    player1.getPlayerScore('Bob').should.be.greaterThan(player1Score);
                  }, this, done);
                });
              });
            });
          });
        });
      });
    });
  });
});