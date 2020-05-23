const Base = require("./base");
const Joi = require("@hapi/joi");

class Guest extends Base {
  static get tableName() {
    return "guests";
  }

  static get validationRules() {
    return {
      id: Joi.string().uuid(),
      firstName: Joi.string().min(1).max(128),
      lastName: Joi.string().min(1).max(128),
      email: Joi.string().email().min(1).max(128),
    };
  }
}

module.exports = Guest;
