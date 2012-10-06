define(['underscore',
        'socket.io',
        'backbone'
       ], function (_, io, backbone) {

  function monitorConnectionState(socket, emitter) {
    socket.on('connect', function () {
      emitter.trigger('connection', 'connected');
    });

    socket.on('connecting', function (transport_name) {
      emitter.trigger('connection', 'connecting with ' + transport_name);
    });

    socket.on('connect_failed', function () {
      emitter.trigger('connection', 'connection failed');
    });

    socket.on('close', function () {
      emitter.trigger('connection', 'closed');
    });

    socket.on('disconnect', function () {
      emitter.trigger('connection', 'disconnected');
    });

    socket.on('reconnect', function (transport_type, reconnectionAttempts) {
      emitter.trigger('connection', 'reconnected with ' + transport_type + ' after ' + reconnectionAttempts + ' attempts');
    });

    socket.on('reconnecting', function (reconnectionDelay, reconnectionAttempts) {
      emitter.trigger('connection', 'reconnecting (' + reconnectionAttempts + ' attempts)');
    });

    socket.on('reconnect_failed', function () {
      emitter.trigger('connection', 'reconnect failed');
    });
  }

  var ServerProxy = function () {
    _.extend(this, backbone.Events);
  };

  ServerProxy.prototype.connect = function () {
    var self = this;
    this.socket = io.connect("?playerToken=" + playerToken, {
      reconnect: false,
      "sync disconnect on unload": true
    });
    monitorConnectionState(this.socket, self);

    this.socket.on('score', function (data) {
      self.trigger('score', data);
    });

    this.socket.on('letterUsed', function (data) {
      self.trigger('letterUsed', data);
    });

    this.socket.on('nameChanged', function (data) {
      self.trigger('nameChanged', data);
    });

    this.socket.on('playerConnected', function (data) {
      self.trigger('addPlayer', data);
    });

    this.socket.on('playerDisconnected', function (data) {
      self.trigger('removePlayer', data);
    });
  };

  ServerProxy.prototype.disconnect = function () {
    this.socket.socket.disconnectSync();
  };

  ServerProxy.prototype.markLine = function (line) {
    this.socket.emit('mark', line);
  };

  ServerProxy.prototype.setPlayerName = function (newName) {
    this.socket.emit('setName', newName);
  };

  return ServerProxy;
});
