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
test('',            'hello');
test('nonEmpty',    '');
test('str',         undefined);
test('str',         null);
test('str',         true);
test('str',         []);
test('str',         [0]);

test = makeTest('pos fin num');
test('',            23.42);
test('pos',         0);
test('pos',         -23.42);
test('fin',         NaN);
test('fin',         Number.POSITIVE_INFINITY);
test('num',         '23');

test = makeTest('neg0 int');
test('',            0);
test('',            -5);
test('int',         -5.5);
test('int',         Number.POSITIVE_INFINITY);
test('neg0',        2);

test = makeTest('nonEmpty');
test('nonEmpty',    '');
test('nonEmpty',    { length: 0 });
test('',            { length: 2 });
test('nonEmpty',    []);
test('',            [1, 2]);
test('nonEmpty',    {});
test('',            { a: 1, b: 2 });

test = makeTest('empty');
test('',            '');
test('',            { length: 0 });
test('empty',       { length: 2 });
test('empty',       { length: NaN });
test('',            []);
test('empty',       [1, 2]);
test('',            {});
test('empty',       { a: 1, b: 2 });

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
test('',      NaN);
test('same',  'NaN');

test = makeTest([ ['same', 'NaN' ] ], 'same(string "NaN")');
test('',      'NaN');
test('same',  NaN);

test = mustBe.same([], "the world's very best empty array");
assErr(function fail() { test([]); });

test = mustBe('nul | nonEmpty str', 'password hash');
test(null);
test('$6$SaltSalt$HashHashHash');
test('!');      // locked linux account
test('true');   // very exotic hash algo ;-)
test('false');
assErr(function fail() { test(''); });
assErr(function fail() { test(0); });
assErr(function fail() { test(true); });
assErr(function fail() { test(false); });
assErr(function fail() { test(undefined); });











console.log("+OK mustbe_simple tests passed.");
  //= "+OK mustbe_simple tests passed."
