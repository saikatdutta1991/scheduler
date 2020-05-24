const Base = require("./base");

class Booking extends Base {
  static get tableName() {
    return "bookings";
  }
}

module.exports = Booking;
