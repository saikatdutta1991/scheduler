const { raw } = require("objection");
const BookingModel = require("../../models/booking");
const LocationModel = require("../../models/location");
const ServiceModel = require("../../models/service");
const ResourceModel = require("../../models/resource");
const moment = require("moment");
const _ = require("lodash");
const Boom = require("@hapi/boom");

const cancelBooking = async (booking) => {
  // Cancel booking
  return await BookingModel.query().updateAndFetchById(booking.id, {
    isCanceled: true,
    canceledAt: moment().utc(),
  });
};

const confirmBooking = async (booking, guestId, note) => {
  // Confirm the booking
  return await BookingModel.query().updateAndFetchById(booking.id, {
    isConfirmed: true,
    guestId: booking.guestId || guestId,
    note,
  });
};

const reserveBooking = async (booking, slotTime) => {
  // Fetch service duration
  const duration = await getServiceDuration(booking.serviceId);
  const startTime = moment(slotTime).utc();
  const endTime = startTime.clone().add(duration, "minutes").add(-1, "seconds");

  // Check if current resouce is blocked, throw error
  let availResourceId = booking.resourceId;
  if (!availResourceId) {
    availResourceId = await getAvailableResources(
      booking.locationId,
      startTime,
      endTime
    );

    if (!availResourceId) {
      throw Boom.resourceGone("No resources are available.");
    }
  } else if (
    await isResouceBlocked(
      booking.locationId,
      availResourceId,
      startTime,
      endTime
    )
  ) {
    throw Boom.resourceGone(
      `Selected resouced id ${booking.resourceId} is blocked.`
    );
  }

  // Reserve the booking
  return await BookingModel.query().updateAndFetchById(booking.id, {
    resourceId: availResourceId,
    isReserved: true,
    startTime,
    endTime,
  });
};

const isResouceBlocked = async (locationId, resourceId, startTime, endTime) => {
  const events = await overLappingSlotQueryBuilder(startTime, endTime)
    .where({ locationId })
    .where({ resourceId })
    .count();

  return events[0].count === "0" ? false : true;
};

const getAvailableResources = async (locationId, startTime, endTime) => {
  // Get blocked resouces
  const events = await overLappingSlotQueryBuilder(startTime, endTime)
    .distinct("resourceId")
    .where({ locationId });

  const blockedResouces = events.map((e) => e.resourceId);
  const resourceIds = await getLocaionResourceIds(locationId);

  return _.head(_.difference(resourceIds, blockedResouces));
};

const getBookingSlots = async (booking, withResourceId) => {
  // Fetch service duration
  const duration = await getServiceDuration(booking.serviceId);
  const startTime = moment(booking.startTime).utc();
  const endTime = moment(booking.endTime).utc();

  // Calculate time interval slots
  const slots = calculateIntervalSlots(startTime, endTime, duration);

  // Fetch resource ids
  const resourceIds = booking.resourceId
    ? [booking.resourceId]
    : await getLocaionResourceIds(booking.locationId);

  // Fetch resource blocking events
  const resourceEvents = await getResourceBlockingEvents(
    booking.locationId,
    resourceIds,
    startTime,
    endTime
  );

  // Calculate availabe slots
  const availSlots = [];
  _.each(slots, (slot) => {
    let isAvailable = false;
    for (rId in resourceEvents) {
      let isInsideResouceEvent = false;
      for (event of resourceEvents[rId]) {
        if (doesSlotsOverlap(slot, event)) {
          isInsideResouceEvent = true;
        }
      }
      isAvailable = !(isInsideResouceEvent && !isAvailable);

      if (isAvailable && withResourceId) {
        availSlots.push(_.merge(_.clone(slot), { resourceId: rId }));
      }
    }
    if (isAvailable && !withResourceId) {
      availSlots.push(slot);
    }
  });

  return availSlots;
};

const doesSlotsOverlap = (block, event) =>
  block.start <= event.endTime && block.end >= event.startTime;

const overLappingSlotQueryBuilder = (startTime, endTime) => {
  return BookingModel.query()
    .where(function () {
      this.where("startTime", "<=", endTime).where("endTime", ">=", startTime);
    })
    .where(function () {
      this.where({ type: constants.booking.type.BLOCK }).orWhere(function () {
        this.where({ type: constants.booking.type.APPOINTMENT })
          .where(function () {
            this.where({ isReserved: true }).orWhere({ isConfirmed: true });
          })
          .where(function () {
            this.where({ isCanceled: false }).orWhere({ isCanceled: null });
          });
      });
    });
};

const getResourceBlockingEvents = async (
  locationId,
  resourceIds,
  startTime,
  endTime
) => {
  const events = await overLappingSlotQueryBuilder(startTime, endTime)
    .select("id", "resourceId", "startTime", "endTime")
    .where({ locationId })
    .whereIn("resourceId", resourceIds);

  const resourceEvents = {};

  // Create empty array for each rids
  _.each(resourceIds, (rId) => {
    resourceEvents[rId] = [];
  });

  _.each(events, (event) => {
    resourceEvents[event.resourceId].push(event);
  });

  return resourceEvents;
};

const getLocaionResourceIds = async (locationId) => {
  const resources = await ResourceModel.query()
    .select("id")
    .where({ locationId });
  return resources.map((r) => r.id);
};

const getServiceDuration = async (id) => {
  const { duration } = await ServiceModel.query()
    .select("duration")
    .where({ id })
    .first();

  return duration;
};

const calculateIntervalSlots = (startDate, endDate, duration) => {
  const slots = [];

  startDate = startDate.clone();
  while (startDate < endDate) {
    const slot = {
      start: startDate.clone(),
      end: startDate.add(duration, "minutes").clone().add(-1, "seconds"),
    };
    slots.push(slot);
  }
  return slots;
};

const generateBookingId = async ({
  locationId,
  serviceId,
  resourceId,
  guestId,
  date,
}) => {
  const { startTime, endTime } = await getLocationTimes(locationId, date);

  const booking = await BookingModel.query().insert({
    locationId,
    serviceId,
    resourceId,
    guestId,
    type: constants.booking.type.APPOINTMENT,
    startTime,
    endTime,
    isInitiated: true,
    isReserved: false,
    isConfirmed: false,
    isCanceled: false,
  });

  return booking;
};

const getLocationTimes = async (id, date) => {
  // Fetch location open-close time
  const { openTime: open, closeTime: close } = await LocationModel.query()
    .select("openTime", "closeTime")
    .where({
      id,
    })
    .first();

  const [openH, openM, openS] = open.split(":");
  const startTime = moment(date).utc().set({
    h: openH,
    m: openM,
    s: openS,
  });
  const [closeH, closeM, closeS] = close.split(":");
  const endTime = moment(date).utc().set({
    h: closeH,
    m: closeM,
    s: closeS,
  });

  return { startTime, endTime };
};

module.exports = {
  generateBookingId,
  getBookingSlots,
  reserveBooking,
  confirmBooking,
  cancelBooking,
};
