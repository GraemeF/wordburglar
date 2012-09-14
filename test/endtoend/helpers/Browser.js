var Zombie = require('zombie');

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
  this.zombie.visit(this.uri, callback);
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
  this.zombie.pressButton(createLetterSelector(letterLoc.x, letterLoc.y), callback);
};

Browser.prototype.mark = function (firstLetter, lastLetter, callback) {
  var self = this;
  self.clickLetter(firstLetter, function (err) {
    if (err) {
      return callback(err);
    }
    return self.clickLetter(lastLetter, callback);
  });
};

Browser.prototype.getLetter = function (x, y) {
  return this.zombie.text(createLetterSelector(x, y));
};

Browser.prototype.getScore = function () {
  return parseInt(this.zombie.text('span#score'), 10);
};

Browser.prototype.getConnectionStatus = function () {
  var status = this.zombie.text('span#connection');
  return status;
};

Browser.prototype.getTitle = function () {
  return this.zombie.text("title");
};

module.exports = Browser;

function createLetterSelector(x, y) {
  return 'table#grid' +
    '> tbody' +
    '> tr:nth-child(' + (y + 1) + ')' +
    '> td:nth-child(' + (x + 1) + ')' +
    '> button';
}
