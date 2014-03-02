var _ = require('underscore');

var superScrabbleLetterCounts = {
  A: 16,
  B: 4,
  C: 6,
  D: 8,
  E: 24,
  F: 4,
  G: 5,
  H: 5,
  I: 13,
  J: 2,
  K: 2,
  L: 7,
  M: 6,
  N: 13,
  O: 15,
  P: 4,
  Q: 2,
  R: 13,
  S: 10,
  T: 15,
  U: 7,
  V: 3,
  W: 4,
  X: 2,
  Y: 4,
  Z: 2
};

var createLetters = function (letter) {
    var letters = [];
    for(var i = 0; i < superScrabbleLetterCounts[letter]; i++) {
      letters.push(letter);
    }
    return letters;
  };

var fullBagOfLetters = _.flatten(_.map(_.keys(superScrabbleLetterCounts), createLetters));

var createShuffledBagOfLetters = function () {
    return _.shuffle(fullBagOfLetters);
  };

var bag = [];

module.exports = function () {
  if(bag.length === 0) {
    bag = createShuffledBagOfLetters();
  }

  return bag.pop();
};