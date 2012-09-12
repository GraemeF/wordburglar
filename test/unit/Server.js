var GameServer = require('../../lib/GameServer');
var events = require('events');

describe('GameServer', function () {
  var server;
  var httpServer;
  var grid;
  var players;

  beforeEach(function () {
    httpServer = new events.EventEmitter();
    httpServer.listen = sinon.stub().callsArg(0);

    players = [];
    grid = {fill: sinon.stub()};
    server = new GameServer(httpServer, grid, players);
  });

  describe('when started', function () {
    beforeEach(function (done) {
      server.start(done);
    });

    it('should listen', function () {
      httpServer.listen.should.have.been.called;
    });

    it('should fill the grid', function () {
      grid.fill.should.have.been.called;
    });

    describe('and a new player joins', function () {
      var player;

      beforeEach(function () {
        player = new events.EventEmitter();
        httpServer.emit('new player', player);
      });

      it('should add a player', function () {
        players.should.contain(player);
      });

      describe('and the player marks a word', function () {
        var scoreChange;

        beforeEach(function () {
          player.on('score', function (data) {
            scoreChange = data;
          });

          player.emit('mark', {});
        });

        it('should award a point', function () {
          scoreChange.should.equal(1);
        });
      });
    });
  });
});