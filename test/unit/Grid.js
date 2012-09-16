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

  function createInvalidLineTest(line) {
    return function () {
      var letters;

      beforeEach(function () {
        letters = grid.getLetters(line);
      });

      it('should return null', function () {
        expect(letters).not.to.be.ok;
      });
    };
  }

  beforeEach(function () {
    grid = new Grid({width: 5,
                      height: 4,
                      letterProducer: new SequentialProducer().next});
  });

  describe('filled with letters', function () {
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

    describe('when I mark the first 3 letters as used', function () {
      var lettersUsed;

      beforeEach(function () {
        lettersUsed = [];
        grid.on('letter used', function (letterPos) {
          lettersUsed.push(letterPos);
        });

        grid.markUsed({ start: {x: 0, y: 0},
                        end: {x: 3, y: 0} })
      });

      it('should emit an event marking A as used by a word', function () {
        lettersUsed[0].should.eql({x: 0, y: 0});
      });

      it('should emit an event marking B as used by a word', function () {
        lettersUsed[1].should.eql({x: 1, y: 0});
      });

      it('should emit an event marking C as used by a word', function () {
        lettersUsed[2].should.eql({x: 2, y: 0});
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

    describe('when I get an invalid line at 1 o\'clock',
             createInvalidLineTest({ start: {x: 0, y: 2},
                                     end: {x: 1, y: 0} }));

    describe('when I get an invalid line at 2 o\'clock',
             createInvalidLineTest({ start: {x: 0, y: 2},
                                     end: {x: 2, y: 1} }));

    describe('when I get an invalid line at 4 o\'clock',
             createInvalidLineTest({ start: {x: 0, y: 0},
                                     end: {x: 2, y: 1} }));

    describe('when I get an invalid line at 5 o\'clock',
             createInvalidLineTest({ start: {x: 0, y: 0},
                                     end: {x: 1, y: 2} }));

    describe('when I get an invalid line at 7 o\'clock',
             createInvalidLineTest({ start: {x: 2, y: 0},
                                     end: {x: 1, y: 2} }));

    describe('when I get an invalid line at 8 o\'clock',
             createInvalidLineTest({ start: {x: 2, y: 0},
                                     end: {x: 0, y: 1} }));

    describe('when I get an invalid line at 10 o\'clock',
             createInvalidLineTest({ start: {x: 2, y: 2},
                                     end: {x: 0, y: 1} }));

    describe('when I get an invalid line at 11 o\'clock',
             createInvalidLineTest({ start: {x: 2, y: 2},
                                     end: {x: 1, y: 0} }));

    describe('when I get a line that starts outside the left side',
             createInvalidLineTest({ start: {x: -1, y: 0},
                                     end: {x: 0, y: 0} }));

    describe('when I get a line that ends outside the top side',
             createInvalidLineTest({ start: {x: 0, y: 0},
                                     end: {x: 0, y: -1} }));

    describe('when I get a line that starts outside the top side',
             createInvalidLineTest({ start: {x: 0, y: -1},
                                     end: {x: 0, y: 0} }));

    describe('when I get a line that ends outside the left side',
             createInvalidLineTest({ start: {x: 0, y: 0},
                                     end: {x: -1, y: 0} }));

    describe('when I get a line that starts outside the right side',
             createInvalidLineTest({ start: {x: 5, y: 0},
                                     end: {x: 0, y: 0} }));

    describe('when I get a line that ends outside the right side',
             createInvalidLineTest({ start: {x: 0, y: 0},
                                     end: {x: 5, y: 0} }));

    describe('when I get a line that starts outside the bottom side',
             createInvalidLineTest({ start: {x: 0, y: 4},
                                     end: {x: 0, y: 0} }));

    describe('when I get a line that ends outside the bottom side',
             createInvalidLineTest({ start: {x: 0, y: 0},
                                     end: {x: 0, y: 4} }));
  });
});