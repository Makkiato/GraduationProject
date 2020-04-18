var util = require('util');
var Writable = require('stream').Writable;

var ObjectStream = module.exports = function(queueName, options, pubsub) {
  Writable.call(this, options);
  this._writableState.objectMode = true;
  this.queueName = queueName;
  this._pubsub = pubsub;
  this.enabled = true;
};
util.inherits(ObjectStream, Writable);

ObjectStream.prototype._write = function(data, encoding, callback) {
  var json = ObjectStream.format(this.queueName, data);
  if(this.enabled) {
    this._pubsub.publish(this.queueName, json );
  }
  callback();
};

ObjectStream.format = function(queueName, data) {
  var json = {
    topic: queueName,
    timestamp: new Date().getTime(),
    data: data
  };

  return json;
};
