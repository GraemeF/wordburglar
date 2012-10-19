var TestGameServer = require('./helpers/TestGameServer');

describe.skip('Player identity', function () {
  var server;

  beforeEach(function (done) {
    server = new TestGameServer();
    server.start(done);
  });

  afterEach(function (done) {
    server.stop(done);
  });

  describe('when a player joins for the first time', function () {
    var player;

    beforeEach(function (done) {
      player = server.createPlayer();
      player.join(done);
    });

    afterEach(function (done) {
      player.leave(done);
    });

    describe('sets their name to Bob', function () {
      beforeEach(function (done) {
        player.setPlayerName('Bob', done);
      });

      it('should show player named Bob', function (done) {
        soon(function () {
          player.getPlayerNames().should.contain('Bob');
        }, this, done);
      });

      describe('leaves', function () {

        beforeEach(function (done) {
          player.leave(done);
        });

        describe('and rejoins the game', function () {
          beforeEach(function (done) {
            player.join(done);
          });

          it('should show one player', function (done) {
            soon(function () {
              player.getNumberOfPlayers().should.equal(1);
            }, this, done);
          });

          it('should show player named Bob', function (done) {
            soon(function () {
              player.getPlayerNames().should.contain('Bob');
            }, this, done);
          });
        });
      });

      it('should show my score is 0', function () {
        player.getScore().should.equal(0);
      });
    });

    it('should show my score is 0', function () {
      player.getScore().should.equal(0);
    });
  });
});
