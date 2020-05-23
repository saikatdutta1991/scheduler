const BaseController = require("./base");

class Guest extends BaseController {
  static get validatorOptionalRules() {
    return ["id"];
  }
}

module.exports = Guest;
