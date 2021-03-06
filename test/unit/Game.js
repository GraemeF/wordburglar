var Game = require('../../lib/Game');
var events = require('events');
var _ = require('underscore');

describe('Game', function () {
  var game;
  var isWord;
  var grid;
  var scoreboard;
  var playerId = 'player id';
  const line = 'line';

  function unusedLetters(letters) {
    return _.map(letters, function (letter) {
      return {letter: letter, used: false};
    });
  }

  function usedLetters(letters) {
    return _.map(letters, function (letter) {
      return {letter: letter, used: true};
    });
  }

  beforeEach(function () {
    scoreboard = new events.EventEmitter();
    scoreboard.awardPoints = sinon.stub();

    grid = new events.EventEmitter();
    grid.getLetters = sinon.stub();
    grid.markUnusedLettersUsed = sinon.stub();

    isWord = sinon.stub().returns(false);
    game = new Game(grid, scoreboard, isWord);
  });

  describe('and the grid has an unused HELLO', function () {

    beforeEach(function () {
      grid.getLetters.withArgs(line).returns(unusedLetters('HELLO'));
      isWord.withArgs('HELLO').returns(true);
    });

    describe('and a player marks the word', function () {

      beforeEach(function () {
        game.markLine(playerId, line);
      });

      it('should award 8 points', function () {
        scoreboard.awardPoints
          .should.have.been.calledWith(playerId, 8);
      });

      it('should mark the letters as used by the player', function () {
        grid.markUnusedLettersUsed
          .should.have.been.calledWith(line, playerId);
      });
    });
  });

  describe('and the grid has a used HELLO', function () {
    beforeEach(function () {
      grid.getLetters.withArgs(line).returns(usedLetters('HELLO'));
      isWord.withArgs('HELLO').returns(true);
    });

    describe('and a player marks the word', function () {
      beforeEach(function () {
        game.markLine(playerId, line);
      });

      it('should not award any points', function () {
        scoreboard.awardPoints
          .should.not.have.been.called;
      });
    });
  });

  describe('and the grid has unused letters that are not a word', function () {
    beforeEach(function () {
      grid.getLetters.withArgs(line).returns(unusedLetters('ABC'));
      isWord.withArgs('ABC').returns(false);
    });

    describe('and the player marks the line', function () {
      beforeEach(function () {
        game.markLine(playerId, line);
      });

      it('should not award any points', function () {
        scoreboard.awardPoints
          .should.not.have.been.called;
      });

      it('should not mark any letters', function () {
        grid.markUnusedLettersUsed
          .should.not.have.been.called;
      });
    });
  });
});