const Boom = require("@hapi/boom");
const _ = require("lodash");

const ifExists = (model, { key, path, isOptional = false }) => {
  return async (req, res, next) => {
    // Parse and get the value from path
    const value = _.get(req, path, null);

    // Fetch if record exists
    const record = await model.query().select(key).where(key, value).first();

    // If record does not exits
    if (value !== null && record === undefined && isOptional === true) {
      throw Boom.notFound(`${model.name} not found.`);
    }

    next();
  };
};

module.exports = ifExists;
