/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

function nameFail(msg) { throw new Error(msg + nameFail.hint); }
nameFail.hint = ('\nPackage typechecks-pmb requires that its functions'
  + ' have their proper names. Please use a JavaScript engine that supports'
  + ' function names, and/or make your minifier/obfuscator not strip them.');

var EX = function defMtd(dest, f) {
  var a;
  if (f.forEach) {
    a = f.slice(0, -1);
    f = f.slice(-1)[0];
  }
  if (!f.name) { nameFail('Function must have a name!'); }
  dest[f.name] = f;
  if (a) { a.forEach(function (n) { dest[n] = f; }); }
  return dest;
};

if (EX.name !== 'defMtd') { nameFail('defMtd was renamed!'); }

EX.multi = function defMtdMulti(dest, spec) { return spec.reduce(EX, dest); };


module.exports = EX;
