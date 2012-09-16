var GameServer = require('./GameServer');
var HttpServer = require('./HttpServer');
var Grid = require('./Grid');

var serverFactory = function (options) {
  var grid = new Grid(options.grid);
  var httpServer = new HttpServer(options.port, grid);

  return new GameServer(httpServer, grid, options.dictionary.isWord, []);
};

module.exports = serverFactory;