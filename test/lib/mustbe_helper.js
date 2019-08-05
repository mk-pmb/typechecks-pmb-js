/*jslint indent: 2, maxlen: 80, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var EX, mustBe = require('typechecks-pmb/must-be'), test,
  is = require('typechecks-pmb'),
  eq = require('equal-pmb');


EX = function makeMustbeTest(crit) {
  var verify = mustBe(crit, 'input'),
    err = 'AssertionError: input must be ' + crit + " but isn't ";
  return function (whyNot, x) {
    if (!whyNot) { return eq(verify(x), x); }
    eq.err(function () { verify(x); }, err + whyNot + ': ' + is.lazyRepr(x));
  };
};


module.exports = EX;
