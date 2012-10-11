var _ = require('underscore');

const letterValues = {
  A: 1,
  B: 3,
  C: 3,
  D: 2,
  E: 1,
  F: 4,
  G: 2,
  H: 4,
  I: 1,
  J: 8,
  K: 5,
  L: 1,
  M: 3,
  N: 1,
  O: 1,
  P: 3,
  Q: 10,
  R: 1,
  S: 1,
  T: 1,
  U: 1,
  V: 4,
  W: 4,
  X: 8,
  Y: 4,
  Z: 10
};

var Game = function (grid, scoreboard, isWord) {
  this.grid = grid;
  this.scoreboard = scoreboard;
  this.isWord = isWord;
};

Game.prototype.markLine = function (playerId, line) {
  var self = this;
  var letters = this.grid.getLetters(line);
  var word = _
    .map(letters,
         function (letter) {
           return letter.letter;
         })
    .join('');

  if (this.isWord(word)) {
    var unusedLetters = _.filter(letters, function (letter) {
      return !letter.used;
    });

    self.grid.markUnusedLettersUsed(line, playerId);

    var score = _.reduce(unusedLetters,
                         function (total, l) {
                           return total + letterValues[l.letter];
                         }, 0);

    if (score > 0) {
      this.scoreboard.awardPoints(playerId, score);
    }
  }
};

module.exports = Game;