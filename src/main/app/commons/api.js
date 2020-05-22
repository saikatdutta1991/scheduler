const { apiAuthKey, codes } = require("../../config/app");
const logger = require("./logger");
const Boom = require("@hapi/boom");

/** sends generic api json response */
module.exports.sendResponse = (response, statusCode, type, message, data) => {
  const json = {
    type,
    message,
  };

  if (data) {
    json.data = data;
  }

  response.status(statusCode).json(json);
};
