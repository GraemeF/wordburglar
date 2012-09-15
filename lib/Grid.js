var Grid = function (options) {
  this.width = options.width;
  this.height = options.height;
  this.letterProducer = options.letterProducer;
};

Grid.prototype.getLetter = function (x, y) {
  return this.rows[y][x];
};

function getDirection(from, to) {
  return (from < to) ? 1 : (from > to) ? -1 : 0;
}

function getStep(line) {
  return {x: getDirection(line.start.x, line.end.x)};
}

Grid.prototype.getLetters = function (line) {
  var letters = this.getLetter(line.start.x, line.start.y);
  var cursor = line.start;

  var step = getStep(line);
  if (cursor.x < line.end.x)
    while (cursor.x < line.end.x) {
      cursor.x += step.x;
      letters += this.getLetter(cursor.x, cursor.y);
    }
  else
    while (cursor.x > line.end.x) {
      cursor.x += step.x;
      letters += this.getLetter(cursor.x, cursor.y);
    }

  return letters;
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