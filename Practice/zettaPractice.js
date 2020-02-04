
process.EventEmitter = require('events').EventEmitter; // add this line

var zetta = require('zetta');

zetta()
  .name('Server Name')
  .listen(8888, function(){
     console.log('Zetta is running at http://127.0.0.1:1337');
});