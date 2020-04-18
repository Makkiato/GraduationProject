var Parser = require('caql');
var CaqlDecompiler = require('caql-decompiler');

module.exports = function(query) {
  var q = query.build();
  var decompiler = new CaqlDecompiler();

  var ast;
  if (q.type === 'ql') {
    if (q.value.params) {
      decompiler.params = q.value.params;
    }

    ast = Parser.parse(q.value.ql);
  } else if (q.type === 'ast') {
    ast = q.value;
  }

  return decompiler.decompile(ast);
};
