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

module.exports = Browser;