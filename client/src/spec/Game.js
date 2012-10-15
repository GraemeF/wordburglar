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
        removePlayer: sinon.stub(),
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
      var data = {id: 'a player', points: 55};

      beforeEach(function () {
        serverProxy.trigger('score', data);
      });

      it('should update the UI score', function () {
        ui.setScore.should.have.been.calledWith(data);
      });
    });

    describe('when the server sends a player name', function () {
      beforeEach(function () {
        serverProxy.trigger('nameChanged', {id: 33, name: 'Trevor'});
      });

      it('should update the UI player name', function () {
        ui.setPlayerName.should.have.been.calledWith({id: 33, name: 'Trevor'});
      });
    });

    describe('when the server sends an added player', function () {
      beforeEach(function () {
        serverProxy.trigger('playerAdded', 'player id');
      });

      it('should add the player to the UI', function () {
        ui.addPlayer.should.have.been.calledWith('player id');
      });
    });

    describe('when the server sends a removed player', function () {
      beforeEach(function () {
        serverProxy.trigger('playerRemoved', 'player id');
      });

      it('should remove the player from the UI', function () {
        ui.removePlayer.should.have.been.calledWith('player id');
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
        serverProxy.trigger('letterUsed',
                            {location: {x: 3, y: 4},
                              player: 'some player'});
      });

      it('should tell the UI to mark it as used', function () {
        ui.setLetterUsed.should.have.been
          .calledWith({location: {x: 3, y: 4},
                        player: 'some player'});
      });
    });
  });
});