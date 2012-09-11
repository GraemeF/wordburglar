var Server = function (httpServer, grid, players) {
  this.httpServer = httpServer;
  this.grid = grid;
  this.players = players;
};

Server.prototype.start = function (callback) {
  var self = this;
  this.grid.fill();
  this.httpServer.listen(function () {
    self.httpServer.on('new player', function (socket) {
      self.addPlayer(socket);
    });
    callback();
  });
};

Server.prototype.addPlayer = function (socket) {
  this.players.push(socket);
};

Server.prototype.uri = function () {
  return this.httpServer.uri();
};

module.exports = Server;