<<<<<<< HEAD
=======
process.EventEmitter = require('events').EventEmitter; // add this line
>>>>>>> 6d004e246468fb01c063fe7a2c0cfe6100513e17
var zetta = require('zetta');

zetta()
  .name('Server Name')
  .listen(8888, function(){
     console.log('Zetta is running at http://127.0.0.1:1337');
});