var Server = function (httpServer, grid) {
  this.httpServer = httpServer;
  this.grid = grid;
};

Server.prototype.start = function (callback) {
  this.grid.fill();
  this.httpServer.listen();
  process.nextTick(callback);
};

Server.prototype.uri = function () {
  return this.httpServer.uri();
};

module.exports = Server;