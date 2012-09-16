define(['lib/Game',
        'underscore',
        'backbone'
       ], function (Game, _, backbone) {

  return describe('Game', function () {
    var game;
    var ui;
    var serverProxy;

    beforeEach(function () {
      serverProxy = {};
      _.extend(serverProxy, backbone.Events);

      ui = {setScore: sinon.stub()};

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
  });
});