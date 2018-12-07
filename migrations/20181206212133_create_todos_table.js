exports.up = function(knex, Promise) {
  return knex.schema.createTable("todos", function(table) {
    table
      .uuid("id")
      .unique()
      .defaultTo(knex.raw("uuid_generate_v4()"))
      .primary();
    table.string("name");
    table.boolean("checked");
    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("todos");
};
