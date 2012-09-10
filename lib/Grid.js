var Grid = function (width, height) {
  this.width = width;
  this.height = height;
};

Grid.prototype.getLetter = function () {
  return 'A';
};

function createRow(width) {
  var row = [];
  for (var x = 0; x < width; x++) {
    row.push('A');
  }
  return row;
}

function createRows(width, height) {
  var rows = [];
  for (var y = 0; y < height; y++) {
    rows.push(createRow(width));
  }

  return rows;
}

Grid.prototype.fill = function () {
  this.rows = createRows(this.width, this.height);
};

module.exports = Grid;