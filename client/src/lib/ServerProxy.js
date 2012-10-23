var util = require("util");
var events = require("events");
var _ = require('underscore');
var shoe = require('shoe');
var emitStream = require('emit-stream');
var through = require('through');
var JSONStream = require('JSONStream');

var ServerProxy = function () {
    events.EventEmitter.call(this);
  };

util.inherits(ServerProxy, events.EventEmitter);

function createEmitterToSendToStream(stream) {
  var logToServer = through(function writeToStream(data) {
    this.emit('data', data);
  });
  var emitter = new events.EventEmitter();
  emitStream.toStream(emitter).pipe(JSONStream.stringify()).pipe(logToServer).pipe(stream);
  return emitter;
}

function createEmitterToReceiveFromStream(stream) {
  var logToPlayer = through(function writeFromStream(data) {
    this.emit('data', data);
  });

  var parser = JSONStream.parse([true]);
  var parsedStream = stream.pipe(logToPlayer).pipe(parser);
  return emitStream.fromStream(parsedStream);
}

ServerProxy.prototype.connect = function () {
  var self = this;

  this.socket = shoe('/live');

  self.eventsToServer = createEmitterToSendToStream(this.socket);
  self.eventsFromServer = createEmitterToReceiveFromStream(this.socket);

  /*global playerToken: true*/
  self.eventsToServer.emit('identify', playerToken);

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
    self.emit('playerConnected', data);
    self.emit('connection', 'connected');
  });

  self.eventsFromServer.on('playerDisconnected', function (data) {
    self.emit('playerDisconnected', data);
  });

  self.eventsFromServer.on('playerAdded', function (data) {
    self.emit('playerAdded', data);
  });

  self.eventsFromServer.on('playerRemoved', function (data) {
    self.emit('playerRemoved', data);
  });

  this.socket.on('log', function (severity, message) {
    //console.log(severity, message);
  });

  this.socket.on('close', function () {
    self.emit('connection', 'disconnected');
  });
};

ServerProxy.prototype.sendToServer = function (event, data) {
  this.eventsToServer.emit(event, data);
};

ServerProxy.prototype.disconnect = function () {
  this.socket.destroy();
};

ServerProxy.prototype.markLine = function (line) {
  this.sendToServer('mark', line);
};

ServerProxy.prototype.setPlayerName = function (newName) {
  this.sendToServer('setName', newName);
};

module.exports = ServerProxy;