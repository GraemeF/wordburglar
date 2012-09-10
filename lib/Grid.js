var Grid = function (width, height) {
  this.width = width;
  this.height = height;
};

Grid.prototype.getLetter = function (x, y) {
  return 'A';
};

Grid.prototype.fill = function () {
  this.rows = [];
  for (var y = 0; y < this.height; y++) {
    var row = [];
    for (var x = 0; x < this.width; x++)
      row.push('A');

    this.rows.push(row);
  }
};

module.exports = Grid;