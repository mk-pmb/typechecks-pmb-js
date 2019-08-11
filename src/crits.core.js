/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var EX, defMtd = require('./defmtd'),
  ObjPt = Object.prototype,
  finNum = Number.isFinite;

EX = {
  ary: Array.isArray,
  fin: finNum,
  nan: (Number.isNaN || function isNaN(x) { return (EX.num(x) && isNaN(x)); }),
};

defMtd.multi(EX, [
  function str(x) { return ((typeof x) === 'string'); },
  function fun(x) { return ((typeof x) === 'function'); },

  function num(x) { return ((typeof x) === 'number'); },
  function int(x) { return (finNum(x) && ((x % 1) === 0)); },
  function neg(x) { return (finNum(x) && (x < 0)); },
  function neg0(x) { return (finNum(x) && (x <= 0)); },
  function pos(x) { return (finNum(x) && (x > 0)); },
  function pos0(x) { return (finNum(x) && (x >= 0)); },

  // ##### BEGIN Object checks helper functions #####
  function in2(x, a, b) { return ((x === a) || (x === b)); },
  function proto(x) { return (EX.obj(x) && Object.getPrototypeOf(x)); },
  // [proto] "&&" is unambiguous: Object.create(false) -> TypeError
  ['ncls', function nativeClassName(obj, cmp) {
    // ATT: will identify all user-defined classes as just "Object".
    if ((obj && typeof obj) !== 'object') { return false; }
    var cn = ObjPt.toString.call(obj).slice(8, -1);
    if (cmp) { return (cn === cmp); }
    return cn;
  }],
  // ##### ENDOF Object checks helper functions #####

  function obj(x) { return ((x && typeof x) === 'object'); },
  function pojo(x) { return (EX.proto(x) === ObjPt); },
  // [pojo] 0bj isn't old enough for plain _old_ JS object.
]);

defMtd.multi(EX, Object.getPrototypeOf ? [
  function nobj(x) { return (EX.proto(x) === null); },
  function p0jo(x) { return EX.in2(EX.proto(x), ObjPt, null); },
] : [
  // Fallible but still better than just failing. In lacking environments,
  // you have to expect shims anyway, and thus, sub-perfect accuracy.
  ['p0jo', function nobj(x) { return EX.clsnm(x, 'Object'); }],
]);
EX['0bj'] = EX.nobj;


module.exports = EX;
