var Scoreboard = require('../../lib/Scoreboard');

describe('Scoreboard', function () {
  var scoreboard;
  var lastChange;

  beforeEach(function () {
    scoreboard = new Scoreboard();
    scoreboard.on('scoreChanged', function (data) {
      lastChange = data;
    })
  });

  describe('when 5 points are awarded to a new player', function () {
    beforeEach(function () {
      scoreboard.awardPoints('new id', 5);
    });

    it('should emit that the player has 5 points', function () {
      lastChange.should.eql({id: 'new id', points: 5});
    });

    describe('when 6 points are awarded to another new player', function () {
      var id = 'another new id';

      beforeEach(function () {
        scoreboard.awardPoints(id, 6);
      });

      it('should emit that the player has 6 points', function () {
        lastChange.should.eql({id: id, points: 6});
      });

      describe('and the player is awarded another 4 points', function () {
        beforeEach(function () {
          scoreboard.awardPoints(id, 4);
        });

        it('should emit that the player has 10 points', function () {
          lastChange.should.eql({id: id, points: 10});
        });
      });
    });
  });
});
