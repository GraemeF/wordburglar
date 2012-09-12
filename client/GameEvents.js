define(['underscore',
        'socket.io',
        'backbone'
       ], function (_, io, backbone) {

  var GameEvents = function () {
    _.extend(this, backbone.Events);
  };

  GameEvents.prototype.connect = function () {
    var self = this;
    this.socket = io.connect();

    this.socket.on('score', function (data) {
      self.trigger('score', data);
    });
  };

  GameEvents.prototype.mark = function () {
    this.socket.emit('mark', {});
  };

  return GameEvents;
});
