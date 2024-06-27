/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var EX, defMtd = require('./defmtd'),
  ObjPt = Object.prototype,
  finNum = Number.isFinite;

function orf(x) { return (x || false); }

EX = {
  ary: Array.isArray,
  fin: finNum,
  nan: (Number.isNaN || function isNaN(x) { return (EX.num(x) && isNaN(x)); }),
};

function maybeUnsupp(c, f) {
  EX[c] = (f || function unsupp() {
    throw new Error('This criterion is not supported on this platform: ' + c);
  });
}
function canHaz(t) { return t !== 'undefined'; } // cheat jslint
maybeUnsupp('buf', canHaz(typeof Buffer) && Buffer.isBuffer);


function measure(x) {
  if (!x) { return 0; }
  var len = x.length;
  if (len === undefined) { return Object.keys(x).length; }
  return len;
}


defMtd.fromDict(EX, {
  any: function any() { return true; },

  fun: function fun(x) { return ((typeof x) === 'function'); },
  str: function str(x) { return ((typeof x) === 'string'); },
  symb: function symb(x) { return ((typeof x) === 'symbol'); },
  nul: function nul(x) { return (x === null); },
  nullish: function nullish(x) { return (x === null) || (x === undefined); },
  bool: function bool(x) { return ((typeof x) === 'boolean'); },
  tru: function tru(x) { return (x === true); },
  fal: function fal(x) { return (x === false); },
  tri: function tri(x) { return (EX.bool(x) || (x === null)); },

  num: function num(x) { return ((typeof x) === 'number'); },
  int: function int(x) { return (finNum(x) && ((x % 1) === 0)); },
  neg: function neg(x) { return (finNum(x) && (x < 0)); },
  neg0: function neg0(x) { return (finNum(x) && (x <= 0)); },
  pos: function pos(x) { return (finNum(x) && (x > 0)); },
  pos0: function pos0(x) { return (finNum(x) && (x >= 0)); },
  zero: function zero(x) { return (x === 0); },
  keyless: function keyless(x) { return !Object.keys(x || false).length; },

  empty: function empty(x) { return (measure(x) === 0); },
  nonEmpty: function nonEmpty(x) { return EX.pos(measure(x)); },
  minLength: function minLength(x, m) { return (measure(x) >= m); },
  maxLength: function maxLength(x, m) { return (measure(x) <= m); },
  ofLength: function ofLength(x, l) { return (measure(x) === l); },

  // ##### BEGIN Object checks helper functions #####
  in2: function in2(x, a, b) { return ((x === a) || (x === b)); },
  proto: function proto(x) { return (EX.obj(x) && Object.getPrototypeOf(x)); },
  // [proto] `&&` is unambiguous: Object.create(false) -> TypeError
  nativeClassName: function nativeClassName(obj, cmp) {
    // ATT: will identify all user-defined classes as just "Object".
    if ((obj && typeof obj) !== 'object') { return false; }
    var cn = ObjPt.toString.call(obj).slice(8, -1);
    if (cmp) { return (cn === cmp); }
    return cn;
  },
  ncls: 'nativeClassName',
  // ##### ENDOF Object checks helper functions #####

  obj: function obj(x) { return ((x && typeof x) === 'object'); },
  pojo: function pojo(x) { return (EX.proto(x) === ObjPt); },
  // [pojo] 0bj isn't old enough for plain _old_ JS object.

  thenable: function thenable(x) { return EX.fun(orf(x).then); },
});

defMtd.fromDict(EX, Object.getPrototypeOf ? {
  dictObj: function dictObj(x) { return (EX.obj(x) && (!EX.ary(x))); },
  nobj: function nobj(x) { return (EX.proto(x) === null); },
  p0jo: function p0jo(x) { return EX.in2(EX.proto(x), ObjPt, null); },
} : {
  // Fallible but still better than just failing. In lacking environments,
  // you have to expect shims anyway, and thus, sub-perfect accuracy.
  nobj: function nobj(x) { return EX.clsnm(x, 'Object'); },
  p0jo: 'nobj',
});
EX['0bj'] = EX.nobj;


module.exports = EX;
