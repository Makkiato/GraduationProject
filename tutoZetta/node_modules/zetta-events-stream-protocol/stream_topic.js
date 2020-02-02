var minimatch = require('minimatch-with-regex');
var Minimatch = minimatch.Minimatch;

// Zetta topics that don't follow {server}/{deviceType}/{deviceId}/{stream}
var SPECIAL = [
  /^_peer\/.+$/,
  /^query:.+$/,
  /^query\/.+$/,
  /^logs$/
];

var StreamTopic = module.exports = function() {
  this._original = null;
  this._mm = null;

  // Matches a special topic
  this.isSpecial = false;
  
  // Stream Query
  this.streamQuery = null;

  this._serverName = null;
  this._pubsubIdentifier = null;
};

StreamTopic.prototype.parse = function(topicString){
  if (typeof topicString !== 'string') {
    throw new TypeError('topic string must be a string');
  }

  if (topicString === '') {
    throw new Error('topic string must not be an empty string');
  }

  this._original = topicString;

  this.isSpecial = SPECIAL.some(function(regExp) {
    return regExp.exec(topicString);
  });

  // Using special topic
  if (this.isSpecial) {
    this._mm = new Minimatch(topicString, { nobrace: false, dot: true, noext: true });
    return;
  }

  // Reformat topic string to have server as * the topic as **
  if (topicString === '**') {
    topicString = '*/**';
  }

  // seperate streamQuery from topic
  var seperated = this._seperateStreamQuery(topicString);
  this._mm = new Minimatch(seperated.topic, { nobrace: false, dot: true, noext: true });
  this.streamQuery = seperated.streamQuery;

  // Parse server name from topic
  var serverName = this._mm.set[0][0];
  if (typeof serverName === 'string') {
    this._serverName = serverName;
  } else if (serverName instanceof RegExp) {
    this._serverName = serverName;
  } else if (typeof serverName === 'object' && Object.keys(serverName).length === 0) {
    // ** star case, make regexp to match everything
    this._serverName = '*';

    // Handle cases with leading **/some-topic
    // Check to make sure there is something after ** and make sure it's not just **/
    // If full topic is specified after ** dont add ** to begening. eg. "**/led/123/state"
    if (this._mm.set[0].length > 1 && this._mm.set[0].length < 4 && this._mm.set[0][1] !== '') {
      this._mm.set[0].unshift({});
    }
  }

  // Join the rest of the topic for the pubsub identifier without the servername
  var arr = [];
  for (var i=1; i<this._mm.set[0].length; i++) {
    var c = this._mm.set[0][i];
    if (typeof c === 'string') {
      arr.push(c);
    } else if (c instanceof RegExp) {
      arr.push(c._glob);
    } else if (typeof c === 'object' && Object.keys(c).length === 0) {
      arr.push('**');
    }
  }

  this._pubsubIdentifier = arr.join('/');
};

// Returns string format of the topic
StreamTopic.prototype.hash = function() {
  return this._original;
};

// Return topic but emitting the first path which is the serverName
StreamTopic.prototype.pubsubIdentifier = function() {
  if (this.isSpecial) {
    return this._original;
  } else {
    return this._pubsubIdentifier;
  }
};

StreamTopic.prototype.serverName = function(topicString) {
  if (this.isSpecial) {
    return null;
  } else {
    return this._serverName;
  }
};

StreamTopic.prototype.match = function(topicString) {
  return this._mm.match(topicString);
};

StreamTopic.parse = function(topicString) {
  var topic =  new StreamTopic();  
  topic.parse(topicString);
  return topic;
}

StreamTopic.prototype._seperateStreamQuery = function(topicString) {
  var ret = { topic: null, streamQuery: null };
  var idx = topicString.lastIndexOf('?');
  if (idx < 0) {
    ret.topic = topicString;
    return ret;
  }

  // make sure it's not in a regex
  var closeIdx = topicString.indexOf('}', idx);
  var openIdx = topicString.indexOf('{', 0);
  if (idx >openIdx && idx < closeIdx) {
    // Falls in a regex
    ret.topic = topicString;
    return ret;
  }

  ret.topic = topicString.slice(0, idx);
  ret.streamQuery = topicString.slice(idx+1);

  return ret;
};

