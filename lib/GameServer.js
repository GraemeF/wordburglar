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
    self.httpServer.on('playerConnected', function (newPlayer) {
      if (self.players.findByToken(newPlayer.token)) {
        return;
      }

      var id = self.idFactory();
      var score = 0;

      replayEvents(newPlayer.socket);
      self.addPlayer(newPlayer);

      function markLine(line) {
        if (self.isWord(self.grid.getLetters(line))) {
          self.grid.markUsed(line);
          self.emitToAllPlayers('score', {id: id, points: ++score});
        }
      }

      newPlayer.socket.on('mark', markLine);

      newPlayer.socket.on('setName', function (newName) {
        self.emitToAllPlayers('nameChanged', {id: id, name: newName});
      });

      self.emitToAllPlayers('playerConnected', id);
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
  this.players.addNew(playerSocket);
};

GameServer.prototype.uri = function () {
  return this.httpServer.uri();
};

module.exports = GameServer;