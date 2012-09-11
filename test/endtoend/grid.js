var serverFactory = require('../../lib/serverFactory');
var Browser = require('./helpers/Browser');
var SequentialProducer = require('../../lib/SequentialProducer');

describe('Given a new server has started with a fixed grid', function () {
  var server;

  beforeEach(function (done) {
    server = serverFactory(
      { port: 0,
        grid: { width: 26,
          height: 32,
          letterProducer: new SequentialProducer().next}
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
        browser.getLetter(0, 0).should.equal('A');
        browser.getLetter(25, 31).should.equal('Z');
      });
    });

    it('should have be titled Word Burglar', function () {
      browser.getTitle().should.equal('Word Burglar');
    });

    it('should have a score of 0', function () {
      browser.getScore().should.equal(0);
    });
  });
});