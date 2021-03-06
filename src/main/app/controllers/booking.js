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
        this.where({ isCanceled: false }).orWhere({ isCanceled: null });
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

  static async reserveAndConfirm(req, res) {
    const { id } = req.params;
    const {
      action,
      data: { slotTime, guestId, note },
    } = req.body;

    // Fetch booking if status init and type appointment
    const booking = await BookingModel.query()
      .where({
        id,
        type: constants.booking.type.APPOINTMENT,
        isInitiated: true,
      })
      .where(function () {
        this.where({ isCanceled: false }).orWhere({ isCanceled: null });
      })
      .first();

    if (!booking) {
      throw Boom.notFound(`Booking not found`);
    }

    switch (action) {
      case "reserve":
        // Check if booking is reserved already
        if (booking.isReserved === true) {
          throw Boom.badRequest(`Booking is reserved already.`);
        }

        const reservedBooking = await BookingHelper.reserveBooking(
          booking,
          slotTime
        );
        return sendResponse(res, codes.OK, "OK", "Booking reserved", {
          reservedBooking,
        });
        break;

      case "confirm":
        // Check if booking is reserved already
        if (booking.isConfirmed === true) {
          throw Boom.badRequest(`Booking is confirmed already.`);
        }

        const confirmedBooking = await BookingHelper.confirmBooking(
          booking,
          guestId,
          note
        );
        return sendResponse(res, codes.OK, "OK", "Booking confirmed", {
          confirmedBooking,
        });
        break;
    }
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

// Reserve and confirm validators
Booking.reserveAndConfirm.validators = [
  validator.params(
    Joi.object({
      id: BookingModel.validationRules.id.required(),
    })
  ),
  validator.body(
    Joi.object({
      action: Joi.string().valid("reserve", "confirm").required(),
      data: Joi.when("action", [
        {
          is: "reserve",
          then: Joi.object({
            slotTime: Joi.date().utc().iso().required(),
          }).required(),
        },
        {
          is: "confirm",
          then: Joi.object({
            guestId: BookingModel.validationRules.guestId.optional(),
            note: BookingModel.validationRules.note.required(),
          }).required(),
        },
      ]).required(),
    })
  ),
  ifExists(BookingModel, {
    key: "id",
    path: "param.id",
  }),
  ifExists(GuestModel, {
    key: "id",
    path: "body.data.guestId",
    isOptional: true,
  }),
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
