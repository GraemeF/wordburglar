var Game = function (serverProxy, ui) {
    this.serverProxy = serverProxy;
    this.ui = ui;
  };

Game.prototype.start = function () {
  var self = this;

  this.serverProxy.on('score', function (scoreChange) {
    self.ui.setScore(scoreChange);
  });

  this.serverProxy.on('addPlayer', function (id) {
    self.ui.addPlayer(id);
  });

  this.serverProxy.on('removePlayer', function (id) {
    self.ui.removePlayer(id);
  });

  this.serverProxy.on('nameChanged', function (newName) {
    self.ui.setPlayerName(newName);
  });

  this.serverProxy.on('connection', function (newStatus) {
    self.ui.setConnectionStatus(newStatus);
  });

  this.serverProxy.on('letterUsed', function (letterPos) {
    self.ui.setLetterUsed(letterPos);
  });

  this.ui.on('mark', function (line) {
    self.serverProxy.markLine(line);
  });

  this.ui.on('setName', function (newName) {
    self.serverProxy.setPlayerName(newName);
  });
};

module.exports = Game;