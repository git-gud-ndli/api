const pg = require("knex")(require("./knexfile").development);
const bookshelf = require("bookshelf")(pg);

const User = bookshelf.Model.extend({
  tableName: "users",
  lists() {
    return this.hasMany(TodoList, "owner_id");
  },
});

const TodoList = bookshelf.Model.extend({
  tableName: "todo_lists",
  owner() {
    return this.belongsTo(User, "owner_id");
  },
  items() {
    return this.hasMany(TodoItem, "list_id");
  },
});

const TodoItem = bookshelf.Model.extend({
  tableName: "todo_items",
  list() {
    return this.belongsTo(TodoList, "list_id");
  },
});

const TodoItems = bookshelf.Collection.extend({
  model: TodoItem,
});

module.exports = {
  User,
  TodoItem,
  TodoItems,
  TodoList,
};
