var Express = null
  , App = null
  , Fs = require('fs')
  , app_dir = process.cwd()
    CONTROLLERS = {};

// Others
var data = {};

// Cloudvisio Framework
var Cloudvisio = function(appname) {
  this._libs = "";
}

// Cloudvisio Framework Init
Cloudvisio.prototype.init = function(cb) {
  console.log("presented with cloudvisio"); 
  // Boot Libraries
  this._libs = bootLibs();
  // Create Global Namespace using application name
  // NOTE : Checks required to make sure programming constructs
  // are not used as app name
  GLOBAL["cloudvisio"] = {lib: this._libs, vars: {}};
  // Execute Callback
  if(typeof cb === 'function')
    cb(GLOBAL["cloudvisio"]);
    
}


/**
 * Boots all Library files fron lib folders
 *
 * @return libs (Object) - Object of exposed lib
 *
 */
var bootLibs = function() {
  var libs = {};
  
  var files = Fs.readdirSync(app_dir + '/lib');

  files.forEach(function(file){
    console.log('loading lib =>', file);
    var methods = require(app_dir + "/lib/" + file.replace('.js', ''));
    Object.keys(methods).map(function(method){
      libs[method] = methods[method];
    });
  });
  
  return libs;
}