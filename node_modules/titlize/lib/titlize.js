(function() {
  'use strict';

  function titlize(s) {
    var title = s.replace(SPLIT_RE, _titlize);
    return title.slice(0,title.length-1);
  }

  var SPLIT_RE = /(\S+)(\s+|\s*$)/g;
  var SPACE = ' ';
  var ARTICLES = 'a an the';
  var CONJUNCTIONS = 'and but for nor or so yet';
  var PREPOSITIONS = 'ago at by for from in into next of off on onto out over past till to';
  var EXCEPTIONAL = SPACE + [ARTICLES, CONJUNCTIONS, PREPOSITIONS].join(SPACE) + SPACE;

  function _titlize(match, word) {
    /* jshint curly:false */
    if (!isExceptional(word)) word = camelCase(word);
    return word + SPACE;
  }

  function isExceptional(s) {
    return EXCEPTIONAL.indexOf(SPACE + s + SPACE) >= 0;
  }

  function camelCase(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  if (module && module.exports) {
    module.exports = titlize;
  } else {
    window.titlize = titlize;
  }
})();
