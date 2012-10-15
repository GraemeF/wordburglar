var TestGameServer = require('./helpers/TestGameServer');

describe('Grid', function () {
  var server;

  beforeEach(function (done) {
    server = new TestGameServer();
    server.start(done);
  });

  afterEach(function (done) {
    server.stop(done);
  });

  describe('a player joins', function () {
    var player;

    beforeEach(function (done) {
      player = server.createPlayer();
      player.join(done);
    });

    afterEach(function (done) {
      player.leave(done);
    });

    describe('the grid', function () {
      it('should contain letters', function () {
        player.getLetter(0, 0).should.equal('A');
        player.getLetter(25, 31).should.equal('Z');
      });
    });

    it('should show my score is 0', function () {
      player.getScore().should.equal(0);
    });

    describe('I mark ABC', function () {
      beforeEach(function (done) {
        player.mark({
          start: {
            x: 0,
            y: 0
          },
          end: {
            x: 2,
            y: 0
          }
        }, done);
      });

      it('should not increase my score', function (done) {
        player.wait(function () {
          player.getScore().should.equal(0);
          done();
        });
      });
    });

    describe('I mark FED', function () {

      function player1ShouldSeeUsedLetter(letterPos) {
        return function (done) {
          soon(function () {
            player.getPlayerOwningLetter(letterPos).should.equal('1');
          }, this, done);
        };
      }

      beforeEach(function (done) {
        player.mark({
          start: {
            x: 5,
            y: 0
          },
          end: {
            x: 3,
            y: 0
          }
        }, done);
      });

      it('should increase my score', function (done) {
        soon(function () {
          player.getScore().should.be.greaterThan(0);
        }, this, done);
      });

      it('should highlight F', player1ShouldSeeUsedLetter({
        x: 5,
        y: 0
      }));

      it('should highlight E', player1ShouldSeeUsedLetter({
        x: 4,
        y: 0
      }));

      it('should highlight D', player1ShouldSeeUsedLetter({
        x: 3,
        y: 0
      }));

      describe('and another player joins', function () {
        var player2;

        function player2ShouldSeeUsedLetter(letterPos) {
          return function (done) {
            soon(function () {
              player2.getPlayerOwningLetter(letterPos).should.equal('1');
            }, this, done);
          };
        }

        beforeEach(function (done) {
          player2 = server.createPlayer();
          player2.join(done);
        });

        afterEach(function (done) {
          player2.leave(done);
        });

        it('should highlight F', player2ShouldSeeUsedLetter({
          x: 5,
          y: 0
        }));

        it('should highlight E', player2ShouldSeeUsedLetter({
          x: 4,
          y: 0
        }));

        it('should highlight D', player2ShouldSeeUsedLetter({
          x: 3,
          y: 0
        }));
      });

      describe('and I mark HI', function () {
        var scoreBeforeSecondWord;

        beforeEach(function (done) {
          scoreBeforeSecondWord = player.getScore();
          player.mark({
            start: {
              x: 7,
              y: 0
            },
            end: {
              x: 8,
              y: 0
            }
          }, done);
        });

        it('should increase my score', function (done) {
          soon(function () {
            player.getScore().should.be.greaterThan(scoreBeforeSecondWord);
          }, this, done);
        });
      });
    });
  });
});