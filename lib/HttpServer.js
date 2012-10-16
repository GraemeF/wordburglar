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
var eventStream = require('event-stream');
var emitStream = require('emit-stream');
var JSONStream = require('JSONStream');

var HttpServer = function (port, grid, players) {
    this.port = port;
    this.grid = grid;
    this.players = players;
    this.sockets = [];
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
  _.each(this.sockets, function (s) {
    s.emit(event, data);
  });
};

HttpServer.prototype.listen = function (callback) {
  var self = this;
  this.app = express();
  this.httpServer = http.createServer(this.app);

  var sock = shoe(function (stream) {
    console.log('connection established');
    var eventsToPlayer = new events.EventEmitter();
    var logToPlayer = eventStream.through(function write(data) {
      console.log('sending from server to player:', data);
      this.emit('data', data);
    });

    emitStream(eventsToPlayer).pipe(JSONStream.stringify()).pipe(logToPlayer).pipe(stream);
    self.sockets.push(eventsToPlayer);

    var parser = JSONStream.parse([true]);
    var eventsFromPlayer = emitStream(parser.pipe(stream).pipe(parser));

    eventsFromPlayer.on('identify', function (playerToken) {
      console.log('identify', playerToken);
      self.emit('playerConnected', {
        token: playerToken,
        eventsFromPlayer: eventsFromPlayer,
        eventsToPlayer: eventsToPlayer
      });
    });
    stream.on('disconnect', function (data) {
      self.emit('playerDisconnected', data);
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