const _ = require("lodash");
const Base = require("./base");

class Service extends Base {
  static get tableName() {
    return "services";
  }

  get $secureFields() {
    return [];
  }

  $formatJson(json, options) {
    json = super.$formatJson(json, options);
    return _.omit(json, this.$secureFields);
  }
}

module.exports = Service;
