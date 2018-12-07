exports.up = function(knex, Promise) {
  return knex.schema
    .raw('CREATE EXTENSION "uuid-ossp";')
    .createTable("users", function(table) {
      table
        .uuid("id")
        .unique()
        .defaultTo(knex.raw("uuid_generate_v4()"))
        .primary();
      table.string("username").unique();
      table.string("name");
      table.string("email").unique();
      table.string("password");
      table.timestamps();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("users");
};
