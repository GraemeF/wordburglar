var Zombie = require('zombie');
var _ = require('underscore');
var util = require('util');

function findPlayerRows(zombie) {
  return zombie.queryAll('tr.player');
}

function findPlayerRowByName(zombie, name) {
  return _.find(findPlayerRows(zombie), function (row) {
    return zombie.text('.playerName', row) === name;
  });
}

function createLetterSelector(x, y) {
  return 'table#grid' + '> tbody' + '> tr:nth-child(' + (y + 1) + ')' + '> td:nth-child(' + (x + 1) + ')';
}

var Browser = function (uri) {
    this.uri = uri;
    this.zombie = new Zombie({
      debug: false
    });
  };

Browser.prototype.join = function (callback) {
  var self = this;
  this.navigateHome(function () {
    self.waitUntilConnected(callback);
  });
};

Browser.prototype.leave = function (callback) {
  this.close(callback);
};

Browser.prototype.close = function (done) {
  this.zombie.close();
  process.nextTick(done);
};

Browser.prototype.navigateHome = function (callback) {
  this.zombie.visit(this.uri, {}, callback);
};

Browser.prototype.waitUntilConnected = function (callback) {
  soon(function () {
    this.getConnectionStatus().should.equal('connected');
  }, this, callback);
};

Browser.prototype.wait = function (callback) {
  this.zombie.wait(callback);
};

Browser.prototype.clickLetter = function (letterLoc, callback) {
  this.zombie.click(createLetterSelector(letterLoc.x, letterLoc.y));
  process.nextTick(callback);
};

Browser.prototype.mark = function (line, callback) {
  var self = this;
  self.clickLetter(line.start, function (err) {
    if(err) {
      callback(err);
    } else {
      self.clickLetter(line.end, callback);
    }
  });
};

Browser.prototype.setPlayerName = function (name, callback) {
  this.zombie.fill('playerName', name).pressButton('submitName', callback);
};

Browser.prototype.getLetter = function (x, y) {
  return this.zombie.text(createLetterSelector(x, y));
};

Browser.prototype.getPlayerOwningLetter = function (letterLoc) {
  const prefix = 'ownedByPlayer_';
  var letter = this.zombie.query(createLetterSelector(letterLoc.x, letterLoc.y));

  var cls = _.find(letter.className.split(' '), function (c) {
    return c.indexOf(prefix) === 0;
  });

  return cls && cls.substr(prefix.length);
};

Browser.prototype.getScore = function (context) {
  var text = this.zombie.text('span.score', context);
  if(text === '') {
    throw new Error('Could not find a score');
  }

  return parseInt(text, 10);
};

Browser.prototype.getPlayerScore = function (name) {
  var row = findPlayerRowByName(this.zombie, name);
  if(row) {
    return this.getScore(row);
  } else {
    throw new Error('Could not find row for player "' + name + '" in ' + util.inspect(this.getPlayerNames()));
  }
};

Browser.prototype.getPlayerNames = function () {
  var self = this;

  return _.map(findPlayerRows(this.zombie), function (row) {
    return self.zombie.text('.playerName', row);
  });
};

Browser.prototype.getPlayerName = function () {
  return this.zombie.text('.playerName');
};

Browser.prototype.getConnectionStatus = function () {
  return this.zombie.text('span#connection');
};

Browser.prototype.getTitle = function () {
  return this.zombie.text('title');
};
Browser.prototype.getNumberOfPlayers = function () {
  return findPlayerRows(this.zombie).length;
};

module.exports = Browser;
