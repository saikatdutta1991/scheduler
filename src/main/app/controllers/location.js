const Joi = require("@hapi/joi");
const Boom = require("@hapi/boom");
const validator = require("../commons/validator");
const LocationModel = require("../models/location");

const getLocations = async (req, res) => {
  const locations = await LocationModel.query();
  sendResponse(res, codes.OK, "OK", "Locations fetched", locations);
};

const getLocation = async (req, res) => {
  const { id } = req.params;
  const location = await LocationModel.query().findById(id);

  if (!location) {
    throw Boom.notFound("Location not found");
  }

  sendResponse(res, codes.OK, "OK", "Location fetched", location);
};
getLocation.validators = [
  validator.params(
    Joi.object({ id: LocationModel.validationRules.id.required() })
  ),
];

const deleteLocation = async (req, res) => {
  const { id } = req.params;
  const location = await LocationModel.query().findById(id);

  if (!location) {
    throw Boom.notFound("Location not found");
  }

  await location.$query().delete();

  sendResponse(res, codes.OK, "OK", "Location deleted");
};
deleteLocation.validators = [
  validator.params(
    Joi.object({ id: LocationModel.validationRules.id.required() })
  ),
];

const createLocation = async (req, res) => {
  const { body: payload } = req;

  // Check location code not duplicate
  const record = await LocationModel.query()
    .select("id")
    .where({ code: payload.code })
    .first();

  if (record) {
    throw Boom.badRequest("Duplicate location code entered");
  }

  const location = await LocationModel.query().insertAndFetch(payload);

  sendResponse(res, codes.CREATED, "OK", "Location created", location);
};
createLocation.validators = [
  validator.body(
    Joi.object({
      code: LocationModel.validationRules.code.required(),
      name: LocationModel.validationRules.name.required(),
      description: LocationModel.validationRules.description
        .optional()
        .allow(""),
      latitude: LocationModel.validationRules.latitude.required(),
      longitude: LocationModel.validationRules.longitude.required(),
      addressLine1: LocationModel.validationRules.addressLine1.required(),
      addressLine2: LocationModel.validationRules.addressLine2
        .optional()
        .allow(""),
      city: LocationModel.validationRules.city.required(),
      country: LocationModel.validationRules.country.required(),
      zip: LocationModel.validationRules.zip.required(),
      timezone: LocationModel.validationRules.timezone.required(),
      openTime: LocationModel.validationRules.openTime.required(),
      closeTime: LocationModel.validationRules.closeTime.required(),
    })
  ),
];

module.exports = {
  getLocations,
  getLocation,
  deleteLocation,
  createLocation,
};
