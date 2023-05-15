/*jslint indent: 2, maxlen: 80, node: true */
/*globals Set: true*/
/* -*- tab-width: 2 -*- */
'use strict';

var mustBe = require('typechecks-pmb/must-be'), dict, test,
  eq = require('equal-pmb'), mustFail = eq.err;


function assErr(f) { mustFail(f, assErr.rx); }
assErr.rx = /^AssertionError: /;


dict = { hi: 'hello', cu: 'goodbye' };
eq(mustBe.enumDict(dict)('hi', 'input'), 'hello');
eq(mustBe.enumDict(dict, 'hi', 'input')(), 'hello');
assErr(function fail() { mustBe.enumDict(dict)('yo', ''); });










console.log("+OK mustbe_enumdict tests passed.");
  //= "+OK mustbe_enumdict tests passed."
