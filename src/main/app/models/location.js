const _ = require("lodash");
const Base = require("./base");

class Location extends Base {
  static get tableName() {
    return "locations";
  }
}

module.exports = Location;
