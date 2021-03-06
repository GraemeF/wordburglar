var _ = require('underscore');
var Grid = require('../../lib/Grid');
var SequentialProducer = require('../../lib/SequentialProducer');

describe('A 5x4 Grid with a sequential letter producer', function () {
  var grid;

  function createLineTest(line, expected) {
    return function () {
      var letters;

      beforeEach(function () {
        letters = _.map(grid.getLetters(line), function (l) {
          return l.letter;
        });
      });

      it('should return ' + expected, function () {
        letters.join('').should.equal(expected);
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
    grid = new Grid({
      width: 5,
      height: 4,
      letterProducer: new SequentialProducer().next
    });
  });

  describe('filled with letters', function () {
    beforeEach(function () {
      grid.fill();
    });

    it('should contain G at 1,1', function () {
      grid.getLetter(1, 1).letter.should.equal('G');
    });

    it('should contain M at 2,2', function () {
      grid.getLetter(2, 2).letter.should.equal('M');
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
      var playerId = 'some player';

      beforeEach(function () {
        lettersUsed = [];
        grid.on('letterUsed', function (letterPos) {
          lettersUsed.push(letterPos);
        });

        grid.markUnusedLettersUsed({
          start: {
            x: 0,
            y: 0
          },
          end: {
            x: 3,
            y: 0
          }
        }, playerId);
      });

      function letterUsedByPlayer(location) {
        return {
          location: location,
          player: playerId
        };
      }

      it('should emit an event marking A as used by a word', function () {
        lettersUsed[0].should.eql(letterUsedByPlayer({
          x: 0,
          y: 0
        }));
      });

      it('should emit an event marking B as used by a word', function () {
        lettersUsed[1].should.eql(letterUsedByPlayer({
          x: 1,
          y: 0
        }));
      });

      it('should emit an event marking C as used by a word', function () {
        lettersUsed[2].should.eql(letterUsedByPlayer({
          x: 2,
          y: 0
        }));
      });
    });

    describe('when I get an East line', createLineTest({
      start: {
        x: 0,
        y: 0
      },
      end: {
        x: 2,
        y: 0
      }
    }, 'ABC'));

    describe('when I get a West line', createLineTest({
      start: {
        x: 2,
        y: 0
      },
      end: {
        x: 0,
        y: 0
      }
    }, "CBA"));

    describe('when I get a South line', createLineTest({
      start: {
        x: 0,
        y: 0
      },
      end: {
        x: 0,
        y: 2
      }
    }, 'AFK'));

    describe('when I get a North line', createLineTest({
      start: {
        x: 0,
        y: 2
      },
      end: {
        x: 0,
        y: 0
      }
    }, 'KFA'));

    describe('when I get a South-East line', createLineTest({
      start: {
        x: 0,
        y: 0
      },
      end: {
        x: 2,
        y: 2
      }
    }, 'AGM'));

    describe('when I get a North-West line', createLineTest({
      start: {
        x: 2,
        y: 2
      },
      end: {
        x: 0,
        y: 0
      }
    }, 'MGA'));

    describe('when I get a North-East line', createLineTest({
      start: {
        x: 0,
        y: 2
      },
      end: {
        x: 2,
        y: 0
      }
    }, 'KGC'));

    describe('when I get a South-West line', createLineTest({
      start: {
        x: 2,
        y: 0
      },
      end: {
        x: 0,
        y: 2
      }
    }, 'CGK'));

    describe('when I get the first letter', createLineTest({
      start: {
        x: 0,
        y: 0
      },
      end: {
        x: 0,
        y: 0
      }
    }, 'A'));

    describe('when I get an invalid line at 1 o\'clock', createInvalidLineTest({
      start: {
        x: 0,
        y: 2
      },
      end: {
        x: 1,
        y: 0
      }
    }));

    describe('when I get an invalid line at 2 o\'clock', createInvalidLineTest({
      start: {
        x: 0,
        y: 2
      },
      end: {
        x: 2,
        y: 1
      }
    }));

    describe('when I get an invalid line at 4 o\'clock', createInvalidLineTest({
      start: {
        x: 0,
        y: 0
      },
      end: {
        x: 2,
        y: 1
      }
    }));

    describe('when I get an invalid line at 5 o\'clock', createInvalidLineTest({
      start: {
        x: 0,
        y: 0
      },
      end: {
        x: 1,
        y: 2
      }
    }));

    describe('when I get an invalid line at 7 o\'clock', createInvalidLineTest({
      start: {
        x: 2,
        y: 0
      },
      end: {
        x: 1,
        y: 2
      }
    }));

    describe('when I get an invalid line at 8 o\'clock', createInvalidLineTest({
      start: {
        x: 2,
        y: 0
      },
      end: {
        x: 0,
        y: 1
      }
    }));

    describe('when I get an invalid line at 10 o\'clock', createInvalidLineTest({
      start: {
        x: 2,
        y: 2
      },
      end: {
        x: 0,
        y: 1
      }
    }));

    describe('when I get an invalid line at 11 o\'clock', createInvalidLineTest({
      start: {
        x: 2,
        y: 2
      },
      end: {
        x: 1,
        y: 0
      }
    }));

    describe('when I get a line that starts outside the left side', createInvalidLineTest({
      start: {
        x: -1,
        y: 0
      },
      end: {
        x: 0,
        y: 0
      }
    }));

    describe('when I get a line that ends outside the top side', createInvalidLineTest({
      start: {
        x: 0,
        y: 0
      },
      end: {
        x: 0,
        y: -1
      }
    }));

    describe('when I get a line that starts outside the top side', createInvalidLineTest({
      start: {
        x: 0,
        y: -1
      },
      end: {
        x: 0,
        y: 0
      }
    }));

    describe('when I get a line that ends outside the left side', createInvalidLineTest({
      start: {
        x: 0,
        y: 0
      },
      end: {
        x: -1,
        y: 0
      }
    }));

    describe('when I get a line that starts outside the right side', createInvalidLineTest({
      start: {
        x: 5,
        y: 0
      },
      end: {
        x: 0,
        y: 0
      }
    }));

    describe('when I get a line that ends outside the right side', createInvalidLineTest({
      start: {
        x: 0,
        y: 0
      },
      end: {
        x: 5,
        y: 0
      }
    }));

    describe('when I get a line that starts outside the bottom side', createInvalidLineTest({
      start: {
        x: 0,
        y: 4
      },
      end: {
        x: 0,
        y: 0
      }
    }));

    describe('when I get a line that ends outside the bottom side', createInvalidLineTest({
      start: {
        x: 0,
        y: 0
      },
      end: {
        x: 0,
        y: 4
      }
    }));
  });
});