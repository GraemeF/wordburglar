var Browser = require('./Browser');
var SequentialProducer = require('../../../lib/SequentialProducer');
var serverFactory = require('../../../lib/serverFactory');
var _ = require('underscore');

var words = ['FED', 'HI'];

var TestGameServer = function () {
  this.server = serverFactory(
    { port: 0,
      grid: { width: 26,
        height: 32,
        letterProducer: new SequentialProducer().next
      },
      dictionary: { isWord: function (word) {
        return _.indexOf(words, word) !== -1;
      }}
    });
};

TestGameServer.prototype.start = function (callback) {
  this.server.start(callback);
};

TestGameServer.prototype.stop = function (callback) {
  this.server.stop(callback);
};

TestGameServer.prototype.uri = function () {
  return this.server.uri();
};

TestGameServer.prototype.createPlayer = function () {
  return new Browser(this.uri());
};

module.exports = TestGameServer;