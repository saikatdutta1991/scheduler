const Joi = require("@hapi/joi");
const validator = require("../commons/validator");
const LocationModel = require("../models/location");

const getLocations = async (req, res) => {
  const locations = await LocationModel.query();
  sendResponse(res, codes.OK, "OK", "Locations fetched", locations);
};

const getLocation = async (req, res) => {
  const { id } = req.params;
  const location = await LocationModel.query().findById(id);
  sendResponse(res, codes.OK, "OK", "Location fetched", location);
};
getLocation.validators = [
  validator.params(Joi.object({ id: LocationModel.validationRules.id })),
];

module.exports = {
  getLocations,
  getLocation,
};
