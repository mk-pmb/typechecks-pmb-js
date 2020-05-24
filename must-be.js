/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var is = require('./typechecks'), repr = require('./src/lazyrepr'),
  explainCrit = require('./src/explain-crit'),
  oneParamCrit = require('./src/crits.1param');


function fail(descr, allCrit, failCrit, x) {
  if (allCrit.map) { allCrit = allCrit.map(explainCrit).join(' '); }
  var err = new Error(descr + ' must be ' + allCrit +
    " but isn't " + failCrit + ': ' + repr(x));
  err.name = 'AssertionError';
  throw err;
}


function maybeDescrArg(d, f) {
  if (!d) { return f; }
  return function expectWithDefaultDescr(x) { return f(d, x); };
}


function decodeQueryParts(q) {
  return q.replace(/\+/g, ' ').split(/&/).map(decodeURIComponent);
}


function decodeCritArgs(spec) {
  var m = decodeCritArgs.rgx.exec(spec), crit, sep, args, decoder;
  if (!m) { return spec; }
  crit = m[1];
  sep = m[2];
  args = spec.slice(m[0].length);
  decoder = decodeCritArgs[sep];
  args = decoder(args);
  spec = [crit].concat(args);
  return spec;
}
Object.assign(decodeCritArgs, {
  rgx: /^(\w+)(:|\&|\?)/,
  ':': JSON.parse,
  '&': decodeQueryParts,
  // '?': qrystr, // not (yet?) worth the added complexity.
});


function makeNamedCrit(crit) {
  var f = is(decodeCritArgs(crit)), n = (f.descr || String(crit));
  return { f: f, n: n };
}


function mustBe(criteria, descr) {
  if (criteria && (!criteria.forEach)) {
    criteria = (String(criteria).match(/\S+/g) || false);
  }
  if (!(criteria || false).length) { throw new Error('No criteria given'); }
  var rev = criteria.slice().reverse().map(makeNamedCrit);
  return maybeDescrArg(descr, function expect(d, x) {
    rev.forEach(function (c) {
      if (c.f(x)) { return; }
      fail(d, criteria, c.n, x);
    });
    return x;
  });
}


mustBe.prop = function propMustBe(t, o, p) {
  return mustBe(t)('Property "' + String(p) + '" of ' + String(o),
    (o || false)[p]);
};


mustBe.finNum = mustBe('fin num');
mustBe.fun = mustBe('fun');
mustBe.near = mustBe('nonEmpty ary');
mustBe.nest = mustBe('nonEmpty str');
mustBe.obj = mustBe('obj');


mustBe.withArgs = function mustBeWithArgs(crit, descr) {
  return function argsReceiver() {
    var args = Array.prototype.slice.call(arguments),
      crit1 = [crit].concat(args),
      allCrit = [crit1];
    return mustBe(allCrit, descr);
  };
};


Object.keys(oneParamCrit).forEach(function addOneArgCritHelper(c) {
  mustBe[c] = function (y, d) { return mustBe.withArgs(c, d)(y); };
});


function makeRulesDict(rules) {
  var dict = {};
  Object.keys(rules).forEach(function addRule(descr) {
    dict[descr] = mustBe(rules[descr], descr);
  });
  return dict;
}
mustBe.makeRulesDict = makeRulesDict;






module.exports = mustBe;
