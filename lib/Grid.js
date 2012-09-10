var Grid = function (options) {
  this.width = options.width;
  this.height = options.height;
  this.letterProducer = options.letterProducer;
};

Grid.prototype.getLetter = function () {
  return 'A';
};

function createRow(width, letterProducer) {
  var row = [];
  for (var x = 0; x < width; x++) {
    row.push(letterProducer());
  }
  return row;
}

function createRows(width, height, letterProducer) {
  var rows = [];
  for (var y = 0; y < height; y++) {
    rows.push(createRow(width, letterProducer));
  }

  return rows;
}

Grid.prototype.fill = function () {
  this.rows = createRows(this.width, this.height, this.letterProducer);
};

module.exports = Grid;