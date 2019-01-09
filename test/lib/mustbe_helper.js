/*jslint indent: 2, maxlen: 80, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var mustBe = require('typechecks-pmb/must-be'), test,
  eq = require('equal-pmb');


function makeMustbeTest(crit) {
  var verify = mustBe(crit, 'input'),
    err = 'Error: input must be ' + crit + " but isn't ";
  return function (whyNot, x) {
    if (!whyNot) { return eq(verify(x), x); }
    eq.err(function () { verify(x); }, err + whyNot);
  };
}


module.exports = makeMustbeTest;
