exports.up = async (knex) => {
  await knex.raw('create extension if not exists "uuid-ossp"');
  return knex.schema.createTable("events", function (table) {
    table
      .uuid("id")
      .notNullable()
      .primary()
      .defaultTo(knex.raw("uuid_generate_v4()"));
    table
      .uuid("locationId")
      .references("id")
      .inTable("locations")
      .onDelete("CASCADE");
    table
      .uuid("serviceId")
      .references("id")
      .inTable("services")
      .onDelete("CASCADE");
    table
      .uuid("resourceId")
      .references("id")
      .inTable("resources")
      .onDelete("CASCADE");
    table
      .uuid("guestId")
      .references("id")
      .inTable("guests")
      .onDelete("CASCADE");
    table.timestamp("startTime");
    table.timestamp("endTime");
    table.string("type", 32); // Ex: booking, holiday
    table.boolean("isConfirmed");
    table
      .timestamp("createdAt")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP"));
    table.timestamp("updatedAt").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
  });
};

exports.down = function (knex) {};
