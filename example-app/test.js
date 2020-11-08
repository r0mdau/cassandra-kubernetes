var assert = require('assert');
var cassandra = require('cassandra-driver'); 
var authProvider = new cassandra.auth.PlainTextAuthProvider('cassandra', 'cassandra');
var contactPoints = ['cassandra-demo'];
var client = new cassandra.Client({contactPoints: contactPoints, authProvider: authProvider, keyspace:'grocery', localDataCenter: 'dc1'});

//Ensure all queries are executed before exit
function execute(query, params, callback) {
    client.execute(query, params, (err, result) => {
      if(err) {
        console.log(err);
      } else {
        callback(err, result);
      }
    });
}

//Execute the queries 
var query = 'SELECT name, price_p_item FROM grocery.fruit_stock WHERE name=? ALLOW FILTERING';
var q1 = execute(query, ['oranges'], (err, result) => { assert.ifError(err); console.log('The cost per orange is $' + result.rows[0].price_p_item)});
var q2 = execute(query, ['pineapples'], (err,result) => { assert.ifError(err); console.log('The cost per pineapple is $' + result.rows[0].price_p_item)});
var q3 = execute(query, ['apples'], (err,result) => { assert.ifError(err); console.log('The cost per apple is $' + result.rows[0].price_p_item)});
