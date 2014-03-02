var ServerProxy = require('./ServerProxy');
var UI = require('./UI');
var Game = require('./Game');
var domready = require('domready');

domready(function () {
  var serverProxy = new ServerProxy();
  var game = new Game(serverProxy, new UI());
  game.start();
  serverProxy.connect();

  /*global window: true*/
  window.disconnect = function () {
    serverProxy.disconnect();
  };
});