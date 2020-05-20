const _ = require("lodash");
const Base = require("./base");

class Resource extends Base {
  static get tableName() {
    return "resources";
  }

  get $secureFields() {
    return [];
  }

  $formatJson(json, options) {
    json = super.$formatJson(json, options);
    return _.omit(json, this.$secureFields);
  }
}

module.exports = Resource;
