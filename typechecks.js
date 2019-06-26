/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

module.exports = (function setup() {
  var ObjPt = Object.prototype, finNum = Number.isFinite;

  function is(crit) {
    if (!crit) { throw new Error('No criterion given'); }
    var f = is[crit];
    if (!f) { throw new Error('Unsupported criterion: ' + crit); }
    return f;
  }

  function q(x) {
    var t = typeof x;
    try {
      x = String(x);
      if (x === t) { return x; }
      x = JSON.stringify(x);
    } catch (e) {
      x = '[cannot stringify: ' + e + ']';
    }
    return t + ' ' + x;
  }

  function measure(x) {
    if (!x) { return 0; }
    var len = x.length;
    if (len === undefined) { return Object.keys(x).length; }
    return len;
  }

  function isFun(x) { return ((typeof x) === 'function'); }

  Object.assign(is, {
    ary: Array.isArray,
    empty: function (x) { return (measure(x) === 0); },
    fin: finNum,
    fun: isFun,
    int: function (x) { return (finNum(x) && ((x % 1) === 0)); },
    neg: function (x) { return (finNum(x) && (x < 0)); },
    neg0: function (x) { return (finNum(x) && (x <= 0)); },
    num: function (x) { return ((typeof x) === 'number'); },
    obj: function (x) { return ((x && typeof x) === 'object'); },
    pos: function (x) { return (finNum(x) && (x > 0)); },
    pos0: function (x) { return (finNum(x) && (x >= 0)); },
    str: function (x) { return ((typeof x) === 'string'); },

    in2: function (x, a, b) { return ((x === a) || (x === b)); },
    lazyRepr: q,
    proto: function (x) { return (is.obj(x) && Object.getPrototypeOf(x)); },
    // [is.proto]      unambiguous --^: Object.create(false) -> TypeError
    pojo: function (x) { return (is.proto(x) === ObjPt); },
    // [is.pojo] 0bj isn't old enough for plain _old_ JS object.
  });


  if (Object.getPrototypeOf) {
    is.nobj = function (x) { return (is.proto(x) === null); };
    is.p0jo = function (x) { return is.in2(is.proto(x), ObjPt, null); };
  } else {
      // Fallible but still better than just failing. In lacking environments,
      // you have to expect shims anyway, and thus, sub-perfect accuracy.
    is.nobj = is.p0jo = function (x) { return is.clsnm(x, 'Object'); };
  }
  is['0bj'] = is.nobj;

  is.ncls = function nativeClassName(obj, cmp) {
    // ATT: will identify all user-defined classes as just "Object".
    if ((obj && typeof obj) !== 'object') { return false; }
    var cn = ObjPt.toString.call(obj).slice(8, -1);
    if (cmp) { return (cn === cmp); }
    return cn;
  };

  /*jslint eqeq:true */
  is.weaklyEqual = function (a, b) { return (a == b); };
  /*jslint eqeq:false */
  is.strictlyEqual = function (a, b) { return (a === b); };

  is.ifFunc = function (f, d, t) { return (is.fun(f) ? (t || f) : d); };
  is.ifObj = function (o, d, t) { return (is.obj(o) ? (t || o) : d); };

  is.undef = function (x, then) {
    if (x === undefined) {
      if (arguments.length > 1) { return then; }
      return true;
    }
    if (arguments.length > 1) { return x; }
    return false;
  };

  is.numInRange = function (x, a, b) {
    return ((x === +x) && (x >= a) && (x <= b));
  };

  is.nonEmpty = function (x) {
    var n = measure(x);
    return (Number.isFinite(n) && (n > 0));
  };







  Object.keys(is).forEach(function declare(c) {
    var f = is[c];
    if (isFun(f)) { f.criterion = c; }
  });
  return is;
}());
