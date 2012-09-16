var nconf = require('nconf');
var SequentialProducer = require('./SequentialProducer');
var FileDictionary = require('./FileDictionary');

var dic = new FileDictionary();
dic.load('./dictionary.txt', function () {
  console.log('loaded dictionary');
});

nconf.argv()
  .env()
  .file({ file: 'config.json' })
  .defaults({
              "server": {
                "port": 2777,
                "grid": {
                  "width": 32,
                  "height": 32,
                  "letterProducer": new SequentialProducer().next
                },
                "dictionary": dic
              }
            });

module.exports = nconf;