exports.up = async (knex) => {
  await knex.raw('create extension if not exists "uuid-ossp"');
  return knex.schema.createTable("locations", function (table) {
    table
      .uuid("id")
      .notNullable()
      .primary()
      .defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("code", 36);
    table.string("name", 128);
    table.string("description", 512);
    table.decimal("latitude", 11, 8).defaultTo(0.0);
    table.decimal("longitude", 11, 8).defaultTo(0.0);
    table.string("addressLine1", 256);
    table.string("addressLine2", 256);
    table.string("city", 64);
    table.string("country", 32);
    table.string("zip", 15);
    table.string("timezone", 32);
    table.time("openTime");
    table.time("closeTime");
    table
      .timestamp("createdAt")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP"));
    table.timestamp("updatedAt").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
  });
};

exports.down = function (knex) {};
