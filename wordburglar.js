var serverFactory = require('./lib/serverFactory');
var config = require('./lib/config');

server = serverFactory(config.get('server'));

server.start(function () {
  console.log('Listening on', server.uri());
});