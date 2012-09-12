var GameServer = require('./GameServer');
var HttpServer = require('./HttpServer');
var Grid = require('./Grid');

var serverFactory = function (options) {
  var grid = new Grid(options.grid);
  return new GameServer(new HttpServer(options.port, grid), grid, []);
};

module.exports = serverFactory;