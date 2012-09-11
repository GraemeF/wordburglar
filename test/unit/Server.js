var Server = require('../../lib/Server');

describe('Server', function () {
  var server;
  var httpServer;
  var grid;

  beforeEach(function () {
    httpServer = {
      listen: sinon.stub().callsArg(0),
      on: sinon.stub()
    };
    grid = {fill: sinon.stub()};
    server = new Server(httpServer, grid);
  });

  describe('when started', function () {
    beforeEach(function (done) {
      server.start(done);
    });

    it('should listen', function () {
      httpServer.listen.should.have.been.called;
    });

    it('should fill the grid', function () {
      grid.fill.should.have.been.called;
    });

    it('should subscribe to new players', function () {
      httpServer.on.should.have.been.calledWith('new player');
    });
  });
});