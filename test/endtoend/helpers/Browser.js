var Zombie = require('zombie');

var hasClass = function (element, cls) {
  return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
};

var Browser = function (uri) {
  this.uri = uri;
  this.zombie = new Zombie();
};

Browser.prototype.close = function (done) {
  this.zombie.evaluate('window.disconnect()');

  soon(function () {
    this.getConnectionStatus().should.equal('disconnected');
  }, this, done);
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
  this.zombie.pressButton(createLetterSelector(letterLoc.x, letterLoc.y),
                          callback);
};

Browser.prototype.mark = function (line, callback) {
  var self = this;
  self.clickLetter(line.start, function (err) {
    if (err) {
      callback(err);
    }
    else {
      self.clickLetter(line.end, callback);
    }
  });
};

Browser.prototype.setPlayerName = function (name, callback) {
  this.zombie.fill('playerName', name)
    .pressButton('submitName', callback);
};

Browser.prototype.getLetter = function (x, y) {
  return this.zombie.text(createLetterSelector(x, y));
};

Browser.prototype.isLetterUsedInAWord = function (letterLoc) {
  return hasClass(this.zombie.query(createLetterSelector(letterLoc.x,
                                                         letterLoc.y)),
                  'usedInAWord');
};

Browser.prototype.getScore = function () {
  return parseInt(this.zombie.text('span#score'), 10);
};

Browser.prototype.getPlayerName = function () {
  return this.zombie.text('span#playerName');
};

Browser.prototype.getConnectionStatus = function () {
  return this.zombie.text('span#connection');
};

Browser.prototype.getTitle = function () {
  return this.zombie.text('title');
};

module.exports = Browser;

function createLetterSelector(x, y) {
  return 'table#grid' +
    '> tbody' +
    '> tr:nth-child(' + (y + 1) + ')' +
    '> td:nth-child(' + (x + 1) + ')' +
    '> button';
}
