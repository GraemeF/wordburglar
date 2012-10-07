var Game = function (grid, scoreboard, isWord) {
  this.grid = grid;
  this.scoreboard = scoreboard;
  this.isWord = isWord;
};

Game.prototype.markLine = function (id, line) {
  var letters = this.grid.getLetters(line);
  if (this.isWord(letters)) {
    this.grid.markUsed(line);
    this.scoreboard.awardPoints(id, letters.length);
  }
};

module.exports = Game;