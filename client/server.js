define(['underscore',
        'socket.io',
        'backbone'
       ], function (_, io, backbone) {

  var Server = function () {
    _.extend(this, backbone.Events);
  };

  Server.prototype.connect = function () {
    var self = this;
    this.socket = io.connect();

    this.socket.on('score', function (data) {
      self.trigger('score', data);
    });
  };

  Server.prototype.mark = function () {
    this.socket.emit('mark', {});
  };

  return Server;
});
