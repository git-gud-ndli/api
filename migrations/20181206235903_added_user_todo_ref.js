exports.up = function(knex, Promise) {
  return knex.schema.table("todos", function(table) {
    table.uuid("user_id");
    table
      .foreign("user_id")
      .references("users.id")
      .onDelete("CASCADE");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("todos", function(table) {
    table.dropForeign("user_id");
    table.dropColumn("user_id");
  });
};
