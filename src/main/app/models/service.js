const _ = require("lodash");
const Base = require("./base");
const Joi = require("@hapi/joi");

class Service extends Base {
  static get tableName() {
    return "services";
  }

  static get validationRules() {
    return {
      id: Joi.string().uuid(),
      code: Joi.string().min(3).max(36),
      name: Joi.string().max(128),
      description: Joi.string().max(512),
      duration: Joi.number().min(15),
    };
  }
}

module.exports = Service;
