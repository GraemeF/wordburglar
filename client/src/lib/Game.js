define(function () {
  var Game = function (serverProxy, ui) {
    this.serverProxy = serverProxy;
    this.ui = ui;
  };

  Game.prototype.start = function () {
    var self = this;

    this.serverProxy.on('score', function (newScore) {
      self.ui.setScore(newScore);
    });

    this.serverProxy.on('connection', function (newStatus) {
      self.ui.setConnectionStatus(newStatus);
    });
  };

  return Game;
});