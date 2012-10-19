var serverFactory = require('./lib/serverFactory');
var config = require('./lib/config');

var serverConfig = config.get('server');
console.log('Starting with server config:', serverConfig);

var server = serverFactory(serverConfig);

server.start(function () {
  console.log('Listening on', server.uri());
});
