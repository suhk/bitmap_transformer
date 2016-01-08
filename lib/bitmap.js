var fs = require('fs');
var config = {};

fs.readFile(process.argv[2], function(err, bitmap) {
  config.type = bitmap.toString('utf8', 0, 2);
  config.size = bitmap.readUInt32LE(2);
  config.startPixel = bitmap.readUInt32LE(10);
  config.width = bitmap.readUInt32LE(18);
  config.height = bitmap.readUInt32LE(22);
  config.colorNum = bitmap.readUInt32LE(46);
  config.bpp = bitmap.readUInt16LE(28);

  exports.bitmap_before = bitmap;
  blueify(bitmap);

  fs.writeFile(process.argv[3], bitmap, function() {
    exports.config = config;
    exports.bitmap_after = bitmap;
  });
});

var darken = function(buffer) {
  for(var i = config.startPixel; i < buffer.length; i += config.bpp / 8) {
    buffer[i] = buffer[i] / 2;
  }
};

var blueify = function(buffer) {
  for(var i = config.startPixel; i < buffer.length; i += config.bpp / 8) {
    if(config.bpp == 32) {
      buffer[i] = buffer[i] | parseInt('000000FF', 16);
    }
    if(config.bpp == 24) {
      buffer[i] = buffer[i] | parseInt('0000FF', 16);
    }
  }
};
