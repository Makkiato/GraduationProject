var Parser = require('caql');
var CaqlDecompiler = require('./decompiler');
var decompiler = new CaqlDecompiler();

var query =   'select name, founded_year, total_money_raised as worth '
            + 'where type is missing and founded_year >= 1999 and name not like "%air%" '
            + 'order by founded_year desc, name';

var ast = Parser.parse(query);

var ql = decompiler.decompile(ast);

console.log(ql);
