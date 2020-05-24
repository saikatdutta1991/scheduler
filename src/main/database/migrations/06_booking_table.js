exports.up = async (knex) => {
  await knex.raw('create extension if not exists "uuid-ossp"');
  return knex.schema.createTable("bookings", function (table) {
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
    table.string("type", 32); // Ex: appointment|block
    table.boolean("isInitiated").defaultTo(true);
    table.boolean("isReserved").defaultTo(false);
    table.boolean("isConfirmed").defaultTo(false);
    table.boolean("isCanceled").defaultTo(false);
    table.timestamp("canceledAt");
    table.string("note", 512);
    table
      .timestamp("createdAt")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP"));
    table.timestamp("updatedAt").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
  });
};

exports.down = function (knex) {};
