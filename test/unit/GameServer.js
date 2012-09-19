var GameServer = require('../../lib/GameServer');
var events = require('events');

describe('GameServer', function () {
  var server;
  var httpServer;
  var grid;
  var players;
  var isWord;
  var idFactory;

  beforeEach(function () {
    idFactory = sinon.stub();

    httpServer = new events.EventEmitter();
    httpServer.listen = sinon.stub().callsArg(0);
    httpServer.emitToAllPlayers = sinon.stub();

    players = [];
    grid = new events.EventEmitter();
    grid.fill = sinon.stub();
    grid.getLetters = sinon.stub();
    grid.markUsed = sinon.stub();

    isWord = sinon.stub().returns(false);

    server = new GameServer(httpServer, grid, isWord, players, idFactory);
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

    it('should have no players', function () {
      players.should.be.empty;
    });

    describe('and a new player joins', function () {
      var player;
      const id = 'player id';

      beforeEach(function () {
        idFactory.returns(id);
        player = new events.EventEmitter();
        httpServer.emit('newPlayer', player);
      });

      it('should add a player', function () {
        players.should.contain(player);
      });

      it('should broadcast the new player', function () {
        httpServer.emitToAllPlayers
          .should.have.been.calledWith('newPlayer', id);
      });

      describe('and a letter in the grid is used', function () {
        beforeEach(function () {
          grid.emit('letterUsed',
                    'position of used letter');
        });

        it('should tell the player', function () {
          httpServer.emitToAllPlayers
            .should.have.been.calledWith('letterUsed',
                                         'position of used letter');
        });

        describe('and a second player joins', function () {
          var player2;
          var usedLetterPos2;
          var newPlayer = sinon.stub();

          beforeEach(function () {
            player2 = new events.EventEmitter();
            player2.on('letterUsed', function (letterPos) {
              usedLetterPos2 = letterPos;
            });
            player2.on('newPlayer', newPlayer);
            httpServer.emit('newPlayer', player2);
          });

          it('should tell the player that the letter is used', function () {
            usedLetterPos2.should.equal('position of used letter');
          });

          it('should tell the player that the first player is playing', function () {
            newPlayer.should.have.been.calledTwice;
          });
        });
      });

      describe('and the player sets their name', function () {
        beforeEach(function () {
          player.emit('setName', 'Bob');
        });

        it('should tell the player', function () {
          httpServer.emitToAllPlayers
            .should.have.been.calledWith('nameChanged',
                                         {id: id, name: "Bob"});
        });
      });

      describe('and the grid has a word at a particular line', function () {
        const line = 'line of HELLO';

        beforeEach(function () {
          grid.getLetters.withArgs(line).returns('HELLO');
          isWord.withArgs('HELLO').returns(true);
        });

        describe('and the player marks the line', function () {
          var scoreChange;
          var lettersUsed;

          beforeEach(function () {
            player.on('score', function (data) {
              scoreChange = data;
            });

            lettersUsed = [];
            player.on('letterUsed', function (data) {
              lettersUsed.push(data);
            });

            player.emit('mark', line);
          });

          it('should award a point', function () {
            scoreChange.should.equal(1);
          });

          it('should mark the line as used', function () {
            grid.markUsed.should.have.been.calledWith(line);
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