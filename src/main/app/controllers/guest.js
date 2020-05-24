const BaseController = require("./base");
const BookingModel = require("../models/booking");
const validator = require("../commons/validator");
const Joi = require("@hapi/joi");
const ifExists = require("../middlewares/ifExists");
const GuestModel = require("../models/guest");

class Guest extends BaseController {
  static get validatorOptionalRules() {
    return ["id"];
  }

  static async getBookings(req, res) {
    const { id: guestId } = req.params;
    const bookings = await BookingModel.query().where({ guestId });
    return sendResponse(res, codes.OK, "OK", "Bookings fetched", {
      bookings,
    });
  }
}

Guest.getBookings.validators = [
  validator.params(
    Joi.object({
      id: GuestModel.validationRules.id.required(),
    })
  ),
  ifExists(GuestModel, { key: "id", path: "params.id" }),
];

module.exports = Guest;
