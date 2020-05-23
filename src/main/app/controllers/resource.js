const BaseController = require("./base");
const LocationModel = require("../models/location");
const ifExists = require("../middlewares/ifExists");

class Resource extends BaseController {
  static get validatorOptionalRules() {
    return ["id"];
  }

  static get createValidators() {
    const v = this.validators;
    v.push(ifExists(LocationModel, "id", "body.locationId"));
    return v;
  }
}

module.exports = Resource;
