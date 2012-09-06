var nconf = require('nconf');

nconf.argv()
  .env()
  .file({ file: 'config.json' })
  .defaults({ "server": { "port": 2777 } });

module.exports = nconf;