var util = require('util');
var Writable = require('stream').Writable;

var BinaryStream = module.exports = function(queueName, options, pubsub) {
  Writable.call(this, options);
  this.queueName = queueName;
  this._pubsub = pubsub;
  this.enabled = true;
};
util.inherits(BinaryStream, Writable);

BinaryStream.prototype._write = function(data, encoding, callback) {
  if(this.enabled) {
    this._pubsub.publish(this.queueName, data);
  }
  callback();
};
