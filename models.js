const pg = require("knex")(require("./knexfile").development);
const bookshelf = require("bookshelf")(pg);

const User = bookshelf.Model.extend({
  tableName: "users",
  lists: function() {
    return this.hasMany(Todo, "user_id");
  }
});

const Todo = bookshelf.Model.extend({
  tableName: "todos",
  owner: function() {
    return this.belongsTo(User);
  }
});

module.exports = {
  User,
  Todo
};
