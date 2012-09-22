var TestGameServer = require('./helpers/TestGameServer');
var Browser = require('./helpers/Browser');
var _ = require('underscore');

describe('Given a new server has started with a fixed grid', function () {
  var server;

  beforeEach(function (done) {
    server = new TestGameServer();
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

      it('should highlight F', letterShouldBeUsed({x: 5, y: 0}));

      it('should highlight E', letterShouldBeUsed({x: 4, y: 0}));

      it('should highlight D', letterShouldBeUsed({x: 3, y: 0}));

      function letterShouldBeUsed(letterPos) {
        return function (done) {
          soon(function () {
            browser.isLetterUsedInAWord(letterPos).should.be.ok;
          }, this, done);
        };
      }

      describe('and another player joins', function () {
        var browser2;

        beforeEach(function (done) {
          browser2 = new Browser(server.uri());
          browser2.navigateHome(function () {
            browser2.waitUntilConnected(done);
          });
        });

        afterEach(function (done) {
          browser2.close(done);
        });

        it('should highlight F', letterShouldBeUsed({x: 5, y: 0}));

        it('should highlight E', letterShouldBeUsed({x: 4, y: 0}));

        it('should highlight D', letterShouldBeUsed({x: 3, y: 0}));

        function letterShouldBeUsed(letterPos) {
          return function (done) {
            soon(function () {
              browser2.isLetterUsedInAWord(letterPos).should.be.ok;
            }, this, done);
          };
        }
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