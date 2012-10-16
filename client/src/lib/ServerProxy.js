var util = require("util");
var events = require("events");
var _ = require('underscore');
var shoe = require('shoe');
var emitStream = require('emit-stream');
var eventStream = require('event-stream');
var JSONStream = require('JSONStream');

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

  this.socket = shoe('/live', function () { /*global playerToken: true*/
    console.log('identifying with token', playerToken);
    self.eventsToServer = new events.EventEmitter();

    var logToServer = eventStream.through(function write(data) {
      console.log('sending to server:', data);
      this.emit('data', data);
    });
    emitStream(self.eventsToServer).pipe(JSONStream.stringify()).pipe(logToServer).pipe(self.socket);

    self.eventsToServer.emit('identify', playerToken);

    var parser = JSONStream.parse([true]);
    var logToPlayer = eventStream.through(function write(data) {
      console.log('receiving from server:', data);
      this.emit('data', data);
    });

    var parsedStream = parser.pipe(self.socket.pipe(logToPlayer)).pipe(parser);
    self.eventsFromServer = emitStream(parsedStream);

    self.eventsFromServer.on('score', function (data) {
      self.emit('score', data);
    });

    self.eventsFromServer.on('letterUsed', function (data) {
      self.emit('letterUsed', data);
    });

    self.eventsFromServer.on('nameChanged', function (data) {
      self.emit('nameChanged', data);
    });

    self.eventsFromServer.on('playerConnected', function (data) {
      self.emit('addPlayer', data);
    });

    self.eventsFromServer.on('playerDisconnected', function (data) {
      self.emit('removePlayer', data);
    });
  });
  this.socket.on('log', function (severity, message) {
    console.log(severity, message);
  });
  monitorConnectionState(this.socket, self);
};

ServerProxy.prototype.sendToServer = function (event, data) {
  this.eventsToServer.emit(event, data);
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