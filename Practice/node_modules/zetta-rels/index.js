var base = 'http://rels.zettajs.io/';
function rel(name){
  return base + name;
}

exports.self = 'self';
exports.edit = 'edit';
exports.root = rel('root');
exports.monitor = 'monitor';
exports.peer = rel('peer');
exports.peerManagement = rel('peer-management');
exports.server = rel('server');
exports.device = rel('device');
exports.objectStream = rel('object-stream');
exports.binaryStream = rel('binary-stream');
exports.logStream = rel('log-stream');
exports.query = rel('query');
exports.metadata = rel('metadata');
exports.type = rel('type');
exports.instances = rel('instances');
exports.events = rel('events');
