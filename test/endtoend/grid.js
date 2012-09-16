var serverFactory = require('../../lib/serverFactory');
var Browser = require('./helpers/Browser');
var SequentialProducer = require('../../lib/SequentialProducer');
var _ = require('underscore');

var words = ['FED', 'HI'];

describe('Given the dictionary allows ' + words, function () {
  describe('and a new server has started with a fixed grid', function () {
    var server;

    beforeEach(function (done) {
      server = serverFactory(
        { port: 0,
          grid: { width: 26,
            height: 32,
            letterProducer: new SequentialProducer().next
          },
          dictionary: { isWord: function (word) {
            return _.indexOf(words, word) !== -1;
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
        beforeEach(function (done) {
          browser.mark({start: {x: 0, y: 0}, end: {x: 2, y: 0}}, done);
        });

        it('should not increase my score', function (done) {
          browser.wait(function () {
            browser.getScore().should.equal(0);
            done();
          });
        });
      });

      describe('I mark FED', function () {
        beforeEach(function (done) {
          browser.mark({start: {x: 5, y: 0}, end: {x: 3, y: 0}}, done);
        });

        it('should increase my score', function (done) {
          soon(function () {
            browser.getScore().should.equal(1);
          }, this, done);
        });

        it('should highlight F', function (done) {
          soon(function () {
            browser.isLetterUsedInAWord({x: 5, y: 0}).should.be.ok;
          }, this, done);
        });

        it('should highlight E', function (done) {
          soon(function () {
            browser.isLetterUsedInAWord({x: 4, y: 0}).should.be.ok;
          }, this, done);
        });

        it('should highlight E', function (done) {
          soon(function () {
            browser.isLetterUsedInAWord({x: 3, y: 0}).should.be.ok;
          }, this, done);
        });

        describe('and I mark HI', function () {
          beforeEach(function (done) {
            browser.mark({start: {x: 7, y: 0}, end: {x: 8, y: 0}}, done);
          });

          it('should increase my score', function (done) {
            soon(function () {
              browser.getScore().should.equal(2);
            }, this, done);
          });
        });
      });
    });
  });
});