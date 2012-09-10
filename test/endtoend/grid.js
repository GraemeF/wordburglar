var serverFactory = require('../../lib/serverFactory');
var Browser = require('./helpers/Browser');

describe('Given a new server has started with a fixed grid', function () {
  var server;

  beforeEach(function (done) {
    server = serverFactory(
      { port: 0,
        grid: { width: 32,
          height: 32,
          letterProducer: function () {
            return 'X';
          }}
      });
    server.start(done);
  });

  describe('when I visit the home page', function () {
    var browser;

    beforeEach(function (done) {
      browser = new Browser(server.uri());
      browser.navigateHome(done);
    });

    describe('the grid', function () {
      it('should contain letters', function () {
        browser.getLetter(0, 0).should.equal('X');
        browser.getLetter(31, 31).should.equal('X');
      });
    });

    it('should have be titled Word Burglar', function () {
      browser.getTitle().should.equal('Word Burglar');
    });
  });
});