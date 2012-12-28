var sinon = require("sinon");
var chai = require("chai");
var should = require("chai").should();
var expect = require("chai").expect;
var AssertionError = require("chai").AssertionError;
var soon = require('patience').soon;
var sinonChai = require("sinon-chai");
chai.use(sinonChai);

var _ = require('underscore');
var backbone = require('backbone');
var sinon = require('sinon');
require('./jasmine-fixture');
var UI = require('../lib/UI');

describe('UI', function() {
  beforeEach(function() {
    jasmineFixture($)
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
