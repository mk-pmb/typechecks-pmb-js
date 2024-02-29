/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';


function lazyRepr(x) {
  var t = typeof x, s;
  try {
    s = String(x);
  } catch (e) {
    s = '[cannot stringify: ' + e + ']';
  }
  if (x && Array.isArray(x)) { return lazyRepr.ary(x, s); }
  s = lazyRepr.val(t, x, s);
  if (s === t) { return t; }
  return t + ' ' + s;
}


lazyRepr.val = function lazyReprVal(t, x, s) {
  if (t === s) { return s; } // null, undefined
  if (t === 'object') { return lazyRepr.obj(x, s); }
  if (t === 'function') { return s.split(/\s*(\{|\))/).slice(0, 2).join(''); }
  if (t === 'string') { return JSON.stringify(s); }
  return s;
};


lazyRepr.obj = function lazyReprObj(x, s) {
  if (!x) { return s; }
  if (s === '[object Object]') {
    s = Object.keys(x).join(', ');
    return '{' + (s && ' ') + s + (s && ' ') + '}';
  }
  return s;
};


lazyRepr.ary = function lazyReprObj(x, s) {
  var p = s.slice(0, 64);
  if (p !== s) { p += '…'; }
  return 'array<' + x.length + '> [' + p + ']';
};




module.exports = lazyRepr;
