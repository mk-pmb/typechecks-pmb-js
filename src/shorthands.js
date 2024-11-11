/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';


var EX = function installShorthands(dest, base) {
  if (!base) { return EX(dest, dest); }
  dest.finNum = base('fin num');
  dest.near = base('nonEmpty ary');
  dest.nest = base('nonEmpty str');
  EX.singleWordRules.forEach(function sc(rule) { dest[rule] = base(rule); });
  return dest;
};

EX.singleWordRules = [
  'ary',
  'bool',
  'dictObj',
  'empty',
  'fun',
  'keyless',
  'obj',
  'str',
];


module.exports = EX;
