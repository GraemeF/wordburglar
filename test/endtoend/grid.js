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
          letterProducer: new SequentialProducer().next
        },
        dictionary: { isWord: function (word) {
          return word === 'DEF';
        }}
      });
    server.start(done);
  });

  afterEach(function (done) {
    server.stop(done);
  });

  describe('when I visit the home page', function () {
    var browser;

    beforeEach(function (done) {
      browser = new Browser(server.uri());
      browser.navigateHome(function () {
        browser.waitUntilConnected(done);
      });
    });

    afterEach(function (done) {
      browser.close(done);
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

    it('should show my score is 0', function () {
      browser.getScore().should.equal(0);
    });

    describe('I mark ABC', function () {
      beforeEach(function () {
        browser.mark({x: 0, y: 0}, {x: 2, y: 0});
      });

      it('should not increase my score', function (done) {
        soon(function () {
          browser.getScore().should.equal(0);
        }, this, done);
      });
    });

    describe('I mark FED', function () {
      beforeEach(function () {
        browser.mark({x: 5, y: 0}, {x: 3, y: 0});
      });

      it('should increase my score', function (done) {
        soon(function () {
          browser.getScore().should.be.greaterThan(0);
        }, this, done);
      });
    });
  });
});