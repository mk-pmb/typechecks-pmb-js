/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var is = require('./typechecks'), repr = is.lazyRepr;


function fail(d, c, x) {
  var e = new Error(d + ' must be ' + c + ': ' + repr(x));
  e.name = 'AssertionError';
  throw e;
}


function mustBe(criteria, descr) {
  if (criteria && (!criteria.forEach)) {
    criteria = (String(criteria).match(/\w+/g) || false);
  }
  if (!(criteria || false).length) { throw new Error('No criteria given'); }
  var err = criteria.join(' ') + " but isn't ", rev;
  rev = criteria.slice().reverse().map(is);
  return function (d, x) {
    if (descr) {
      x = d;
      d = descr;
    }
    rev.forEach(function (f) {
      if (f(x)) { return; }
      fail(d, err + f.criterion, x);
    });
    return x;
  };
}


mustBe.prop = function propMustBe(t, o, p) {
  return mustBe(t)('Property "' + String(p) + '" of ' + String(o),
    (o || false)[p]);
};


mustBe.nest = mustBe('nonEmpty str');
mustBe.obj = mustBe('obj');


mustBe.oneOf = function mustBeOneOf(whitelist, descr) {
  var wlDescr = whitelist;
  if (wlDescr.values) { wlDescr = Array.from(whitelist.values()); }
  wlDescr = 'one of [' + wlDescr.map(repr).join(', ') + ']';
  function chk(d, x) {
    if (descr) {
      x = d;
      d = descr;
    }
    if (whitelist.has) {
      // use a set when you want to allow NaN!
      if (whitelist.has(x)) { return x; }
    } else {
      if (whitelist.indexOf(x) >= 0) { return x; }
    }
    fail(d, wlDescr, x);
  }
  chk.whitelist = whitelist;
  return chk;
};




module.exports = mustBe;
