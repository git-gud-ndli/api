exports.up = function(knex, Promise) {
  return knex.schema
    .renameTable("todos", "todo_items")
    .createTable("todo_lists", table => {
      table
        .uuid("id")
        .unique()
        .defaultTo(knex.raw("gen_random_uuid()"))
        .primary();
      table.string("name");
      table
        .uuid("owner_id")
        .references("users.id")
        .onDelete("CASCADE");
      table.timestamps();
    })
    .table("todo_items", table => {
      table.dropColumn("user_id");
      table
        .uuid("list_id")
        .references("todo_lists.id")
        .onDelete("CASCADE");
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .table("todo_items", table => {
      table
        .uuid("user_id")
        .references("users.id")
        .onDelete("CASCADE");
      table.dropColumn("list_id");
    })
    .dropTable("todo_lists")
    .renameTable("todo_items", "todos");
};
