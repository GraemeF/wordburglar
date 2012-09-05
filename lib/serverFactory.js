var Server = require('./Server');
var HttpServer = require('./HttpServer');

var serverFactory = function (options) {
  return new Server(new HttpServer(options.port));
};

module.exports = serverFactory;