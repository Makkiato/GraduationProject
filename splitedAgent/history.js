var record = {};

var maximumRecord = 10;

/*
    id : {        
        type
        agent
        row {
            name
            value []

        }
        column{
            name[]
            value [[]]
        }
    }
*/
function init(config) {
  maximumRecord = config.maximumRecord;
}

function add(object, row, column) {
  var target = record[object.id];
  if (target == undefined) {
    target = {
      type: object.type,
      agent: object.agent,
      row: row,
      column: column,
    };
    record[object.id] = target;
  } else {
    if (target.row.value.length >= maximumRecord) {
      target.row.value.shift();
      target.column.value.shift();
    }
    target.row.value.push(row.value[0]);

    var order = target.column.name
    var sorted = []
    var sortedOrder = []
    order.forEach( element => {
      var idx = column.name.findIndex(ele => {return element == ele})
      sortedOrder.push(column.name[idx])
      sorted.push(column.value[0][idx])
    })

    target.column.value.push(sorted);

    console.log('original order : '+column.name)
    console.log('standard order : '+target.column.name)
    console.log('sorted order : '+sortedOrder)
  }
  return JSON.parse(JSON.stringify(target));
}

function get(object) {
  var target = record[object.id];
  return JSON.parse(JSON.stringify(target));
}

function sortColumn(column) {
  //deprecated
  var original = {
    name: JSON.parse(JSON.stringify(column.name)),
    value: JSON.parse(JSON.stringify(column.value)),
  };
  column.name.sort();

  for (var i = 0; i < original.name.length; i++) {
    var label = original.name[i];
    var idx = column.name.findIndex(function (ele) {
      return ele == label;
    });

    console.log(`${original.name[i]},${i} : ${column.name[idx]},${idx}`);
    //console.log(column.value)
    for (var j = 0; j < original.value.length; j++) {
      console.log(`${original.value[j]} : ${column.value[j]}`);
      column.value[j][idx] = original.value[j][i];
    }
  }
}
function test() {
  var test = {
    id: "test",
    type: "test",
    agent: "test",
    row: {
      name: "test",
      value: [1, 2, 3],
    },
    column: {
      name: ["one", "two", "three", "four", "five"],
      value: [
        [1, 2, 3, 4, 5],
        [11, 22, 33, 44, 55],
        [111, 222, 333, 444, 555],
      ],
    },
  };

  console.log(JSON.stringify(test.column));

  add(
    { test: test.id, type: test.type, agent: test.agent },
    test.row,
    test.column
  );
  add(
    { test: test.id, type: test.type, agent: test.agent },
    { name: "test", value: [4] },
    {
      name: ["one", "two", "three", "four", "five"],
      value: [[1111, 2222, 3333, 4444, 5555]],
    }
  );

  console.log(JSON.stringify(get(test.id)));
}

module.exports.add = add;
module.exports.get = get;
module.exports.init = init;
module.exports.test = test;
