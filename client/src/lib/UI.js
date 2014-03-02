var util = require("util");
var events = require("events");
var $ = require('jquery-browserify');

function getCoords(element) {
  return {
    x: element.closest('td').index(),
    y: element.closest('tr').index()
  };
}

var UI = function() {
    var self = this;
    events.EventEmitter.call(this);

    $('td.letter').click(function(event) {
      var $clicked = $(event.target).closest('td');
      var $start = $('td.startOfLine');
      if ($start.length > 0) {
        self.emit('mark', {
          start: getCoords($start),
          end: getCoords($clicked)
        });
        $start.removeClass('startOfLine');
      } else {
        $clicked.addClass('startOfLine');
      }
    });

    $('form#nameForm').submit(function() {
      self.emit('setName', $('form#nameForm > input').val());
      return false;
    });
  };

util.inherits(UI, events.EventEmitter);

function getPlayerRowId(id) {
  return "player_" + id;
}

UI.prototype.setScore = function(details) {
  $('#' + getPlayerRowId(details.id) + ' > td > span.score').text(details.points);
};

UI.prototype.setPlayerName = function(details) {
  $('#' + getPlayerRowId(details.id) + ' > .playerName').text(details.name);
};

UI.prototype.addPlayer = function(id) {
  var existingPlayer = $('#' + getPlayerRowId(id));

  if (existingPlayer.length > 0) {
    existingPlayer.show();
  } else {
    $('#players').append($('<tr id="' + getPlayerRowId(id) + '" class="player">' + '<td class="playerName">Anonymous</td>' + '<td><span class="score ownedByPlayer_' + id + '">0</span></td></tr>'));
  }
};

UI.prototype.removePlayer = function(id) {
  $('#' + getPlayerRowId(id)).hide();
};

function createLetterSelector(x, y) {
  return 'table#grid' + '> tbody' + '> tr:nth-child(' + (y + 1) + ')' + '> td:nth-child(' + (x + 1) + ')';
}

UI.prototype.setLetterUsed = function(usage) {
  $(createLetterSelector(usage.location.x, usage.location.y)).addClass('ownedByPlayer_' + usage.player).addClass('usedInAWord');
};

UI.prototype.setConnectionStatus = function(newStatus) {
  $('#connection').text(newStatus);
};

module.exports = UI;
