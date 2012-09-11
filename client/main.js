require(['socket.io'], function (io) {
  var socket = io.connect();
  socket.on('news', function (data) {
    socket.emit('my other event', { my: 'data' });
  });
});