/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';


function lazyRepr(x) {
  var t = typeof x, s = lazyRepr.val(t, x);
  if (s === t) { return t; }
  return t + ' ' + s;
}


lazyRepr.val = function lazyReprVal(t, x) {
  var s;
  try {
    s = String(x);
  } catch (e) {
    s = '[cannot stringify: ' + e + ']';
  }
  if (t === s) { return s; } // null, undefined
  if (t === 'object') {
    if (s === '[object Object]') {
      s = Object.keys(x).join(', ');
      return '{' + (s && ' ') + s + (s && ' ') + '}';
    }
    return s;
  }
  if (t === 'function') {
    return s.split(/\s*(\{|\))/).slice(0, 2).join('');
  }
  if (t === 'string') { return JSON.stringify(s); }
  return s;
};



module.exports = lazyRepr;
