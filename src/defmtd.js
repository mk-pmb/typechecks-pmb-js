/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var EX = {};

EX.fromDict = function defMtdFromDict(dest, dict) {
  Object.keys(dict).forEach(function add(k) {
    var f = dict[k];
    if (f.substr) { f = dict[f]; }
    dest[k] = f;
  });
  return dest;
};


module.exports = EX;
