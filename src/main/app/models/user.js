const _ = require("lodash");
const Base = require("./base");

class User extends Base {
  static get tableName() {
    return "users";
  }

  get $secureFields() {
    return [];
  }

  $formatJson(json, options) {
    json = super.$formatJson(json, options);
    return _.omit(json, this.$secureFields);
  }
}

module.exports = User;
