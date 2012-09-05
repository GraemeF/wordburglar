var Server = function (httpServer) {
  this.httpServer = httpServer;
};

Server.prototype.start = function (callback) {
  this.httpServer.listen();
  process.nextTick(callback);
};

module.exports = Server;