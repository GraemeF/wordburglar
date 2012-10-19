var util = require("util");
var events = require("events");
var express = require('express');
var http = require('http');
var url = require('url');
var path = require('path');
var uuid = require('node-uuid');
var util = require('util');
var shoe = require('shoe');
var _ = require('underscore');
var through = require('through');
var emitStream = require('emit-stream');
var JSONStream = require('JSONStream');

var HttpServer = function (port, grid, players) {
    this.port = port;
    this.grid = grid;
    this.players = players;
    this.sockets = {};
    events.EventEmitter.call(this);
  };

util.inherits(HttpServer, events.EventEmitter);

HttpServer.prototype.uri = function () {
  return url.format({
    protocol: 'http',
    hostname: 'localhost',
    port: this.httpServer.address().port
  });
};

HttpServer.prototype.emitToAllPlayers = function (event, data) {
  console.log('sending to ' + _.keys(this.sockets).length + ' players:', event);
  _.each(_.values(this.sockets), function (s) {
    s.emit(event, data);
  });
};

function createEmitterForSendingEventsToPlayer(stream) {
  var emitter = new events.EventEmitter();
  var logToPlayer = through(function write(data) {
    console.log('sending to player:', data);
    this.emit('data', data);
  });

  emitStream.toStream(emitter).pipe(JSONStream.stringify()).pipe(logToPlayer).pipe(stream);
  return emitter;
}

function createEmitterForReceivingEventsFromPlayer(stream) {
  var parser = JSONStream.parse([true]);
  return emitStream.fromStream(stream.pipe(parser));
}

HttpServer.prototype.listen = function (callback) {
  var self = this;
  this.app = express();
  this.httpServer = http.createServer(this.app);

  var sock = shoe(function (stream) {
    console.log('connection established');

    var eventsToPlayer = createEmitterForSendingEventsToPlayer(stream);

    var eventsFromPlayer = createEmitterForReceivingEventsFromPlayer(stream);

    eventsFromPlayer.on('identify', function (playerToken) {
      self.sockets[playerToken] = eventsToPlayer;

      stream.on('close', function () {
        console.log('player disconnected:', playerToken);
        delete self.sockets[playerToken];
        self.emit('playerDisconnected', playerToken);
      });

      self.emit('playerConnected', {
        token: playerToken,
        eventsFromPlayer: eventsFromPlayer,
        eventsToPlayer: eventsToPlayer
      });
    });
  });

  sock.on('log', function (severity, msg) {
    console.log(severity, msg);
  });

  sock.install(this.httpServer.listen(this.port, function () {
    callback();
  }), '/live');

  this.app.set('views', path.resolve(__dirname, '../views'));
  this.app.set('view engine', 'jade');
  this.app.use(express.cookieParser());
  this.app.use(express['static'](path.resolve(__dirname, '../public')));
  this.app.use(express['static'](path.resolve(__dirname, '../client/src/lib')));

  this.app.get('/', function (req, res) {
    var playerToken = req.cookies.playerToken;
    if(typeof (playerToken) === 'undefined') {
      playerToken = uuid.v4();
    }

    res.cookie('playerToken', playerToken);
    res.render('index', {
      title: 'Word Burglar',
      grid: self.grid,
      googleAnalytics: process.env.NODE_ENV === 'production',
      playerToken: playerToken
    });
  });
};

HttpServer.prototype.close = function (callback) {
  this.httpServer.close(callback);
};

module.exports = HttpServer;