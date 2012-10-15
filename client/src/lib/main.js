var ServerProxy = require('./ServerProxy');
var UI = require('./UI');
var Game = require('./Game');
var shoe = require('shoe');
var domready = require('domready');
var es = require('event-stream');

domready(function () {
  var serverProxy = new ServerProxy();
  var game = new Game(serverProxy, new UI());
  game.start();
  serverProxy.connect();

  window.disconnect = function () {
    serverProxy.disconnect();
  };
});