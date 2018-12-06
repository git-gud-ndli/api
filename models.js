const pg = require('knex')(require('./knexfile').development);
const bookshelf = require('bookshelf')(pg);

const User = bookshelf.Model.extend({
  tableName: 'users',
});

const Todo = bookshelf.Model.extend({
  tableName: 'todos',
});

module.exports = {
  User,
  Todo,
};
