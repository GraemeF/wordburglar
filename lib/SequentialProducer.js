var SequentialProducer = function () {
  var nextLetter = 'A';

  function incrementLetter(letter) {
    return letter === 'Z' ? 'A' : String.fromCharCode(letter.charCodeAt(0) + 1);
  }

  this.next = function () {
    var thisLetter = nextLetter;
    nextLetter = incrementLetter(nextLetter);
    return thisLetter;
  };
};

module.exports = SequentialProducer;