var util = require("util");
var events = require("events");
var express = require('express');
var http = require('http');
var url = require('url');
var path = require('path');
var socketio = require('socket.io');

var HttpServer = function (port, grid) {
  this.port = port;
  this.grid = grid;
  events.EventEmitter.call(this);
};

util.inherits(HttpServer, events.EventEmitter);

HttpServer.prototype.uri = function () {
  return url.format({ protocol: 'http',
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
  this.httpServer.listen(this.port, function () {
    callback();
  });

  this.app.set('views', path.resolve(__dirname, '../views'));
  this.app.set('view engine', 'jade');
  this.app.use(express['static'](path.resolve(__dirname, '../public')));
  this.app.use(express['static'](path.resolve(__dirname, '../client/src/lib')));

  this.app.get('/', function (req, res) {
    res.render('index', {title: 'Word Burglar', grid: self.grid});
  });

  this.io.sockets.on('connection', function (socket) {
    self.emit('new player', socket);
  });
};

HttpServer.prototype.close = function (callback) {
  this.httpServer.close(callback);
};

module.exports = HttpServer;