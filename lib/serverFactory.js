var GameServer = require('./GameServer');
var HttpServer = require('./HttpServer');
var Grid = require('./Grid');
var PlayerRepo = require('./PlayerRepo');

var serverFactory = function (options) {
  var grid = new Grid(options.grid);
  var httpServer = new HttpServer(options.port, grid);
  var players = new PlayerRepo();
  var nextId = 1;

  return new GameServer(httpServer,
                        grid,
                        options.dictionary.isWord,
                        players,
                        function () {
                          return nextId++;
                        });
};

module.exports = serverFactory;