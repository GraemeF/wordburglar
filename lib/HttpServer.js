var express = require('express');
var http = require('http');
var url = require('url');
var path = require('path');

var HttpServer = function (port, grid) {
  this.port = port;
  this.grid = grid;
};

HttpServer.prototype.uri = function () {
  return url.format({ protocol: 'http',
                      hostname: 'localhost',
                      port: this.httpServer.address().port
                    });
};

HttpServer.prototype.listen = function (callback) {
  var self = this;
  this.app = express();
  this.httpServer = http.createServer(this.app);
  this.httpServer.listen(this.port, callback);

  this.app.set('views', path.resolve(__dirname, '../views'));
  this.app.set('view engine', 'jade');
  this.app.use(express['static'](path.resolve(__dirname, '../public')));
  this.app.use(express['static'](path.resolve(__dirname, '../client')));

  this.app.get('/', function (req, res) {
    res.render('index', {title: 'Word Burglar', grid: self.grid});
  });
};

module.exports = HttpServer;