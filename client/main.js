require(['server', 'jquery'], function (Server, $) {
  var server = new Server();

  server.connect();
  server.on('score', function (data) {
    $('#score').text(data);
  });

  $('td').click(function () {
    server.mark();
  });
});