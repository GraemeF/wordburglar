require(['ServerProxy', 'UI', 'Game'
        ], function (ServerProxy, UI, Game) {
  var serverProxy = new ServerProxy();
  var game = new Game(serverProxy, new UI());
  game.start();
  serverProxy.connect();

  window.disconnect = function () {
    serverProxy.disconnect();
  };
});