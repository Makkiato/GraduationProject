# calypso-query-decompiler

Decompiles Calypso Query objects into CaQL queries.

# Install

`npm install calypso-query-decompiler`

# Example

```js
var Query = require('calypso').Query;
var decompiler = require('calypso-query-decompiler');

var q = Query.of('companies')
  .ql('where name=@name and founded_year >= @year')
  .params({ name: 'Twitter', year: 1999 });

var decompiled = decompiler(q);

console.log(decompiled);

// Output: select * where ( name = "Twitter" and founded_year >= 1999 )
```

# License

MIT
