var util = require("util");
var events = require("events");
var express = require('express');
var http = require('http');
var url = require('url');
var path = require('path');
var socketio = require('socket.io');
var uuid = require('node-uuid');
var util = require('util');

var HttpServer = function (port, grid, players) {
    this.port = port;
    this.grid = grid;
    this.players = players;
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
  this.io.sockets.emit(event, data);
};

HttpServer.prototype.listen = function (callback) {
  var self = this;
  this.app = express();
  this.httpServer = http.createServer(this.app);
  this.io = socketio.listen(this.httpServer, {
    logger: {
      info: self.emit.bind(self, 'info'),
      error: self.emit.bind(self, 'error'),
      warn: self.emit.bind(self, 'error'),
      debug: function () {}
    }
  });
  this.io.set('log level', 1);
  this.io.configure(function () {
    self.io.set('authorization', function (handshakeData, callback) {
      handshakeData.playerToken = handshakeData.query.playerToken;
      callback(null, true); // error first callback style
    });
  });
  this.httpServer.listen(this.port, function () {
    callback();
  });

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

  this.io.sockets.on('connection', function (socket) {
    var playerToken = socket.handshake.playerToken;
    self.emit('playerConnected', {
      token: playerToken,
      socket: socket
    });
    socket.on('disconnect', function () {
      self.emit('playerDisconnected', playerToken);
    });
  });
};

HttpServer.prototype.close = function (callback) {
  this.httpServer.close(callback);
};

module.exports = HttpServer;