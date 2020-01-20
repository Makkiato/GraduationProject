# caql-decompiler

Decompiles a [caql](https://github.com/kevinswiber/caql) AST into a plaintext query.

## Install

`npm install caql-decompiler`

## Example

```js
var Parser = require('caql');
var CaqlDecompiler = require('caql-decompiler');
var decompiler = new CaqlDecompiler();

var query =   'select name, founded_year, total_money_raised as worth '
            + 'where founded_year >= 1999 and name not like "%air%" '
            + 'order by founded_year desc, name';

var ast = Parser.parse(query);

var ql = decompiler.decompile(ast);

console.log(ql);

// Output:
//
// select name, founded_year, total_money_raised as worth where 
// ( founded_year >= 1999 and name not like "%air%" ) order by founded_year desc, name asc
 
```

## License

MIT
