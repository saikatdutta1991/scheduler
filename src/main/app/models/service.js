const _ = require("lodash");
const Base = require("./base");

class Service extends Base {
  static get tableName() {
    return "services";
  }
}

module.exports = Service;
