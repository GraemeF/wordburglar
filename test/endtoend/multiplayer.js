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

      describe('and submit "Bob" as their name', function () {
        beforeEach(function (done) {
          browser.setPlayerName('Bob', done);
        });

        it('should show "Bob" as the player name', function (done) {
          soon(function () {
            browser.getPlayerName().should.equal('Bob');
          }, this, done);
        });
      });
    });
  });
});