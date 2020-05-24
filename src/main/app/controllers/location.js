const Joi = require("@hapi/joi");
const Boom = require("@hapi/boom");
const _ = require("lodash");
const validator = require("../commons/validator");
const ifExists = require("../middlewares/ifExists");
const LocationModel = require("../models/location");
const ServiceModel = require("../models/service");
const ResourceModel = require("../models/resource");
const LocationServiceModel = require("../models/locationService");
const BaseController = require("./base");
class Location extends BaseController {
  static get validatorOptionalRules() {
    return ["id"];
  }

  static async getResources(req, res) {
    const { locationId } = req.params;
    const resources = await ResourceModel.query().where({ locationId });
    return sendResponse(res, codes.OK, "OK", "Resources fetched", {
      resources,
    });
  }

  static async getLocationServices(req, res) {
    const { locationId: id } = req.params;
    const location = await LocationModel.query()
      .where({ id })
      .withGraphFetched("services")
      .first();
    return sendResponse(res, codes.OK, "OK", "Services fetched", {
      services: location.services,
    });
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
  ifExists(LocationModel, { key: "id", path: "params.locationId" }),
  ifExists(ServiceModel, { key: "id", path: "params.serviceId" }),
];

Location.getLocationServices.validators = [
  validator.params(
    Joi.object({
      locationId: LocationModel.validationRules.id.required(),
    })
  ),
  ifExists(LocationModel, { key: "id", path: "params.locationId" }),
];

Location.getResources.validators = [
  validator.params(
    Joi.object({
      locationId: LocationModel.validationRules.id.required(),
    })
  ),
  ifExists(LocationModel, { key: "id", path: "params.locationId" }),
];

module.exports = Location;
