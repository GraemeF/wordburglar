var Server = function (httpServer, grid) {
  this.httpServer = httpServer;
  this.grid = grid;
};

Server.prototype.start = function (callback) {
  var self = this;
  this.grid.fill();
  this.httpServer.listen(function () {
    self.httpServer.on('new player', self.addPlayer);
    callback();
  });
};

Server.prototype.addPlayer = function (socket) {
};

Server.prototype.uri = function () {
  return this.httpServer.uri();
};

module.exports = Server;