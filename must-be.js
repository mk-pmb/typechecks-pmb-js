/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var is = require('./typechecks'), repr = require('./src/lazyrepr'),
  explainCrit = require('./src/explain-crit'),
  oneParamCrit = require('./src/crits.1param'),
  arSlc = Array.prototype.slice, objHas = Object.prototype.hasOwnProperty;


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


function bindArgs(f, a, c) {
  return f.bind.apply(f, [c].concat(arSlc.call(a)));
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


function reverseSplitByAndMap(list, sep, convert) {
  var groups = [], curGr = [];
  function add(item) {
    if (item === sep) {
      if (curGr.length) { groups.push(curGr.reverse()); }
      curGr = [];
      return;
    }
    curGr.push(convert(item));
  }
  list.forEach(add);
  add(sep);
  return groups;
}


function mustBe(criteria, descr) {
  if (criteria && (!criteria.forEach)) {
    criteria = (String(criteria).match(/\S+/g) || false);
  }
  if (!(criteria || false).length) { throw new Error('No criteria given'); }
  var revCritGroups = reverseSplitByAndMap(criteria, '|', makeNamedCrit);
  return maybeDescrArg(descr, function expect(d, x) {
    var done, why, nope = [];
    revCritGroups.forEach(function (cgr) {
      if (done) { return; }
      why = null;
      cgr.forEach(function (c) {
        if (why || c.f(x)) { return; }
        why = c.n;
      });
      if (why) { nope.push(why); } else { done = true; }
    });
    if (done) { return x; }
    fail(d, criteria, nope.join(' | '), x);
  });
}


mustBe.prop = function propMustBe(o, c, p, d) {
  if (arguments.length <= 2) { return bindArgs(propMustBe, arguments); }
  var v = ((o && objHas.call(o, p)) ? o[p] : d);
  return mustBe(c)(String(o) + ': "' + String(p) + '"', v);
};


mustBe.getter = function getMustBe(get, descr, rule, key, dflt) {
  return mustBe(rule)(descr + ': "' + String(key) + '"', get(key, dflt));
};


mustBe.finNum = mustBe('fin num');
mustBe.near = mustBe('nonEmpty ary');
mustBe.nest = mustBe('nonEmpty str');
[
  'ary',
  'bool',
  'dictObj',
  'fun',
  'obj',
].forEach(function shortcut(rule) { mustBe[rule] = mustBe(rule); });


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
