var Server = require('../../lib/Server');

describe('Server', function () {
  var server;
  var httpServer;

  beforeEach(function () {
    httpServer = {listen: sinon.stub()};
    server = new Server(httpServer);
  });

  describe('when started', function () {
    beforeEach(function (done) {
      server.start(done);
    });

    it('should listen', function () {
      httpServer.listen.should.have.been.called;
    });
  });
});