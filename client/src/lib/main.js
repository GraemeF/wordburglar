require(['ServerProxy', 'UI', 'Game'
        ], function (ServerProxy, UI, Game) {
  var serverProxy = new ServerProxy();
  var game = new Game(serverProxy, new UI());
  game.start();
  serverProxy.connect();

  $('button').click(function () {
    server.mark({start: {x: 0, y: 0}, end: {x: 0, y: 0}});
  });

  window.disconnect = function () {
    serverProxy.disconnect();
  };
});