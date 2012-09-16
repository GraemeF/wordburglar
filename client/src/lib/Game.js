define(function () {
  var Game = function (serverProxy, ui) {
    this.serverProxy = serverProxy;
    this.ui = ui;
  };

  Game.prototype.start = function () {
    var self = this;
    var score = 0;

    this.serverProxy.on('score', function (scoreChange) {
      score += scoreChange;
      self.ui.setScore(score);
    });

    this.serverProxy.on('connection', function (newStatus) {
      self.ui.setConnectionStatus(newStatus);
    });

    this.serverProxy.on('letter used', function (letterPos) {
      self.ui.setLetterUsed(letterPos);
    });

    this.ui.on('mark', function (line) {
      self.serverProxy.markLine(line);
    });
  };

  return Game;
});