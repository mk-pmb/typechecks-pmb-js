/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

module.exports = (function setup() {
  var is = {
    ary: Array.isArray,
    fin: Number.isFinite,
    fun: function (x) { return ((typeof x) === 'function'); },
    num: function (x) { return ((typeof x) === 'number'); },
    obj: function (x) { return ((x && typeof x) === 'object'); },
    str: function (x) { return ((typeof x) === 'string'); },
  };

  is.clsnm = function (obj, cmp) {
    var os = Object.prototype.toString.call(obj);
    if (cmp) { return (os === ('[object ' + cmp + ']')); }
    return os.replace(/^\[object /, '').replace(/\]$/, '');
  };

  /*jslint eqeq:true */
  is.weaklyEqual = function (a, b) { return (a == b); };
  /*jslint eqeq:false */
  is.strictlyEqual = function (a, b) { return (a === b); };

  is.ifFunc = function (f, d, t) { return (is.fun(f) ? (t || f) : d); };

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
