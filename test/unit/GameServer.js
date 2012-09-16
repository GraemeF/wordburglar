var GameServer = require('../../lib/GameServer');
var events = require('events');

describe('GameServer', function () {
  var server;
  var httpServer;
  var grid;
  var players;
  var isWord;

  beforeEach(function () {
    httpServer = new events.EventEmitter();
    httpServer.listen = sinon.stub().callsArg(0);

    players = [];
    grid = {
      fill: sinon.stub(),
      getLetters: sinon.stub()
    };
    isWord = sinon.stub().returns(false);

    server = new GameServer(httpServer, grid, isWord, players);
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

      describe('and the grid has a word at a particular line', function () {
        const line = 'line of HELLO';

        beforeEach(function () {
          grid.getLetters.withArgs(line).returns('HELLO');
          isWord.withArgs('HELLO').returns(true);
        });

        describe('and the player marks the line', function () {
          var scoreChange;

          beforeEach(function () {
            player.on('score', function (data) {
              scoreChange = data;
            });

            player.emit('mark', line);
          });

          it('should award a point', function () {
            scoreChange.should.equal(1);
          });
        });
      });

      describe('and the player marks a different line', function () {
        var scoreChange;

        beforeEach(function () {
          player.on('score', function (data) {
            scoreChange = data;
          });

          player.emit('mark', 'some other line');
        });

        it('should not award a point', function () {
          expect(scoreChange).to.not.be.ok;
        });
      });
    });
  });
});