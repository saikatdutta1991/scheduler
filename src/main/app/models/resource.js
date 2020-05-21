const _ = require("lodash");
const Base = require("./base");

class Resource extends Base {
  static get tableName() {
    return "resources";
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
