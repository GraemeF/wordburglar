var nconf = require('nconf');
var scrabbleLetterProducer = require('./scrabbleLetterProducer');
var FileDictionary = require('./FileDictionary');

var dic = new FileDictionary();
dic.load('./dictionary.txt', function () {
  console.log('loaded dictionary');
});

nconf.argv().env().file({
  file: 'config.json'
}).defaults({
  "server": {
    "port": 2777,
    "grid": {
      "width": 21,
      "height": 21,
      "letterProducer": scrabbleLetterProducer
    },
    "dictionary": dic
  }
});

module.exports = nconf;