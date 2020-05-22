const _ = require("lodash");
const Base = require("./base");
const Joi = require("@hapi/joi");

class Location extends Base {
  static get tableName() {
    return "locations";
  }

  static get validationRules() {
    return {
      id: Joi.string().uuid(),
    };
  }
}

module.exports = Location;
