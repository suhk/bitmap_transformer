exports = module.exports = {};
var fs = require('fs');
var config = {};
var tObj = {};

exports.darken = tObj.darken = function(buffer) {
  for(var i = config.startPixel; i < buffer.length; i += config.bpp / 8) {
    buffer[i] = buffer[i] / 2;
  }
  return buffer;
};

exports.blueify = tObj.blueify = function(buffer) {
  for(var i = config.startPixel; i < buffer.length; i += config.bpp / 8) {
    if(config.bpp == 32) {
      buffer[i] = 0xFF;
    }
    if(config.bpp == 24) {
      buffer[i] = 0xFF;
    }
  }
  return buffer;
};

exports.redden = tObj.redden = function(buffer) {
  for(var i = config.startPixel; i < buffer.length; i += config.bpp / 8) {
    if(config.bpp == 32) {
      buffer[i + 2] = 0xFF;
    }
    if(config.bpp == 24) {
      buffer[i + 2] |= 0xFF;
    }
  }
  return buffer;
};

exports.flip = tObj.flip = function(buffer) {
  if(config.bpp == 32){
    for(var i = config.startPixel; i < buffer.length; i += 4) {
      buffer[i] = ~buffer[i]; //invert the binary, skipping alpha
      buffer[i + 1] = ~buffer[i + 1];
      buffer[i + 2] = ~buffer[i + 2];
    }

  }
  if(config.bpp == 24){
    for(i = config.startPixel; i < buffer.length; i += 1) {
      buffer[i] = ~buffer[i]; //invert the binary
    }
  }
  return buffer;
};

exports.greenify = tObj.greenify = function(buffer){
  var mask;
  if(config.bpp == 32){
    mask = 0x0000FF00;
  }
  if(config.bpp == 24){
    mask = 0x00FF00;
  }
  var stepsize = config.bpp / 8;
  for(var i = config.startPixel; i < (buffer.length - stepsize); i += stepsize) {
    var tempB = buffer.readUInt32LE(i) | mask;
    tempB = tempB >>> 0;
    buffer.writeUInt32LE(tempB, i);
  }
  return buffer;
};

config.transformSelect = tObj.greenify; // set default to greenify in case command line is empty

exports.tokenizeArgs = function (){
  var commLine = [];
  for (var i = 0; i < process.argv.length; i++){
    commLine[i] = process.argv[i];
  }
  return commLine;
};


exports.findArgPairs = function (tArgs){
  var commLine = tArgs;

  /*eslint-disable */ //because it seems eslint hates switches

  for (var j = 0; j < commLine.length; j++){
    switch(commLine[j]){
    case '-i':
    config.inputFile = commLine[j + 1].toString();
    //console.log(config.inputFile);
    break;
    case '-o':
    config.outputFile = commLine[j + 1].toString();
    //console.log(config.outputFile);
    break;
    case '-t':
    if(commLine[j + 1] && (tObj.hasOwnProperty(commLine[j + 1]))) {
      config.transformSelect = tObj[commLine[j + 1]];
      break;
    }
    config.transformSelect = tObj.blueify; // if -t exists, default to blueify
    break;
    case '-h':
    case '/?':
    case '-h':
    case '-?':
    case '-help':
    console.log('Options are -i for input, -o for output, and -t for transformation.');
    process.exit(0);
    break; //I'm just here so I don't get linted.
    default:
    break;
    }
  }
  /*eslint-enable */
  //if user has not used the -i and -o, try using the number 3 and 4 arguments
  if(!config.inputFile){
    config.inputFile = process.argv[2];
  }
  if(!config.outputFile){
    config.outputFile = process.argv[3];
  }
  return config;
};

exports.run = function(){
  var tArgs = exports.tokenizeArgs();
  config = exports.findArgPairs(tArgs);

  fs.readFile(config.inputFile, function(err, bitmap) {
    config.type = bitmap.toString('utf8', 0, 2);
    config.size = bitmap.readUInt32LE(2);
    config.startPixel = bitmap.readUInt32LE(10);
    config.width = bitmap.readUInt32LE(18);
    config.height = bitmap.readUInt32LE(22);
    config.colorNum = bitmap.readUInt32LE(46);
    config.bpp = bitmap.readUInt16LE(28);

    config.transformSelect(bitmap);

    fs.writeFile(config.outputFile, bitmap, function() {});
  });
  return 0;
};
