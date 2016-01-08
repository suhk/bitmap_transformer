var bitmap = require (__dirname + '/../lib/bitmap.js');
var expect = require ('chai').expect;
chai.use(require('chai-fs'));

describe ('Bestest bitmap transformer evar', function(){
  it('path should exist', function(){
    expect('./../lib/white.bmp').to.be.a.path('hey i\'m a path');
  });
});
