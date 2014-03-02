var nconf = require('nconf');
var scrabbleLetterProducer = require('./ScrabbleLetterProducer');
var FileDictionary = require('./FileDictionary');

var dic = new FileDictionary();
dic.load('./dictionary.txt', function () {
  console.log('loaded dictionary');
});

nconf.argv().env().file({
  file: 'config.json'
}).defaults({
  "server": {
    "port": process.env.PORT || 2777,
    "grid": {
      "width": 21,
      "height": 21,
      "letterProducer": scrabbleLetterProducer
    },
    "dictionary": dic
  }
});

module.exports = nconf;