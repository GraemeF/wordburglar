define(['lib/Game',
        'underscore',
        'backbone'
       ], function (Game, _, backbone) {

  return describe('Game', function () {
    var game;
    var ui;
    var serverProxy;

    beforeEach(function () {
      serverProxy = {
        markLine: sinon.stub()
      };
      _.extend(serverProxy, backbone.Events);

      ui = {
        setScore: sinon.stub(),
        setConnectionStatus: sinon.stub()
      };
      _.extend(ui, backbone.Events);

      game = new Game(serverProxy, ui);
      game.start();
    });

    describe('when the server sends a score update', function () {
      beforeEach(function () {
        serverProxy.trigger('score', 55);
      });

      it('should update the UI score', function () {
        ui.setScore.should.have.been.calledWith(55);
      });
    });

    describe('when the server sends a connection status update', function () {
      beforeEach(function () {
        serverProxy.trigger('connection', 'some status');
      });

      it('should update the UI connection status', function () {
        ui.setConnectionStatus.should.have.been.calledWith('some status');
      });
    });

    describe('when the UI marks a line', function () {
      beforeEach(function () {
        ui.trigger('mark', 'a line');
      });

      it('should submit it to the server', function () {
        serverProxy.markLine.should.have.been.calledWith('a line');
      });
    });
  });
});