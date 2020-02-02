var util = require('util');
var Readable = require('stream').Readable;

var ConsumerStream = module.exports = function(queueName, options, pubsub) {
  Readable.call(this, options);
  this.queueName = queueName;
  this._pubsub = pubsub;
  this._reading = true;

  var self = this;
  this._pubsub.subscribe(this.queueName, function(topic, data) {
    if (self._reading && !self.push(data)) {
      self._reading = false;
    }
  });
};
util.inherits(ConsumerStream, Readable);

ConsumerStream.prototype._read = function(size) {
  this._reading = true;
};
