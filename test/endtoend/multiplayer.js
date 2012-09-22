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

  describe('when a player joins', function () {
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

    it('player 1 should see 1 player', function (done) {
      soon(function () {
        browser.getNumberOfPlayers().should.equal(1);
      }, this, done);
    });

    describe('and submits "Bob" as their name', function () {
      beforeEach(function (done) {
        browser.setPlayerName('Bob', done);
      });

      it('should show "Bob" has 0 points', function (done) {
        soon(function () {
          browser.getPlayerScore('Bob').should.equal(0);
        }, this, done);
      });

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

        it('player 1 should show 2 players', function (done) {
          soon(function () {
            browser.getNumberOfPlayers().should.equal(2);
          }, this, done);
        });

        it('player 2 should show 2 players', function (done) {
          soon(function () {
            browser2.getNumberOfPlayers().should.equal(2);
          }, this, done);
        });

        it('should show "Bob" as the other player name', function (done) {
          soon(function () {
            browser2.getPlayerNames().should.contain('Bob');
          }, this, done);
        });

        describe('and player 1 scores a point', function () {
          beforeEach(function (done) {
            browser.mark({start: {x: 5, y: 0}, end: {x: 3, y: 0}}, done);
          });

          it('should show player 1 that they have scored a point', function (done) {
            soon(function () {
              browser.getPlayerScore('Bob').should.equal(1);
            }, this, done);
          });

          it('should show player 2 that player 1 has scored a point', function (done) {
            soon(function () {
              browser2.getPlayerScore('Bob').should.equal(1);
            }, this, done);
          });
        })
      });
    });
  });
});