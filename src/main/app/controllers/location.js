const Joi = require("@hapi/joi");
const Boom = require("@hapi/boom");
const _ = require("lodash");
const validator = require("../commons/validator");
const ifExists = require("../middlewares/ifExists");
const LocationModel = require("../models/location");
const ServiceModel = require("../models/service");
const LocationServiceModel = require("../models/locationService");
const BaseController = require("./base");
class Location extends BaseController {
  static get validatorOptionalRules() {
    return ["id"];
  }

  static async addLocationService(req, res) {
    const { locationId, serviceId } = req.params;

    // Fetch locaiton-service record from db
    let locationService = await LocationServiceModel.query()
      .where({ locationId, serviceId })
      .first();

    if (!locationService) {
      locationService = await LocationServiceModel.query().insert({
        locationId,
        serviceId,
      });
    }

    return sendResponse(
      res,
      codes.OK,
      "OK",
      "Location service added",
      locationService
    );
  }
}

Location.addLocationService.validators = [
  validator.params(
    Joi.object({
      locationId: LocationModel.validationRules.id.required(),
      serviceId: LocationModel.validationRules.id.required(),
    })
  ),
  ifExists(LocationModel, "id", "params.locationId"),
  ifExists(ServiceModel, "id", "params.serviceId"),
];

module.exports = Location;
