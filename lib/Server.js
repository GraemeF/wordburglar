var Server = function (httpServer) {
  this.httpServer = httpServer;
};

Server.prototype.start = function (callback) {
  this.httpServer.listen();
  process.nextTick(callback);
};

Server.prototype.uri = function () {
  return this.httpServer.uri();
};

module.exports = Server;