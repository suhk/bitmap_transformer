var bitmap = require(__dirname + '/../lib/bitmap.js');
var mocha = require('mocha');
var expect = require('chai').expect;

describe('bitmap.darken unit', function(){
  it('should return a buffer', function(){
    // if config exists, use it, otherwise set to null
    var config = config ? config : {};
    config.startPixel = 0;
    config.bpp = 32;
    var testbuffer = new Buffer('22222222', 'hex');
    var resultbuffer = new Buffer('11111111', 'hex');
    expect(bitmap.darken(testbuffer)).to.eql(testbuffer);
  });
});

describe('bitmap.flip unit', function(){
    it('should flip low values high', function(){
      var flipbuf = new Buffer('FFFFFFFF', 'hex');
      var highbuffer = new Buffer('00000000', 'hex');
      expect(bitmap.flip(highbuffer)).to.eql(flipbuf);
    });
});
