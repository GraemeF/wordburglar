define(['jquery',
        'underscore',
        'backbone'
       ], function ($, _, backbone) {

  function getCoords(element) {
    return {
      x: element.closest('td').index(),
      y: element.closest('tr').index()
    };
  }

  var UI = function () {
    var self = this;
    _.extend(this, backbone.Events);

    $('button').click(function (event) {
      var $clicked = $(event.target).closest('button');
      var $start = $('button.startOfLine');
      if ($start.length > 0) {
        self.trigger('mark', {
          start: getCoords($start),
          end: getCoords($clicked)
        });
        $start.removeClass('startOfLine');
      }
      else {
        $clicked.addClass('startOfLine');
      }
    });
  };

  UI.prototype.setScore = function (myScore) {
    $('#score').text(myScore);
  };

  function createLetterSelector(x, y) {
    return 'table#grid' +
      '> tbody' +
      '> tr:nth-child(' + (y + 1) + ')' +
      '> td:nth-child(' + (x + 1) + ')' +
      '> button';
  }

  UI.prototype.setLetterUsed = function (letterPos) {
    console.log('letter at ' + JSON.stringify(letterPos) + ' has been used');
    $(createLetterSelector(letterPos.x, letterPos.y)).addClass('usedInAWord');
  };

  UI.prototype.setConnectionStatus = function (newStatus) {
    $('#connection').text(newStatus);
  };

  return UI;
});
