var Zombie = require('zombie');

var Browser = function (uri) {
  this.uri = uri;
  this.zombie = new Zombie();
};

Browser.prototype.navigateHome = function (callback) {
  this.zombie.visit(this.uri, callback);
};

Browser.prototype.clickLetter = function (letterLoc, callback) {
  this.zombie.clickLink(createLetterSelector(letterLoc.x, letterLoc.y), callback);
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

Browser.prototype.getTitle = function () {
  return this.zombie.text("title");
};

module.exports = Browser;

function createLetterSelector(x, y) {
  return 'table#grid' +
    '> tbody' +
    '> tr:nth-child(' + (y + 1) + ')' +
    '> td:nth-child(' + (x + 1) + ')' +
    '> a';
}
