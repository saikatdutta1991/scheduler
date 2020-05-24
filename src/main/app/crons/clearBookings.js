const cron = require("node-cron");
const moment = require("moment");
const BookingModel = require("../models/booking");
const Logger = require("../commons/logger");

cron.schedule("* * * * *", () => {
  Logger.info("clearBooking started.");
  Logger.info(
    `Clearing booking initiated before ${moment.utc().add(-20, "minutes")}`
  );
  // Delete all apoitment bookings expired 20 minutes.
  BookingModel.query()
    .where({ type: constants.booking.type.APPOINTMENT })
    .where(function () {
      this.where({ isConfirmed: false }).orWhere({ isConfirmed: null });
    })
    .where("createdAt", "<", moment.utc().add(-20, "minutes"))
    .delete()
    .then(() => {
      Logger.info("clearBooking ended.");
    });
});
