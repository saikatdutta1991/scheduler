const _ = require("lodash");
const Base = require("./base");

class Event extends Base {
  static get tableName() {
    return "events";
  }

  get $secureFields() {
    return [];
  }

  $formatJson(json, options) {
    json = super.$formatJson(json, options);
    return _.omit(json, this.$secureFields);
  }
}

module.exports = Event;
