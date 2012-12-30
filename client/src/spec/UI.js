/*global jasmineFixture:true, affix:true, $:true */

require("chai").should();
require('../vendor/jasmine-fixture');

var UI = require('../lib/UI');

describe('UI', function() {
  beforeEach(function() {
    jasmineFixture($);
  });

  describe('with a name form', function() {
    beforeEach(function() {
      affix('form#nameForm > input');
    });

    describe('when I submit my name', function() {
      var newName;

      beforeEach(function() {
        newName = 'not set';
        var ui = new UI();
        ui.on('setName', function(data) {
          newName = data;
        });
        $('form#nameForm > input').val('Bob');
        $('form#nameForm').submit();
      });

      it('should emit a setName event', function() {
        newName.should.equal('Bob');
      });
    });
  });
});
