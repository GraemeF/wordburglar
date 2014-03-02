// Configure RequireJS
require.config({
                 baseUrl: 'src/',
                 urlArgs: "v=" + (new Date()).getTime(),
                 paths: {
                   "sinon": "../../public/assets/backbone/backbone",
                   "backbone": "../../public/assets/backbone/backbone",
                   "underscore": "../../public/assets/underscore/underscore",
                   "jquery": "../../public/assets/jquery/jquery"
                 }
               });

// Require libraries
require(['require',
         'vendor/chai',
         'vendor/sinon-chai',
         'vendor/mocha'
        ], function (require, chai, sinonChai) {

  // Chai
  assert = chai.assert;
  should = chai.should();
  expect = chai.expect;

  chai.use(sinonChai);

  // Mocha
  mocha.setup('bdd');

  // Require base tests before starting
  require(['spec/Game'], function () {
    // Start runner
    mocha.run();
  });

});
