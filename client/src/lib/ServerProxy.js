var util = require("util");
var events = require("events");
var _ = require('underscore');
var shoe = require('shoe');
var es = require('event-stream');

function monitorConnectionState(socket, emitter) {
  socket.on('connect', function () {
    emitter.emit('connection', 'connected');
  });

  socket.on('connecting', function (transport_name) {
    emitter.emit('connection', 'connecting with ' + transport_name);
  });

  socket.on('connect_failed', function () {
    emitter.emit('connection', 'connection failed');
  });

  socket.on('close', function () {
    emitter.emit('connection', 'closed');
  });

  socket.on('end', function () {
    emitter.emit('connection', 'disconnected');
  });

  socket.on('reconnect', function (transport_type, reconnectionAttempts) {
    emitter.emit('connection', 'reconnected with ' + transport_type + ' after ' + reconnectionAttempts + ' attempts');
  });

  socket.on('reconnecting', function (reconnectionDelay, reconnectionAttempts) {
    emitter.emit('connection', 'reconnecting (' + reconnectionAttempts + ' attempts)');
  });

  socket.on('reconnect_failed', function () {
    emitter.emit('connection', 'reconnect failed');
  });
}

var ServerProxy = function () {
    events.EventEmitter.call(this);
  };

util.inherits(ServerProxy, events.EventEmitter);

ServerProxy.prototype.connect = function () {
  var self = this;

  this.socket = shoe('/live');
  monitorConnectionState(this.socket, self);

  this.socket.on('connect', function () {
    self.socket.pipe(es.split()).pipe(es.parse()).on('data', function (obj) {
      console.log('client received', obj);
      self.emit(obj.event, obj.data);
    });

    /*global playerToken: true*/
    console.log('identifying with token', playerToken);
    self.sendToServer('identify', playerToken);
  });

  this.socket.on('score', function (data) {
    self.emit('score', data);
  });

  this.socket.on('letterUsed', function (data) {
    self.emit('letterUsed', data);
  });

  this.socket.on('nameChanged', function (data) {
    self.emit('nameChanged', data);
  });

  this.socket.on('playerConnected', function (data) {
    self.emit('addPlayer', data);
  });

  this.socket.on('playerDisconnected', function (data) {
    self.emit('removePlayer', data);
  });
};

function stringify(msg) {
  return JSON.stringify(msg) + '\n';
}

ServerProxy.prototype.sendToServer = function (event, data) {
  this.socket.write(stringify({
    event: event,
    data: data
  }));
};

ServerProxy.prototype.disconnect = function () {
  console.log('getting rid of the socket');
  this.socket.end();
};

ServerProxy.prototype.markLine = function (line) {
  this.sendToServer('mark', line);
};

ServerProxy.prototype.setPlayerName = function (newName) {
  this.sendToServer('setName', newName);
};

module.exports = ServerProxy;