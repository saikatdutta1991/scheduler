const _ = require("lodash");
const Base = require("./base");

class Event extends Base {
  static get tableName() {
    return "events";
  }
}

module.exports = Event;