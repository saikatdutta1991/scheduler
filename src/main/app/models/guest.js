const _ = require("lodash");
const Base = require("./base");

class Guest extends Base {
  static get tableName() {
    return "guests";
  }
}

module.exports = User;
