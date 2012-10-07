var Game = require('../../lib/Game');
var events = require('events');

describe('Game', function () {
  var game;
  var isWord;
  var grid;
  var scoreboard;

  beforeEach(function () {
    scoreboard = new events.EventEmitter();
    scoreboard.awardPoints = sinon.stub();

    grid = new events.EventEmitter();
    grid.getLetters = sinon.stub();
    grid.markUsed = sinon.stub();

    isWord = sinon.stub().returns(false);
    game = new Game(grid, scoreboard, isWord);
  });

  describe('and the grid has a word at a particular line', function () {
    const line = 'line of HELLO';

    beforeEach(function () {
      grid.getLetters.withArgs(line).returns('HELLO');
      isWord.withArgs('HELLO').returns(true);
    });

    describe('and a player marks the line', function () {
      var playerId = 'player id';

      beforeEach(function () {
        game.markLine(playerId, line);
      });

      it('should award a point', function () {
        scoreboard.awardPoints
          .should.have.been.calledWith(playerId, 5);
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
            game.markLine(playerId, line);
          });

          it('should award another point', function () {
            scoreboard.awardPoints
              .should.have.been.calledTwice;
          });
        });
      });
    });
  });
});