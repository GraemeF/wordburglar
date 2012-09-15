require(['ServerProxy', 'jquery'], function (ServerProxy, $) {
  var server = new ServerProxy();
  var myScore = 0;

  server.on('score', function (data) {
    myScore += data;
    $('#score').text(myScore);
  });

  server.on('connection', function (data) {
    $('#connection').text(data);
  });

  $('button').click(function () {
    server.mark({start: {x: 0, y: 0}, end: {x: 0, y: 0}});
  });

  window.disconnect = function () {
    server.disconnect();
  };

  server.connect();
});