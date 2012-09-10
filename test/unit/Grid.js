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

    it('should contain letters', function () {
      grid.getLetter(2, 2).should.be.within('A', 'Z');
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
  });
});