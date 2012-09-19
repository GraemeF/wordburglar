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

      it('player 1 should show 1 player', function (done) {
        soon(function () {
          browser.getNumberOfPlayers().should.equal(1);
        }, this, done);
      });

      describe('and submit "Bob" as their name', function () {
        beforeEach(function (done) {
          browser.setPlayerName('Bob', done);
        });

        it('should show "Bob" as the player name', function (done) {
          soon(function () {
            browser.getPlayerName().should.equal('Bob');
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
        });
      });
    });
  });
});