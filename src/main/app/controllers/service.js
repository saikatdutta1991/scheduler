const Joi = require("@hapi/joi");
const BaseController = require("./base");
class Service extends BaseController {
  static get validatorOptionalRules() {
    return ["id"];
  }
}

module.exports = Service;
