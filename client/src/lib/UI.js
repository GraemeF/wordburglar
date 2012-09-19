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

    $('td.letter').click(function (event) {
      var $clicked = $(event.target).closest('td');
      var $start = $('td.startOfLine');
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

    $('form#nameForm').submit(function () {
      self.trigger('setName', $('form#nameForm > input').val());
      return false;
    });
  };

  UI.prototype.setScore = function (myScore) {
    $('#score').text(myScore);
  };

  UI.prototype.setPlayerName = function (details) {
    $('#' + getPlayerRowId(details.id) + ' > .playerName')
      .text(details.name);
  };

  UI.prototype.addPlayer = function (id) {
    $('#players').append($('<tr id="' + getPlayerRowId(id) + '" class="player">'
                             + '<td class="playerName">Anonymous</td>'
                             + '<td></td></tr>'));
  };

  function createLetterSelector(x, y) {
    return 'table#grid' +
      '> tbody' +
      '> tr:nth-child(' + (y + 1) + ')' +
      '> td:nth-child(' + (x + 1) + ')';
  }

  UI.prototype.setLetterUsed = function (letterPos) {
    $(createLetterSelector(letterPos.x, letterPos.y)).addClass('usedInAWord');
  };

  UI.prototype.setConnectionStatus = function (newStatus) {
    $('#connection').text(newStatus);
  };

  function getPlayerRowId(id) {
    return "player_" + id;
  }

  return UI;
});