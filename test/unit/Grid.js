var _ = require('underscore');
var Grid = require('../../lib/Grid');
var SequentialProducer = require('../../lib/SequentialProducer');

describe('A 5x4 Grid with a sequential letter producer', function () {
  var grid;

  beforeEach(function () {
    grid = new Grid({width: 5,
                      height: 4,
                      letterProducer: new SequentialProducer().next});
  });

  describe('when filled', function () {
    beforeEach(function () {
      grid.fill();
    });

    it('should contain G at 1,1', function () {
      grid.getLetter(1, 1).should.equal('G');
    });

    it('should contain M at 2,2', function () {
      grid.getLetter(2, 2).should.equal('M');
    });

    it('should contain 4 rows', function () {
      grid.rows.should.have.length(4);
    });

    describe('each row', function () {
      it('should contain 5 letters', function () {
        _.each(grid.rows, function (row) {
          row.should.have.length(5);
        });
      });
    });

    describe('when I get the first 3 letters', function () {
      var letters;

      beforeEach(function () {
        letters = grid.getLetters({ start: {x: 0, y: 0},
                                    end: {x: 2, y: 0} });
      });

      it('should return ABC', function () {
        letters.should.equal('ABC');
      });
    });

    describe('when I get the first 3 letters in reverse', function () {
      var letters;

      beforeEach(function () {
        letters = grid.getLetters({ start: {x: 2, y: 0},
                                    end: {x: 0, y: 0} });
      });

      it('should return CBA', function () {
        letters.should.equal('CBA');
      });
    });
  });
});