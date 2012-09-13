require(['GameEvents', 'jquery'], function (GameEvents, $) {
  var server = new GameEvents();

  server.on('score', function (data) {
    $('#score').text(data);
  });

  server.on('connection', function (data) {
    $('#connection').text(data);
  });

  $('td').click(function () {
    server.mark();
  });

  window.disconnect = function () {
    server.disconnect();
  };

  server.connect();
});