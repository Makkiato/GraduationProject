var Siren = function() {
  this.name = 'siren';
  this.mediaTypes = ['application/vnd.siren+json'];
  this.extension = '.siren.js';
  this.subdirectory = '/siren';
};

Siren.prototype.format = function(filename, locals, cb) {
  var template = require(filename);
  cb(null, template(locals));
};

module.exports = new Siren();
