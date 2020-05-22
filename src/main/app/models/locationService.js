const _ = require("lodash");
const Base = require("./base");

class LocationService extends Base {
  static get tableName() {
    return "location_services";
  }
}

module.exports = LocationService;
