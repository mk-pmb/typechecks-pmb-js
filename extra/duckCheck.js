/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

// 2026-08-09: This module is used in express-final-text-response-pmb.

var EX, emArr = [], loMapValues = require('lodash.mapvalues');


EX = function makeDuckCheck(duckSpec) {
  var f = function isDuck(x) { return !isDuck.whyNot(x); };
  loMapValues(EX.duckCheckApi, function b(v, k) { f[k] = v.bind(null, f); });
  Object.assign(f, duckSpec);
  if (!f.descr) { throw new Error('Non-descript duck!'); }
  return f;
};


EX.quacksLikeAComplaint = function quacksLikeAComplaint(x) {
  return (x && x.length && x.concat && x.slice && x) || false;
  /* This check makes it so non-empty arrays and strings are considered
    a complaint, and most other stuff isn't. It allows for easy
    complaint-as-fallback patterns like
    `(Number.isFinite(x) || 'not a finite Number!')` or
    `(x?.subscribe?.call?.call || 'not subscribe()-able!'`.

    Also of course the condition has to rely on duck typing, as it's the
    only acceptable style inside a ducktyping library. With stricter type
    checks, discussion and code would quickly get lost in dealing with exotic
    but reasonably valid edge cases like String objects, Buffers, etc.
  */
};


function notBool(x) { return (typeof x !== 'boolean'); }

function wnfj(o, k, f) { // wnfj = whyNot filter+join
  if (!o) { return; }
  o = o[k];
  if (!o) { return; }
  if (!o.filter) { return; }
  o = (o.filter(f).join(' ') || '');
  if (!o) { return; }
  return 'Missing ' + k + ': ' + o;
}


EX.duckCheckApi  = {

  whyNot: function why(isDuck, x, opt) {
    if (!x) {
      if (isDuck.allowFalsey) { return ''; }
      return 'Falsey value';
    }
    var bad = (
      wnfj(isDuck, 'boolProps', function b(k) { return notBool(x[k]); })
      || wnfj(isDuck, 'truthyProps', function t(k) { return !x[k]; })
    );
    if (bad) { return bad; }
    if (isDuck.extraComplaints) {
      bad = isDuck.extraComplaints(x, opt, isDuck);
      if (EX.quacksLikeAComplaint(bad)) { return bad; }
    }
    return '';
  },

  must: function must(isDuck, descr, x, opt) {
    var bad = isDuck.whyNot(x, opt);
    if (!bad) { return x; }
    bad = descr + ' must quack like ' + isDuck.descr + ' but does not: ' + bad;
    throw new Error(bad);
  },

};


module.exports = EX;
