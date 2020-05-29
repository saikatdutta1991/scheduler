const LocationModel = require("../models/location");
const ServiceModel = require("../models/service");
const ResourceModel = require("../models/resource");
const GuestModel = require("../models/guest");
const BookingModel = require("../models/booking");
const validator = require("../commons/validator");
const Joi = require("@hapi/joi").extend(require("@hapi/joi-date"));
const Boom = require("@hapi/boom");
const ifExists = require("../middlewares/ifExists");
const BookingHelper = require("../commons/helpers/booking");
const moment = require("moment");

class Booking {
  static async getBookings(req, res) {
    const { locationId, guestId, startDate, endDate } = req.query;

    // Fetch bookings from db
    let bookingsQuery = BookingModel.query()
      .withGraphJoined("guest")
      .where({
        isConfirmed: true,
        locationId,
      })
      .whereBetween("startTime", [
        moment(startDate).utc().startOf("day"),
        moment(endDate).utc().endOf("day"),
      ]);

    if (guestId) {
      bookingsQuery = bookingsQuery.where({ guestId });
    }

    const bookings = await bookingsQuery;

    return sendResponse(res, codes.OK, "OK", "Bookings fetched", {
      bookings,
    });
  }

  static async cancelBooking(req, res) {
    const { id } = req.params;
    const booking = await BookingModel.query()
      .where({
        id,
        type: constants.booking.type.APPOINTMENT,
        isInitiated: true,
        isReserved: true,
        isConfirmed: true,
      })
      .where(function () {
        this.where({ isCanceled: false }).where({ isCanceled: null });
      })
      .first();

    if (!booking) {
      throw Boom.notFound(`Booking not found`);
    }

    const canceledBooking = await BookingHelper.cancelBooking(booking);
    return sendResponse(res, codes.OK, "OK", "Booking canceled", {
      canceledBooking,
    });
  }

  static async confirmBooking(req, res) {
    const { id } = req.params;
    const { guestId, note } = req.body;

    // Fetch booking type appointment
    const booking = await BookingModel.query()
      .where({
        id,
        type: constants.booking.type.APPOINTMENT,
        isInitiated: true,
        isReserved: true,
        isConfirmed: false,
      })
      .first();

    if (!booking) {
      throw Boom.notFound(`Booking not found or expired or confirmed`);
    }

    const confirmedBooking = await BookingHelper.confirmBooking(
      booking,
      guestId,
      note
    );
    return sendResponse(res, codes.OK, "OK", "Booking confirmed", {
      confirmedBooking,
    });
  }

  static async reserveBooking(req, res) {
    const { id } = req.params;
    const { slotTime } = req.body;

    // Fetch booking if status init and type appointment
    const booking = await BookingModel.query()
      .where({
        id,
        type: constants.booking.type.APPOINTMENT,
        isInitiated: true,
        isReserved: false,
      })
      .first();

    if (!booking) {
      throw Boom.notFound(`Booking not found or expired or confirmed`);
    }

    const reservedBooking = await BookingHelper.reserveBooking(
      booking,
      slotTime
    );
    return sendResponse(res, codes.OK, "OK", "Booking reserved", {
      reservedBooking,
    });
  }

  static async getBookingSlots(req, res) {
    const { id } = req.params;
    const { withResourceId } = req.query;

    // Fetch booking if status init and type appointment
    const booking = await BookingModel.query()
      .where({
        id,
        type: constants.booking.type.APPOINTMENT,
        isInitiated: true,
        isReserved: false,
      })
      .first();

    if (!booking) {
      throw Boom.notFound(`Booking not found or expired or confirmed`);
    }

    const slots = await BookingHelper.getBookingSlots(booking, withResourceId);
    return sendResponse(res, codes.OK, "OK", "Booking slots", {
      slotsCount: slots.length,
      slots,
    });
  }

  static async generateBooking(req, res) {
    const { id: bookingId } = await BookingHelper.generateBookingId(req.body);
    return sendResponse(res, codes.OK, "OK", "Booking id generated", {
      bookingId,
    });
  }
}

// Get bookings validators
Booking.getBookings.validators = [
  validator.query(
    Joi.object({
      locationId: BookingModel.validationRules.locationId.required(),
      guestId: BookingModel.validationRules.guestId.optional(),
      startDate: Joi.date().format("YYYY-MM-DD").utc().required(),
      endDate: Joi.date().format("YYYY-MM-DD").utc().required(),
    })
  ),
];

// Get booking slots validation
Booking.getBookingSlots.validators = [
  validator.query(
    Joi.object({
      withResourceId: Joi.boolean().required(),
    })
  ),
  validator.params(
    Joi.object({
      id: BookingModel.validationRules.id.required(),
    })
  ),
];

// Cofirm booking validations
Booking.confirmBooking.validators = [
  validator.params(
    Joi.object({
      id: BookingModel.validationRules.id.required(),
    })
  ),
  validator.body(
    Joi.object({
      guestId: BookingModel.validationRules.guestId.optional(),
      note: BookingModel.validationRules.note.optional(),
    })
  ),
  ifExists(GuestModel, { key: "id", path: "body.guestId", isOptional: true }),
];

// Reserve booking validations
Booking.reserveBooking.validators = [
  validator.params(
    Joi.object({
      id: BookingModel.validationRules.id.required(),
    })
  ),
  validator.body(
    Joi.object({
      slotTime: Joi.date().utc().iso().required(),
    })
  ),
];

// Generate booking Validations
Booking.generateBooking.validators = [
  validator.body(
    Joi.object({
      locationId: LocationModel.validationRules.id.required(),
      serviceId: ServiceModel.validationRules.id.required(),
      resourceId: ResourceModel.validationRules.id.optional(),
      guestId: GuestModel.validationRules.id.optional(),
      date: Joi.date().format("YYYY-MM-DD").utc().required(),
    })
  ),
  ifExists(LocationModel, { key: "id", path: "body.locationId" }),
  ifExists(ServiceModel, { key: "id", path: "body.serviceId" }),
  ifExists(ResourceModel, {
    key: "id",
    path: "body.resourceId",
    isOptional: true,
  }),
  ifExists(GuestModel, {
    key: "id",
    path: "body.guestId",
    isOptional: true,
  }),
];

module.exports = Booking;
