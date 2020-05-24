const validator = require("../commons/validator");
const Joi = require("@hapi/joi");
const Boom = require("@hapi/boom");
const _ = require("lodash");
const ifExists = require("../middlewares/ifExists");

class BaseController {
  static get model() {
    return require(`${__dirname}/../models/${this.name}`);
  }

  static get validators() {
    const rules = {};
    for (let key in this.model.validationRules) {
      if (_.includes(this.validatorOptionalRules, key))
        rules[key] = _.get(this.model.validationRules, key).optional();
      else rules[key] = _.get(this.model.validationRules, key).required();
    }

    return [validator.body(Joi.object(rules))];
  }

  static async all(req, res) {
    const records = await this.model.query();
    sendResponse(res, codes.OK, "OK", `${this.name}s fetched`, records);
  }

  static async one(req, res) {
    const { id } = req.params;
    const record = await this.model.query().findById(id);

    if (!record) {
      throw Boom.notFound(`${this.name} not found`);
    }

    sendResponse(res, codes.OK, "OK", `${this.name} fetched`, record);
  }

  static async delete(req, res) {
    const { id } = req.params;
    await this.model.query().deleteById(id);
    sendResponse(res, codes.OK, "OK", `${this.name} deleted`);
  }

  static get deleteValidators() {
    return [
      validator.params(
        Joi.object({ id: this.model.validationRules.id.required() })
      ),
      ifExists(this.model, { key: "id", path: "params.id" }),
    ];
  }

  static async create(req, res) {
    const { body: payload } = req;

    // Check if record exists by id
    const record = await this.model
      .query()
      .select("id")
      .where({ id: _.get(payload, "id", null) })
      .first();

    // Resource exists, so update
    if (record) {
      _.omit(payload, "id");

      const data = await this.model
        .query()
        .updateAndFetchById(record.id, payload);

      return sendResponse(res, codes.OK, "OK", `${this.name} updated`, data);
    } else {
      const data = await this.model.query().insertAndFetch(payload);
      return sendResponse(
        res,
        codes.CREATED,
        "OK",
        `${this.name} created`,
        data
      );
    }
  }
}

module.exports = BaseController;
