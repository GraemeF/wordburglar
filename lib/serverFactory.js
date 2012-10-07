var GameServer = require('./GameServer');
var HttpServer = require('./HttpServer');
var Grid = require('./Grid');
var PlayerRepo = require('./PlayerRepo');
var Scoreboard = require('./Scoreboard');
var Game = require('./Game');

var serverFactory = function (options) {
  var grid = new Grid(options.grid);
  var httpServer = new HttpServer(options.port, grid);
  var players = new PlayerRepo();
  var scoreboard = new Scoreboard();
  var game = new Game(grid, scoreboard, options.dictionary.isWord);
  var nextId = 1;

  return new GameServer(httpServer,
                        grid,
                        players,
                        scoreboard,
                        game,
                        function () {
                          return nextId++;
                        });
};

module.exports = serverFactory;