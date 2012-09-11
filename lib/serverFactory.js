var Server = require('./Server');
var HttpServer = require('./HttpServer');
var Grid = require('./Grid');

var serverFactory = function (options) {
  var grid = new Grid(options.grid);
  return new Server(new HttpServer(options.port, grid), grid, []);
};

module.exports = serverFactory;