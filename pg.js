console.log("start");


var knex = require('knex')({
  client: 'pg',
  version: '7.2',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'example',
    database: 'ndi'
  }
});
var pg = require('knex')({ client: 'pg' });


console.log("end");
