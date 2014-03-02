var util = require('util');
var events = require('events');

var Scoreboard = function () {
  this.scores = {};
  events.EventEmitter.call(this);
};

util.inherits(Scoreboard, events.EventEmitter);

Scoreboard.prototype.awardPoints = function (id, pointsAwarded) {
  if (this.scores[id]) {
    this.scores[id] += pointsAwarded;
  }
  else {
    this.scores[id] = pointsAwarded;
  }

  this.emit('scoreChanged', {id: id, points: this.scores[id]});
};

module.exports = Scoreboard;