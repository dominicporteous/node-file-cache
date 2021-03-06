var debug = require('debug')('node-file-cache'),
  fs = require('fs'),
  RSVP = require('rsvp');


module.exports = function(loc, ttl) {
  // Caching utilities.

  return {
    put: function(filename, data) {
      var path = loc + "/" + filename;
      debug("Save started to " + path + ".");
      
      return new RSVP.Promise(function(resolve, reject) {
        fs.writeFile(path, JSON.stringify(data), function(err) {
          if (err) {
            reject(err);
          } else {
            debug("Created local cache of " + filename + ".");
            resolve(data);
            
            debug("Removing file ("+path+") in "+ttl+" ms.");
            setTimeout(function(){
              debug("Removed file ("+path+")");
              fs.unlink(path, function(err) {
                if (err) {
                   debug("Error removing file ("+path+") :" + err.toString());
                }
              })
            }, ttl || 60000)
          }
        });
      })
    },

    get: function(filename) {
      var path = loc + "/" + filename;
      debug("Loading data from " + path + ".");
      
      return new RSVP.Promise(function(resolve, reject) {
        fs.readFile(path, function(err, data) {
          if (err) {
            reject(err);
          } else {
            debug("Loaded " + filename + " from cache.");
            resolve(JSON.parse(data));
          }
        });
      })
    }
  }
}
