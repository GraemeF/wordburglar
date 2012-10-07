var Game = function (grid, scoreboard, isWord) {
  this.grid = grid;
  this.scoreboard = scoreboard;
  this.isWord = isWord;
};

Game.prototype.markLine = function (id, line) {
  if (this.isWord(this.grid.getLetters(line))) {
    this.grid.markUsed(line);
    this.scoreboard.awardPoints(id, 1);
  }
};

module.exports = Game;