/*jslint indent: 2, maxlen: 80, node: true */
/*globals Set: true*/
/* -*- tab-width: 2 -*- */
'use strict';

var mustBe = require('typechecks-pmb/must-be'), dict,
  mapAssoc = require('map-assoc-core'),
  mustFail = require('equal-pmb').err;

function assErr(f) { mustFail(f, assErr.rx); }
assErr.rx = /^AssertionError: /;

dict = mapAssoc({
  user: 'nonEmpty str',
  password: [ ['eeq', 'swordfish'] ],
  group: [ ['oneOf', ['basic', 'pro', 'uber']] ],
  level: [ 'pos', 'int', ['lte', 100] ],
}, mustBe);

dict.user('bernd');
assErr(function fail() { dict.user(''); });

dict.password('swordfish');
assErr(function fail() { dict.password('Sw0rDf1sH'); });

dict.group('basic');
dict.group('pro');
assErr(function fail() { dict.group('admin'); });

dict.level(1);
dict.level(23);
assErr(function fail() { dict.level(0); });
assErr(function fail() { dict.level(1337); });









console.log("+OK mustbe_simple tests passed.");
  //= "+OK mustbe_simple tests passed."
