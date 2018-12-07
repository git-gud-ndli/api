const pg = require("knex")(require("./knexfile").development);
const bookshelf = require("bookshelf")(pg);

const User = bookshelf.Model.extend({
  tableName: "users",
  lists: function() {
    return this.hasMany(TodoList, "user_id");
  },
});

const TodoList = bookshelf.Model.extend({
  tableName: "todo_lists",
  owner: function() {
    return this.belongsTo(User);
  },
});

const TodoItem = bookshelf.Model.extend({
  tableName: "todo_items",
  list: function() {
    return this.belongsTo(TodoList);
  },
});

module.exports = {
  User,
  TodoItem,
  TodoList,
};
