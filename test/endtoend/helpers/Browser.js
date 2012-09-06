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

Browser.prototype.showsGrid = function () {
  return this.zombie.document.getElementById('grid');
};

module.exports = Browser;