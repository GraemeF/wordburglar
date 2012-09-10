var Zombie = require('zombie');

var Browser = function (uri) {
  this.uri = uri;
  this.zombie = new Zombie();
};

Browser.prototype.navigateHome = function (callback) {
  this.zombie.visit(this.uri, callback);
};

Browser.prototype.hasLogInButton = function () {
  return this.zombie.document.getElementById('loginButton');
};

Browser.prototype.getLetter = function (x, y) {
  return this.zombie.text('table#grid' +
                            '> tbody' +
                            '> tr:nth-child(' + (y + 1) + ')' +
                            '> td:nth-child(' + (x + 1) + ')');
};

Browser.prototype.getTitle = function () {
  return this.zombie.text("title");
};

module.exports = Browser;