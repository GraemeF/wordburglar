var util = require('util');
var events = require('events');

var Grid = function (options) {
  this.width = options.width;
  this.height = options.height;
  this.letterProducer = options.letterProducer;
  events.EventEmitter.call(this);
};

util.inherits(Grid, events.EventEmitter);

Grid.prototype.getLetter = function (x, y) {
  return this.rows[y][x];
};

function getDirection(from, to) {
  return (from < to) ? 1 : (from > to) ? -1 : 0;
}

function getStep(line) {
  return {
    x: getDirection(line.start.x, line.end.x),
    y: getDirection(line.start.y, line.end.y)
  };
}

function getFinishedCondition(line) {
  return function (cursor) {
    return cursor.x == line.end.x && cursor.y === line.end.y;
  };
}

function advance(cursor, step) {
  return {
    x: cursor.x + step.x,
    y: cursor.y + step.y
  };
}

function isValidDirection(line) {
  if (line.start.x === line.end.x)
    return true;

  if (line.start.y === line.end.y)
    return true;

  return (line.start.y - line.end.y) === (line.start.x - line.end.x);
}

function isPointWithinGrid(point, grid) {
  return point.x >= 0
    && point.y >= 0
    && point.x < grid.width
    && point.y < grid.height;
}

function isLineWithinGrid(line, grid) {
  return isPointWithinGrid(line.start, grid)
    && isPointWithinGrid(line.end, grid);
}

function isValid(line, grid) {
  return isValidDirection(line) && isLineWithinGrid(line, grid);
}

function forEachLetterInLine(line, action) {
  var cursor = line.start;
  var step = getStep(line);
  var isFinished = getFinishedCondition(line);

  while (!isFinished(cursor)) {
    action(cursor);
    cursor = advance(cursor, step);
  }
  action(cursor);
}
Grid.prototype.getLetters = function (line) {
  if (!isValid(line, this))
    return null;

  var letters = '';
  var self = this;

  forEachLetterInLine(line, function (cursor) {
    letters += self.getLetter(cursor.x, cursor.y);
  });

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

Grid.prototype.markUsed = function (line) {
  var self = this;

  forEachLetterInLine(line, function (cursor) {
    self.emit('letter used', cursor);
  });
};

module.exports = Grid;