/*jslint indent: 2, maxlen: 80, node: true */
/*globals Set: true*/
/* -*- tab-width: 2 -*- */
'use strict';

var mustBe = require('typechecks-pmb/must-be'), test,
  makeTest = require('./lib/mustbe_helper'),
  mustFail = require('equal-pmb').err;

function assErr(f) { mustFail(f, assErr.rx); }
assErr.rx = /^AssertionError: /;

test = makeTest('nonEmpty str');
test({ ok: 'hello' });
test({ isNot: 'nonEmpty',   nope: '' });
test({ isNot: 'str',        nope: undefined });
test({ isNot: 'str',        nope: null });
test({ isNot: 'str',        nope: true });
test({ isNot: 'str',        nope: [] });
test({ isNot: 'str',        nope: [0] });

test = makeTest('pos fin num');
test({ ok: 23.42 });
test({ isNot: 'pos',        nope: 0 });
test({ isNot: 'pos',        nope: -23.42 });
test({ isNot: 'fin',        nope: NaN });
test({ isNot: 'fin',        nope: Number.POSITIVE_INFINITY });
test({ isNot: 'num',        nope: '23' });

test = makeTest('neg0 int');
test({ ok: 0 });
test({ ok: -5 });
test({ isNot: 'int',        nope: -5.5 });
test({ isNot: 'int',        nope: Number.POSITIVE_INFINITY });
test({ isNot: 'neg0',       nope: 2 });

test = makeTest('nonEmpty');
test({ isNot: 'nonEmpty',   nope: '' });
test({ isNot: 'nonEmpty',   nope: { length: 0 } });
test({ ok: { length: 2 } });
test({ isNot: 'nonEmpty',   nope: [] });
test({ ok: [1, 2] });
test({ isNot: 'nonEmpty',   nope: {} });
test({ ok: { a: 1, b: 2 } });

test = makeTest('empty');
test({ ok: '' });
test({ ok: { length: 0 } });
test({ isNot: 'empty',      nope: { length: 2 } });
test({ isNot: 'empty',      nope: { length: NaN } });
test({ ok: [] });
test({ isNot: 'empty',      nope: [1, 2] });
test({ ok: {} });
test({ isNot: 'empty',      nope: { a: 1, b: 2 } });

mustFail(function fail() { mustBe.obj({}); },
  "AssertionError: [object Object] must be obj " +
  "but isn't obj: undefined");

mustFail(function fail() { mustBe.nest('again, no descr'); },
  "AssertionError: again, no descr must be nonEmpty str " +
  "but isn't str: undefined");

test = mustBe.oneOf([Boolean, null, NaN], 'input');
assErr(function fail() { test(123); });
assErr(function fail() { test(true); });
assErr(function fail() { test(false); });
test(Boolean);
test(null);
assErr(function fail() { test(NaN); });   // compare with next test

test = mustBe.oneOf(new Set([Boolean, null, NaN]), 'input');
assErr(function fail() { test(123); });
assErr(function fail() { test(true); });
assErr(function fail() { test(false); });
test(Boolean);
test(null);
test(NaN);      // with Set, NaN can be found.

test = makeTest([ ['same', NaN] ], 'same(number "NaN")');
test({ ok: NaN });
test({ isNot: 'same',  nope: 'NaN' });

test = makeTest([ ['same', 'NaN' ] ], 'same(string "NaN")');
test({ ok: 'NaN' });
test({ isNot: 'same',  nope: NaN });

test = mustBe.same([], "the world's very best empty array");
assErr(function fail() { test([]); });

test = makeTest('nul | nonEmpty str');
test({ ok: null });
test({ ok: '$6$SaltSalt$HashHashHash' });
test({ ok: '!' });      // locked linux account
test({ ok: 'true' });   // very exotic hash algo ;-)
test({ ok: 'false' });
test({ isNot: 'nul | nonEmpty', nope: '' });
test({ isNot: 'nul | str',      nope: 0 });
test({ isNot: 'nul | str',      nope: true });
test({ isNot: 'nul | str',      nope: false });
test({ isNot: 'nul | str',      nope: undefined });











console.log("+OK mustbe_simple tests passed.");
  //= "+OK mustbe_simple tests passed."
