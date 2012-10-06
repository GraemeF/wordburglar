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

    players = {
      findByToken: sinon.stub(),
      findById: sinon.stub(),
      addNew: sinon.stub()
    };
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

    describe('and a connected player disconnects', function () {
      var disconnectingPlayerId = 'disconnecting player id';

      beforeEach(function () {
        players.findByToken.returns({id: disconnectingPlayerId});
        httpServer.emit('playerDisconnected', {token: 'token'});
      });

      it('should tell the other players that the player disconnected', function () {
        httpServer.emitToAllPlayers.should.have.been.calledWith('playerDisconnected', disconnectingPlayerId);
      });
    });

    describe('and a known player connects', function () {
      var player;
      var knownPlayerId;

      beforeEach(function () {
        players.findByToken.returns({id: knownPlayerId});
        player = {
          token: 'token 1',
          socket: new events.EventEmitter()
        };
        httpServer.emit('playerConnected', player);
      });

      it('should not announce a new player', function () {
        httpServer.emitToAllPlayers.should.not.have.been.calledWith('playerAdded');
      });

      it('should broadcast that the player connected', function () {
        httpServer.emitToAllPlayers
          .should.have.been.calledWith('playerConnected', knownPlayerId);
      });
    });

    it('should have no players', function () {
      players.addNew.should.not.have.been.called;
    });

    describe('and a letter is used', function () {
      var letterPos = 'letter position';

      beforeEach(function () {
        grid.emit('letterUsed', letterPos);
      });

      it('should tell all players that the letter is used', function () {
        httpServer.emitToAllPlayers
          .should.have.been.calledWith('letterUsed', letterPos);
      });
    });

    describe('and a new player joins', function () {
      var player;
      const id = 'player id';

      beforeEach(function () {
        idFactory.returns(id);
        player = {
          token: 'token 1',
          socket: new events.EventEmitter()
        };
        httpServer.emit('playerConnected', player);
      });

      it('should add a player', function () {
        players.addNew.should.have.been.calledWith(player);
      });

      it('should broadcast that the new player was added', function () {
        httpServer.emitToAllPlayers
          .should.have.been.calledWith('playerAdded', id);
      });

      it('should broadcast that the new player connected', function () {
        httpServer.emitToAllPlayers
          .should.have.been.calledWith('playerConnected', id);
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
            player2 = {
              token: 'token 2',
              socket: new events.EventEmitter()
            };
            player2.socket.on('letterUsed', function (letterPos) {
              usedLetterPos2 = letterPos;
            });
            player2.socket.on('playerConnected', newPlayer);
            httpServer.emit('playerConnected', player2);
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
          player.socket.emit('setName', 'Bob');
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
          beforeEach(function () {
            player.socket.emit('mark', line);
          });

          it('should award a point', function () {
            httpServer.emitToAllPlayers
              .should.have.been.calledWith('score', {id: id, points: 1});
          });

          it('should mark the line as used', function () {
            grid.markUsed.should.have.been.calledWith(line);
          });

          describe('and the grid has another word at a particular line', function () {
            const line = 'line of WORLD';

            beforeEach(function () {
              grid.getLetters.withArgs(line).returns('WORLD');
              isWord.withArgs('WORLD').returns(true);
            });

            describe('and the player marks the other line', function () {
              beforeEach(function () {
                player.socket.emit('mark', line);
              });

              it('should award another point', function () {
                httpServer.emitToAllPlayers
                  .should.have.been.calledWith('score', {id: id, points: 2});
              });
            });
          });
        });
      });

      describe('and the player marks a different line', function () {
        var scoreChange;

        beforeEach(function () {
          player.socket.on('score', function (data) {
            scoreChange = data;
          });

          player.socket.emit('mark', 'some other line');
        });

        it('should not award a point', function () {
          expect(scoreChange).to.not.be.ok;
        });
      });
    });
  });
});