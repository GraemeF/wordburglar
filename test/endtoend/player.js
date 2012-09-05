var serverFactory = require('../../lib/serverFactory');
var Browser = require('./helpers/Browser');

describe('Given a new server has started', function () {
  var test;
  var server;

  beforeEach(function (done) {
    server = serverFactory();
    server.start(done);
  });

  describe('when I visit the home page', function (done) {
    var browser;

    beforeEach(function (done) {
      browser = new Browser(server.uri);
      browser.navigateHome(done);
    });

    it('should ask me to log in', function () {
      //browser.hasLogInLink().should.equal(true);
    });
  });
});