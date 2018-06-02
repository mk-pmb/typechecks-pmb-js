/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

module.exports = (function setup() {
  var ObjPt = Object.prototype, is = {
    ary: Array.isArray,
    fin: Number.isFinite,
    fun: function (x) { return ((typeof x) === 'function'); },
    num: function (x) { return ((typeof x) === 'number'); },
    obj: function (x) { return ((x && typeof x) === 'object'); },
    str: function (x) { return ((typeof x) === 'string'); },
  };

  is.proto = function (x) { return (is.obj(x) && Object.getPrototypeOf(x)); };
                  //  unambiguous --^ : Object.create(false) -> TypeError
  (function (iso) {
    if (Object.getPrototypeOf) {
      iso.plain = function (x) { return (is.proto(x) === ObjPt); };
      iso.simple = function (x) { return is.in2(is.proto(x), ObjPt, null); };
    } else {
      // Fallible but still better than just failing. In lacking environments,
      // you have to expect shims anyway, and thus, sub-perfect accuracy.
      iso.plain = iso.simple = function (x) { return is.clsnm(x, 'Object'); };
    }
  }(is.obj));

  is.in2 = function (x, a, b) { return ((x === a) || (x === b)); };

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






  return is;
}());
