var _ = require('underscore');
var Grid = require('../../lib/Grid');

describe('A 20x10 Grid', function () {
  var grid;

  beforeEach(function () {
    grid = new Grid(20, 10);
  });

  describe('when filled', function () {
    beforeEach(function () {
      grid.fill();
    });

    it('should contain letters', function () {
      grid.getLetter(2, 2).should.be.within('A', 'Z');
    });

    it('should contain 10 rows', function () {
      grid.rows.should.have.length(10);
    });

    describe('each row', function () {
      it('should contain 20 letters', function () {
        _.each(grid.rows, function (row) {
          row.should.have.length(20);
        });
      });
    });
  });
});