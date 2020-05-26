const express = require("express");
const router = express.Router();
const checkApiKey = require("../middlewares/checkApiKey");
const Location = require("../controllers/location");
const Service = require("../controllers/service");
const Resource = require("../controllers/resource");
const Guest = require("../controllers/guest");
const Booking = require("../controllers/booking");

router.use(checkApiKey);

router.post(
  "/bookings",
  Booking.generateBooking.validators,
  Booking.generateBooking
);
router.get(
  "/bookings/:id/slots",
  Booking.getBookingSlots.validators,
  Booking.getBookingSlots
);
router.post(
  "/bookings/:id/reserve",
  Booking.reserveBooking.validators,
  Booking.reserveBooking
);
router.post(
  "/bookings/:id/confirm",
  Booking.confirmBooking.validators,
  Booking.confirmBooking
);
router.delete("/bookings/:id", Booking.cancelBooking);

router.put("/guests", Guest.validators, Guest.create.bind(Guest));
router.get("/guests", Guest.all.bind(Guest));
router.get("/guests/:id", Guest.one.bind(Guest));
router.delete("/guests/:id", Guest.deleteValidators, Guest.delete.bind(Guest));
router.get(
  "/guests/:id/bookings",
  Guest.getBookings.validators,
  Guest.getBookings
);

router.put(
  "/resources",
  Resource.createValidators,
  Resource.create.bind(Resource)
);
router.get("/resources", Resource.all.bind(Resource));
router.get("/resources/:id", Resource.one.bind(Resource));
router.delete(
  "/resources/:id",
  Resource.deleteValidators,
  Resource.delete.bind(Resource)
);

router.put("/services", Service.validators, Service.create.bind(Service));
router.get("/services", Service.all.bind(Service));
router.get("/services/:id", Service.one.bind(Service));
router.delete(
  "/services/:id",
  Service.deleteValidators,
  Service.delete.bind(Service)
);

router.put("/locations", Location.validators, Location.create.bind(Location));
router.get("/locations", Location.all.bind(Location));
router.get("/locations/:id", Location.one.bind(Location));
router.delete(
  "/locations/:id",
  Location.deleteValidators,
  Location.delete.bind(Location)
);
router.put(
  "/locations/:locationId/services/:serviceId",
  Location.addLocationService.validators,
  Location.addLocationService
);
router.get(
  "/locations/:locationId/services",
  Location.getLocationServices.validators,
  Location.getLocationServices
);
router.get(
  "/locations/:locationId/resources",
  Location.getResources.validators,
  Location.getResources
);
router.get(
  "/locations/:locationId/blocked-slots",
  Location.getBlockedSlots.validators,
  Location.getBlockedSlots
);

router.get("/", (req, res) => {
  return sendResponse(res, codes.OK, "OK", "Ok");
});

app.use("/api/v1/", router);
