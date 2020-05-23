const Joi = require("@hapi/joi");
const Boom = require("@hapi/boom");
const _ = require("lodash");
const validator = require("../commons/validator");
const ServiceModel = require("../models/service");

const getServices = async (req, res) => {
  const services = await ServiceModel.query();
  sendResponse(res, codes.OK, "OK", "Services fetched", services);
};

const getService = async (req, res) => {
  const { id } = req.params;
  const service = await ServiceModel.query().findById(id);

  if (!service) {
    throw Boom.notFound("Service not found");
  }

  sendResponse(res, codes.OK, "OK", "Service fetched", service);
};
getService.validators = [
  validator.params(
    Joi.object({ id: ServiceModel.validationRules.id.required() })
  ),
];

const deleteService = async (req, res) => {
  const { id } = req.params;
  const service = await ServiceModel.query().findById(id);

  if (!service) {
    throw Boom.notFound("Service not found");
  }

  await service.$query().delete();

  sendResponse(res, codes.OK, "OK", "Service deleted");
};
deleteService.validators = [
  validator.params(
    Joi.object({ id: ServiceModel.validationRules.id.required() })
  ),
];

const createService = async (req, res) => {
  const { body: payload } = req;

  // Check if record exists by id
  const record = await ServiceModel.query()
    .select("id")
    .where({ id: _.get(payload, "id", null) })
    .first();

  // Service exists, so update
  if (record) {
    _.omit(payload, "id");

    const service = await ServiceModel.query().updateAndFetchById(
      record.id,
      payload
    );

    return sendResponse(res, codes.OK, "OK", "Service updated", service);
  } else {
    const service = await ServiceModel.query().insertAndFetch(payload);
    return sendResponse(res, codes.CREATED, "OK", "Service created", service);
  }
};
createService.validators = [
  validator.body(
    Joi.object({
      id: ServiceModel.validationRules.id.optional(),
      code: ServiceModel.validationRules.code.required(),
      name: ServiceModel.validationRules.name.required(),
      description: ServiceModel.validationRules.description
        .optional()
        .allow(""),
      duration: ServiceModel.validationRules.duration.required(),
    })
  ),
];

module.exports = {
  getServices,
  getService,
  deleteService,
  createService,
};
