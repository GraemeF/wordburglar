var Server = require('../../lib/Server');
var events = require('events');

describe('Server', function () {
  var server;
  var httpServer;
  var grid;
  var players;

  beforeEach(function () {
    httpServer = new events.EventEmitter();
    httpServer.listen = sinon.stub().callsArg(0);

    players = [];
    grid = {fill: sinon.stub()};
    server = new Server(httpServer, grid, players);
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

    describe('and a new player joins', function () {
      var socket;

      beforeEach(function () {
        socket = {};
        httpServer.emit('new player', socket);
      });

      it('should add a player', function () {
        players.should.contain(socket);
      });
    });
  });
});