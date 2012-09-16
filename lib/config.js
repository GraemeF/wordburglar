var nconf = require('nconf');
var SequentialProducer = require('./SequentialProducer');

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
                "dictionary": {
                  isWord: function () {
                    return true;
                  }
                }
              }
            });

module.exports = nconf;