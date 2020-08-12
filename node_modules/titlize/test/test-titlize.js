var titlize = require('../lib/titlize');

exports['skip articles'] = function(test) {
  var s = 'a an the';
  test.equal(titlize(s), s);
  test.done();
}

exports['skip coordinating conjunctions'] = function(test) {
  var s = 'and but nor';
  test.equal(titlize(s), s);
  test.done();
}

exports['skip prepositions (fewer than five letters)'] = function(test) {
  var s = 'on at to from next by';
  test.equal(titlize(s), s);
  test.done();
}

exports['process others'] = function(test) {
  var s = 'capitalization rules for titles';
  test.equal(titlize(s), 'Capitalization Rules for Titles');
  test.done();
}
