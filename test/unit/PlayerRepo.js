var PlayerRepo = require('../../lib/PlayerRepo');

describe('PlayerRepo', function () {
  var players;

  beforeEach(function () {
    players = new PlayerRepo();
  });

  it('should not contain a player with token 1', function () {
    expect(players.findByToken(1)).to.not.be.ok;
  });

  describe('when player 1 is added', function () {
    beforeEach(function () {
      players.addNew({token: 1, name: 'player 1'});
    });

    it('should contain a player with token 1', function () {
      expect(players.findByToken(1)).to.be.ok;
    });

    it('should not contain a player with token 2', function () {
      expect(players.findByToken(2)).to.not.be.ok;
    });
  });
});