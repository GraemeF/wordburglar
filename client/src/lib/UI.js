define(['jquery',
        'underscore',
        'backbone'
       ], function ($, _, backbone) {

  var UI = function () {
    var self = this;
    _.extend(this, backbone.Events);

    $('button').click(function (event) {
      var $start = $('button.startOfLine');
      if ($start.length > 0) {
        self.trigger('mark', {start: {x: 0, y: 0}, end: {x: 0, y: 0}});
        $start.removeClass('startOfLine');
      }
      else {
        $(event.target).closest('button').addClass('startOfLine');
      }
    });
  };

  UI.prototype.setScore = function (myScore) {
    $('#score').text(myScore);
  };

  UI.prototype.setConnectionStatus = function (newStatus) {
    $('#connection').text(newStatus);
  };

  return UI;
});
