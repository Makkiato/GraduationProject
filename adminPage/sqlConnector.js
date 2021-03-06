const mariadb = require("mariadb");
const { test } = require("./history");

function init() {
  const pool = mariadb.createPool({
    host: "127.0.0.1",
    user: "fiware",
    password: "fiware",
    database: "fiwareWeb",
  });
  /*
  pool.getConnection().then((conn) => {
    conn.query("select now()").then((rows) => {
      console.log(rows);
    });
  });*/

  pool.addItem = (item) => {
    var id = item.id;
    var type = item.type;
    delete item.id;
    delete item.type;

    var queryDevice = `insert into device(id,type,did) select * from (select "${id}", "${type}", 0) as tmp where not exists (select did from device where (id = "${id}" and type = "${type}")) limit 1`;
    var queryHistory = `insert into history(did,time,value,tid) select did,now(),'${JSON.stringify(
      item
    )}',0 from device where (id = "${id}" and type = "${type}")`;

    //console.log(`device query : ${queryDevice}`);
    //console.log(`history query : ${queryHistory}`);
    pool
      .query(queryDevice)
      .then((deviceRows) => {
        pool
          .query(queryHistory)
          .then((historyRows) => {
            //console.log("added item");
            //console.log(deviceRows);
            //console.log(historyRows);
          })
          .catch((err) => {
            console.log(err);
            console.log("table history failure");
          });
      })
      .catch((err) => {
        console.log(err);
        console.log("table device failure");
      });
  };

  pool.findItem = (id, type, num, callback) => {
    var query = `select id,type,value,time from history h, device d where(h.did = d.did and id = "${id}" and type = "${type}") order by time desc limit ${num}`;
    pool
      .query(query)
      .then((rows) => {
        delete rows.meta;
        rows.forEach((row) => {
          row.time = new Date(row.time).toString().split("GMT")[0];
        });
        console.log(rows);
        callback(rows);
      })
      .catch((err) => {
        console.log(err);
        console.log("search query failure");
      });
  };
  /*
  pool.findValuesInSameType = (id, type, valueName, callback) => {
    var sameTypeQuery = `select d2.did from (select d1.type as targetType, d1.did as did from device d1 where d1.id = '${id}') target, device d2 where target.targetType = d2.type and target.did != d2.did`;

    pool
      .query(sameTypeQuery)
      .then((sameTypes) => {
        var axisQuery = `select h.did, time, value from history h, device d where d.id = '${id}' and d.did = h.did order by time desc limit 10`;
        pool
          .query(axisQuery)
          .then((axis) => {
            delete sameTypes.meta;
            sameTypes.forEach((row) => {});
          })
          .catch((err) => {
            console.log(err);
            console.log("axis search failure");
          });
      })
      .catch((err) => {
        console.log(err);
        console.log("same type search failure");
      });

    var query = `select id, json_value(h.value,'$.${valueName})`;
  };
*/
  return pool;
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
  var toReturn = [];
  var query = `select id from history group by id`;
  connection.query(query, function (err, rows, field) {
    if (err) throw err;
    else {
      rows.forEach((ele) => {
        findItem(ele.id, 1, function (data) {
          toReturn = toReturn.concat(data);
        });
      });
      callback(toReturn);
    }
  });
}
/*
const pool = init()
/*pool.addItem({
    id : 'mariaTestItem',
    type : 'testObj',
    pressure : 61.6,
    temperature : 13.5
  })
pool.findItem(
  'mariaTestItem',
  2,
  (rows) => {
    console.log('search result')
    
    delete rows.meta
    console.log(rows)
    rows.forEach( ele => {
      console.log(ele)
    })
  }
)*/

module.exports.init = init;
//module.exports.findAllLatest = findAllLatest;
//module.exports.addItem = addItem;
//module.exports.findItem = findItem;
