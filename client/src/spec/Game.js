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
        markLine: sinon.stub(),
        setPlayerName: sinon.stub()
      };
      _.extend(serverProxy, backbone.Events);

      ui = {
        addPlayer: sinon.stub(),
        setScore: sinon.stub(),
        setPlayerName: sinon.stub(),
        setConnectionStatus: sinon.stub(),
        setLetterUsed: sinon.stub()
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

    describe('when the server sends a player name', function () {
      beforeEach(function () {
        serverProxy.trigger('nameChanged', 'Trevor');
      });

      it('should update the UI player name', function () {
        ui.setPlayerName.should.have.been.calledWith('Trevor');
      });
    });

    describe('when the server sends a new player', function () {
      beforeEach(function () {
        serverProxy.trigger('newPlayer', 'player id');
      });

      it('should add the player to the UI', function () {
        ui.addPlayer.should.have.been.calledWith('player id');
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

    describe('when the UI sets the player name', function () {
      beforeEach(function () {
        ui.trigger('setName', 'my name');
      });

      it('should submit it to the server', function () {
        serverProxy.setPlayerName.should.have.been.calledWith('my name');
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

    describe('when the server sends a used letter', function () {
      beforeEach(function () {
        serverProxy.trigger('letterUsed', {x: 3, y: 4});
      });

      it('should tell the UI to mark it as used', function () {
        ui.setLetterUsed.should.have.been.calledWith({x: 3, y: 4});
      });
    });
  });
});