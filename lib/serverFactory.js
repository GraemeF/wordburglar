var GameServer = require('./GameServer');
var HttpServer = require('./HttpServer');
var Grid = require('./Grid');

var serverFactory = function (options) {
  var grid = new Grid(options.grid);
  var httpServer = new HttpServer(options.port, grid);
  var nextId = 1;

  return new GameServer(httpServer,
                        grid,
                        options.dictionary.isWord,
                        [],
                        function () {
                          return nextId++;
                        });
};

module.exports = serverFactory;