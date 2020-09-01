const mysql = require("mysql");
var connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "fiware",
  password: "fiware",
  database: "fiwareWeb",
});

connection.connect(function (err) {
  if (err) console.log(err);
  else {
    console.log("connected");
  }
});

function addItem(item) {
  var id = item.id;
  var type = item.type;
  delete item.id;
  delete item.type;

  var query = `insert into history values ("${id}","${type}",now(),'${JSON.stringify(
    item
  )}',0)`;
  console.log(query);
  connection.query(query, function (err, rows, field) {
    if (err) throw err;
    //console.log(rows[0].solution);
    else {
      console.log("added item");
      console.log(rows);
    }
  });
}

function findItem(id, num, callback) {
  var query = `select * from history where(id = "${id}") order by time desc limit ${num}`;
  connection.query(query, function (err, rows, field) {
    if (err) throw err;
    else {
      
      callback(rows);
    }
  });
}

function findAllLatest(callback) {
  var toReturn = []
  var query = `select id from history group by id`;
  connection.query(query, function (err, rows, field) {
    if (err) throw err;
    else {
      rows.forEach( (ele) => {
        findItem(ele.id,1,function (data){
          toReturn = toReturn.concat(data)
        })
      })
      callback(toReturn);
    }
  });
}

module.exports.findAllLatest = findAllLatest;
module.exports.addItem = addItem;
module.exports.findItem = findItem;
