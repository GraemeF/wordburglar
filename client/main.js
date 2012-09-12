require(['GameEvents', 'jquery'], function (GameEvents, $) {
  var server = new GameEvents();

  server.connect();
  server.on('score', function (data) {
    $('#score').text(data);
  });

  $('td').click(function () {
    server.mark();
  });
});