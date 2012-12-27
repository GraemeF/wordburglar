var sinon = require("sinon");
var chai = require("chai");
var should = require("chai").should();
var expect = require("chai").expect;
var AssertionError = require("chai").AssertionError;
var soon = require('patience').soon;
var sinonChai = require("sinon-chai");
chai.use(sinonChai);

var Game = require('../lib/Game');
var _ = require('underscore');
var backbone = require('backbone');
var sinon = require('sinon');

describe('UI x', function() {
  it('should fail', function(done) {
    done(new Error('hooray yall:w !'));
  });
});
