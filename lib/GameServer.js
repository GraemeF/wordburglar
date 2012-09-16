var GameServer = function (httpServer, grid, isWord, players) {
  this.httpServer = httpServer;
  this.grid = grid;
  this.isWord = isWord;
  this.players = players;
};

GameServer.prototype.start = function (callback) {
  var self = this;
  this.grid.fill();

  this.httpServer.listen(function () {
    self.httpServer.on('new player', function (socket) {
      self.addPlayer(socket);

      function markLine(line) {
        if (self.isWord(self.grid.getLetters(line))) {
          self.grid.markUsed(line);
          socket.emit('score', 1);
        }
      }

      socket.on('mark', markLine);

      self.grid.on('letter used', function (letterPos) {
        socket.emit('letter used', letterPos);
      });
    });
    callback();
  });
};

GameServer.prototype.stop = function (callback) {
  this.httpServer.close(callback);
};

GameServer.prototype.addPlayer = function (socket) {
  this.players.push(socket);
};

GameServer.prototype.uri = function () {
  return this.httpServer.uri();
};

module.exports = GameServer;