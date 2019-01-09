/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var is = require('./typechecks');


function mustBe(criteria, descr) {
  if (!criteria.forEach) {
    criteria = (String(criteria).match(/\w+/g) || false);
  }
  if (!criteria.length) { throw new Error('No criteria given'); }
  var err = ' must be ' + criteria.join(' ') + " but isn't ", rev;
  rev = criteria.slice().reverse().map(is);
  return function (d, x) {
    if (descr) {
      x = d;
      d = descr;
    }
    rev.forEach(function (f) {
      if (f(x)) { return; }
      throw new Error(d + err + f.criterion);
    });
    return true;
  };
}


mustBe.prop = function propMustBe(t, o, p) {
  return mustBe((o || false)[p], t,
    'Property "' + String(p) + '" of ' + String(o));
};


module.exports = mustBe;
