var _ = require('underscore');

var GameServer = function (httpServer, grid, players, scoreboard, game, idFactory) {
    this.httpServer = httpServer;
    this.grid = grid;
    this.players = players;
    this.scoreboard = scoreboard;
    this.game = game;
    this.idFactory = idFactory;
    this.eventStore = [];
  };

GameServer.prototype.start = function (callback) {
  var self = this;

  this.grid.fill();

  function replayEvents(eventsToPlayer) {
    _.each(self.eventStore, function (e) {
      eventsToPlayer.emit(e.event, e.data);
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
      if(playerIsNew()) {
        id = addNewPlayer();
      } else {
        id = self.players.findByToken(connectedPlayer.token).id;
      }

      replayEvents(connectedPlayer.eventsToPlayer);

      function markLine(line) {
        self.game.markLine(id, line);
      }

      connectedPlayer.eventsFromPlayer.on('mark', markLine);

      connectedPlayer.eventsFromPlayer.on('setName', function (newName) {
        self.emitToAllPlayers('nameChanged', {
          id: id,
          name: newName
        });
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
  this.eventStore.push({
    event: event,
    data: data
  });
  this.httpServer.emitToAllPlayers(event, data);
};

GameServer.prototype.stop = function (callback) {
  this.httpServer.close(callback);
};

GameServer.prototype.uri = function () {
  return this.httpServer.uri();
};

module.exports = GameServer;