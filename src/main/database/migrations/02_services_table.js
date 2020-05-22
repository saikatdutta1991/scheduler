exports.up = async (knex) => {
  await knex.raw('create extension if not exists "uuid-ossp"');
  return knex.schema.createTable("services", function (table) {
    table
      .uuid("id")
      .notNullable()
      .primary()
      .defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("code", 36);
    table.string("name", 128);
    table.string("description", 512);
    table.integer("duration");
    table
      .timestamp("createdAt")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP"));
    table.timestamp("updatedAt").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
  });
};

exports.down = function (knex) {};
