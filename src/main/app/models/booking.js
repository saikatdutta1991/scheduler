const Base = require("./base");
const Joi = require("@hapi/joi");

class Booking extends Base {
  static get tableName() {
    return "bookings";
  }

  static get validationRules() {
    return {
      id: Joi.string().uuid(),
      locationId: Joi.string().uuid(),
      serviceId: Joi.string().uuid(),
      resourceId: Joi.string().uuid(),
      guestId: Joi.string().uuid(),
      type: Joi.string().valid(
        constants.booking.type.BLOCK,
        constants.booking.type.APPOINTMENT
      ),
      isInitiated: Joi.boolean(),
      isReserved: Joi.boolean(),
      isConfirmed: Joi.boolean(),
      isCanceled: Joi.boolean(),
      note: Joi.string().min(1).max(512),
    };
  }

  static relationMappings = {
    guest: {
      relation: Base.BelongsToOneRelation,
      modelClass: `${__dirname}/guest`,
      join: {
        from: "bookings.guestId",
        to: "guests.id",
      },
    },
  };
}

module.exports = Booking;
