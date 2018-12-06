
exports.up = function(knex, Promise) {
  knex.schema.createTable('users', function (table) {
    table.increments();
    table.string('username');
    table.string('name');
    table.string('email');
    table.string('password');
    table.timestamps();
  })
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('users');
};
