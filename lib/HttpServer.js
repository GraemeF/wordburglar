var express = require('express');
var http = require('http');
var url = require('url');

var HttpServer = function (port) {
  this.port = port;
};

HttpServer.prototype.uri = function () {
  return url.format({
                      protocol: 'http',
                      hostname: 'localhost',
                      port: this.httpServer.address().port
                    });
};

HttpServer.prototype.listen = function (callback) {
  this.app = express();
  this.httpServer = http.createServer(this.app);
  this.httpServer.listen(this.port, callback);
};

module.exports = HttpServer;