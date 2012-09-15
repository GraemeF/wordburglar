var _ = require('underscore');
var Grid = require('../../lib/Grid');
var SequentialProducer = require('../../lib/SequentialProducer');

describe('A 5x4 Grid with a sequential letter producer', function () {
  var grid;

  function createLineTest(line, expected) {
    return function () {
      var letters;

      beforeEach(function () {
        letters = grid.getLetters(line);
      });

      it('should return ' + expected, function () {
        letters.should.equal(expected);
      });
    };
  }

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

    describe('when I get the first 3 letters',
             createLineTest({ start: {x: 0, y: 0},
                              end: {x: 2, y: 0} },
                            'ABC'));

    describe('when I get the first 3 letters in reverse',
             createLineTest({ start: {x: 2, y: 0},
                              end: {x: 0, y: 0} },
                            "CBA"));

    describe('when I get the first 3 vertical letters',
             createLineTest({ start: {x: 0, y: 0},
                              end: {x: 0, y: 2} },
                            'AFK'));

    describe('when I get the first 3 vertical letters reversed',
             createLineTest({ start: {x: 0, y: 2},
                              end: {x: 0, y: 0} },
                            'KFA'));

    describe('when I get the first 3 diagonal letters',
             createLineTest({ start: {x: 0, y: 0},
                              end: {x: 2, y: 2} },
                            'AGM'));

    describe('when I get the first 3 diagonal letters reversed',
             createLineTest({ start: {x: 2, y: 2},
                              end: {x: 0, y: 0} },
                            'MGA'));

    describe('when I get the first letter',
             createLineTest({ start: {x: 0, y: 0},
                              end: {x: 0, y: 0} },
                            'A'));
  });
});