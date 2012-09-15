require(['GameEvents', 'jquery'], function (GameEvents, $) {
  var server = new GameEvents();
  var myScore = 0;

  server.on('score', function (data) {
    myScore += data;
    $('#score').text(myScore);
  });

  server.on('connection', function (data) {
    $('#connection').text(data);
  });

  $('button').click(function () {
    server.mark();
  });

  window.disconnect = function () {
    server.disconnect();
  };

  server.connect();
});