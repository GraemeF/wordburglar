var _ = require('underscore');

var Game = function (grid, scoreboard, isWord) {
  this.grid = grid;
  this.scoreboard = scoreboard;
  this.isWord = isWord;
};

Game.prototype.markLine = function (id, line) {
  var letters = this.grid.getLetters(line);
  var word = _
    .map(letters,
         function (letter) {
           return letter.letter;
         })
    .join('');

  if (this.isWord(word)) {
    this.grid.markUsed(line);
    var unusedLetters = _.filter(letters, function (letter) {
      return !letter.used;
    });

    if (unusedLetters.length > 0) {
      this.scoreboard.awardPoints(id, unusedLetters.length);
    }
  }
};

module.exports = Game;