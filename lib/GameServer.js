var _ = require('underscore');

var GameServer = function (httpServer, grid, isWord, players, scoreboard, idFactory) {
  this.httpServer = httpServer;
  this.grid = grid;
  this.isWord = isWord;
  this.players = players;
  this.scoreboard = scoreboard;
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
    self.httpServer.on('playerDisconnected', function (token) {
      var id = self.players.findByToken(token).id;
      self.emitToAllPlayers('playerDisconnected', id);
    });

    self.httpServer.on('playerConnected', function (connectedPlayer) {
      function playerIsNew() {
        return !self.players.findByToken(connectedPlayer.token);
      }

      function addNewPlayer() {
        connectedPlayer.id = self.idFactory();
        connectedPlayer.score = 0;

        self.players.addNew(connectedPlayer);

        self.emitToAllPlayers('playerAdded', connectedPlayer.id);
        return connectedPlayer.id;
      }

      var id;
      if (playerIsNew()) {
        id = addNewPlayer();
      }
      else {
        id = self.players.findByToken(connectedPlayer.token).id;
      }

      replayEvents(connectedPlayer.socket);

      function markLine(line) {
        if (self.isWord(self.grid.getLetters(line))) {
          self.grid.markUsed(line);
          self.scoreboard.awardPoints(id, 1);
        }
      }

      connectedPlayer.socket.on('mark', markLine);

      connectedPlayer.socket.on('setName', function (newName) {
        self.emitToAllPlayers('nameChanged', {id: id, name: newName});
      });

      self.emitToAllPlayers('playerConnected', id);
    });

    self.grid.on('letterUsed', function (letterPos) {
      self.emitToAllPlayers('letterUsed', letterPos);
    });

    self.scoreboard.on('scoreChanged', function (data) {
      self.emitToAllPlayers('score', data);
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

GameServer.prototype.uri = function () {
  return this.httpServer.uri();
};

module.exports = GameServer;