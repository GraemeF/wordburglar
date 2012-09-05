var serverFactory = require('../../lib/serverFactory');
var Browser = require('./helpers/Browser');

describe('Given a new server has started', function () {
  var server;

  beforeEach(function (done) {
    server = serverFactory({port: 0});
    server.start(done);
  });

  describe('when I visit the home page', function () {
    var browser;

    beforeEach(function (done) {
      browser = new Browser(server.uri);
      browser.navigateHome(done);
    });

    it('should ask me to log in', function () {
      browser.hasLogInButton().should.be.truthy;
    });
  });
});