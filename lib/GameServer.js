var _ = require('underscore');

var GameServer = function (httpServer, grid, isWord, players, idFactory) {
  this.httpServer = httpServer;
  this.grid = grid;
  this.isWord = isWord;
  this.players = players;
  this.idFactory = idFactory;
  this.eventStore = [];
};

GameServer.prototype.start = function (callback) {
  var self = this;
  this.grid.fill();

  function replayEvents(playerSocket) {
    _.each(self.eventStore, function (e) {
      playerSocket.emit(e.event, e.data);
    });
  }

  this.httpServer.listen(function () {
    self.httpServer.on('newPlayer', function (playerSocket) {
      replayEvents(playerSocket);

      self.addPlayer(playerSocket);

      function markLine(line) {
        if (self.isWord(self.grid.getLetters(line))) {
          self.grid.markUsed(line);
          playerSocket.emit('score', 1);
        }
      }

      playerSocket.on('mark', markLine);

      var id = self.idFactory();
      playerSocket.on('setName', function (newName) {
        self.emitToAllPlayers('nameChanged', {id: id, name: newName});
      });

      self.emitToAllPlayers('newPlayer', id);
    });

    self.grid.on('letterUsed', function (letterPos) {
      self.emitToAllPlayers('letterUsed', letterPos);
    });
    callback();
  });
};

GameServer.prototype.emitToAllPlayers = function (event, data) {
  this.eventStore.push({event: event, data: data});
  this.httpServer.emitToAllPlayers(event, data);
};

GameServer.prototype.stop = function (callback) {
  this.httpServer.close(callback);
};

GameServer.prototype.addPlayer = function (playerSocket) {
  this.players.push(playerSocket);
};

GameServer.prototype.uri = function () {
  return this.httpServer.uri();
};

module.exports = GameServer;