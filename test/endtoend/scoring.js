var TestGameServer = require('./helpers/TestGameServer');

describe('Scoring', function () {
  var player1;
  var server;

  beforeEach(function (done) {
    server = new TestGameServer();
    server.start(function (err) {
      if (err) {
        return done(err);
      }
      player1 = server.createPlayer();
      player1.join(function (err) {
        if (err) {
          return done(err);
        }
        player1.setPlayerName('Player 1', done);
      });
    });
  });

  afterEach(function (done) {
    player1.leave(function (err) {
      if (err) {
        return done(err);
      }
      server.stop(done);
    });
  });

  describe('for a 3 letter word', function () {

    beforeEach(function (done) {
      player1.mark({start: {x: 5, y: 0}, end: {x: 3, y: 0}}, done);
    });

    it('should score 3 points', function (done) {
      soon(function () {
        player1.getPlayerScore('Player 1').should.equal(3);
      }, this, done);
    });
  });
});