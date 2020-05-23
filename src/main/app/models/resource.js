const _ = require("lodash");
const Joi = require("@hapi/joi");
const Base = require("./base");

class Resource extends Base {
  static get tableName() {
    return "resources";
  }

  static get validationRules() {
    return {
      id: Joi.string().uuid(),
      locationId: Joi.string().uuid(),
      firstName: Joi.string().min(1).max(128),
      lastName: Joi.string().min(1).max(128),
      email: Joi.string().email().min(1).max(128),
    };
  }

  static relationMappings = {
    events: {
      relation: Base.HasManyRelation,
      modelClass: `${__dirname}/event`,
      join: {
        from: "resources.id",
        to: "events.resourceId",
      },
    },
  };
}

module.exports = Resource;
