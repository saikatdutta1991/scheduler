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
      code: Joi.string().min(3).max(36),
      name: Joi.string().max(128),
      description: Joi.string().max(512),
      latitude: Joi.string().pattern(/^(-?\d+(\.\d+)?)$/),
      longitude: Joi.string().pattern(/^\s*(-?\d+(\.\d+)?)$/),
      addressLine1: Joi.string().max(256),
      addressLine2: Joi.string().max(256),
      city: Joi.string().max(64),
      country: Joi.string().max(32),
      zip: Joi.string().max(15),
      timezone: Joi.string().valid("Asia/Kolkata", "America/Los_Angeles"),
      openTime: Joi.string().pattern(/^[0-9][0-9]:[0-9][0-9]:[0-9][0-9]$/),
      closeTime: Joi.string().pattern(/^[0-9][0-9]:[0-9][0-9]:[0-9][0-9]$/),
    };
  }
}

module.exports = Location;
