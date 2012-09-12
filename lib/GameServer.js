var GameServer = function (httpServer, grid, players) {
  this.httpServer = httpServer;
  this.grid = grid;
  this.players = players;
};

GameServer.prototype.start = function (callback) {
  var self = this;
  this.grid.fill();
  this.httpServer.listen(function () {
    self.httpServer.on('new player', function (socket) {
      self.addPlayer(socket);
      socket.on('mark', function () {
        socket.emit('score', 1);
      });
    });
    callback();
  });
};

GameServer.prototype.addPlayer = function (socket) {
  this.players.push(socket);
};

GameServer.prototype.uri = function () {
  return this.httpServer.uri();
};

module.exports = GameServer;