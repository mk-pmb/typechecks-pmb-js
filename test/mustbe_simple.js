﻿/*jslint indent: 2, maxlen: 80, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var mustBe = require('typechecks-pmb/must-be'), test,
  makeTest = require('./lib/mustbe_helper'),
  eq = require('equal-pmb');

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

eq.err(function fail() { mustBe.obj({}); },
  "Error: [object Object] must be obj but isn't obj: undefined");

eq.err(function fail() { mustBe.nest('again, no descr'); },
  "Error: again, no descr must be nonEmpty str but isn't str: undefined");












console.log("+OK mustbe_simple tests passed.");
  //= "+OK mustbe_simple tests passed."
