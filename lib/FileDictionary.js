var fs = require('fs');

var FileDictionary = function () {
    var self = this;
    this.words = {};

    this.isWord = function (word) {
      if(typeof word === 'string' && word.length > 1) {
        word = word.toLowerCase();
        console.log('is ' + word + ' a word?', self.words[word] ? 'yes' : 'no');
        return self.words[word];
      }
      return false;
    };
  };

FileDictionary.prototype.load = function (filename, callback) {
  var self = this;
  var stream = fs.createReadStream(filename);
  var buffer = '';
  stream.on('data', function (data) {
    buffer += data.toString();
    var lines = buffer.split('\n');
    lines.forEach(function (word) {
      if(self.words[word]) {
        console.log('double entry for', word);
      }
      self.words[word] = true;
    });

    buffer = lines[lines.length - 1];
  });
  stream.on('end', function () {
    callback();
  });
};

module.exports = FileDictionary;