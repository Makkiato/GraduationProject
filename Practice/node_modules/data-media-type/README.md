# data-media-type

A Node.js module for finding IANA registered names for common data types.

See also:

* [`hypermedia-type`](https://github.com/kevinswiber/hypermedia-type) - contains common hypermedia types
* [`api-media-type`](https://github.com/kevinswiber/api-media-type) - combines data-media-type and hypermedia-type

## Install

`$ npm install data-media-type`

## Usage

```javascript
var http = require('http');
var DataMediaType = require('data-media-type');

http.createServer(function(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', DataMediaType.JSON);

  var body = {
    hello: 'world'
  };

  res.end(JSON.stringify(body));
}).listen(1337);
```

## Supported Media Types

* `DataMediaType.FORM_URLENCODED` => application/x-www-form-urlencoded
* `DataMediaType.JSON` => application/json
* `DataMediaType.MULTIPART_FORM_DATA` => multipart/form-data
* `DataMediaType.OCTET_STREAM` => application/octet-stream
* `DataMediaType.TEXT_PLAIN` => text/plain
* `DataMediaType.TEXT_XML` => text/xml
* `DataMediaType.XML` => application/xml

## License

MIT
