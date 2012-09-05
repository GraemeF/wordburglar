var Server = require('./Server');
var HttpServer = require('./HttpServer');

var serverFactory = function () {
  return new Server(new HttpServer());
};

module.exports = serverFactory;