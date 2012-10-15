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
var es = require('event-stream');

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

  function send(socket, message) {
    socket.write(JSON.stringify(message) + '\n');
  }

  _.each(this.sockets, function (s) {
    send(s, {
      event: event,
      data: data
    });
  });
};

HttpServer.prototype.listen = function (callback) {
  var self = this;
  this.app = express();
  this.httpServer = http.createServer(this.app);

  var sock = shoe(function (stream) {
  });

  sock.on('log', function (severity, msg) {
    console.log(severity, msg);
  });

  sock.install(this.httpServer.listen(this.port, function () {
    callback();
  }), '/live');

  sock.on('connection', function (socket) {
    console.log('connection established');
    var playerEvents = new events.EventEmitter();

    self.sockets.push(socket);
    var parsedStream = socket.pipe(es.split()).pipe(es.parse());

    parsedStream.on('data', function (message) {
      if(message.event === 'identify') {
        self.emit('playerConnected', {
          token: message.data,
          socket: playerEvents
        });
        socket.on('disconnect', function () {
          self.emit('playerDisconnected', message.data);
        });
      } else {
        playerEvents.emit(message.event, message.data);
      }
    });
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
};

HttpServer.prototype.close = function (callback) {
  this.httpServer.close(callback);
};

module.exports = HttpServer;