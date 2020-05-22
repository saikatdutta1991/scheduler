const jwt = require("../commons/jwt");
const Boom = require("@hapi/boom");
const _ = require("lodash");
const AppConfig = require("../../config/app");

const checkAuthToken = (req, res, next) => {
  // Extract token from header
  const token = _.get(req, "headers.authorization", "").replace("Bearer ", "");

  try {
    // Verify jwt auth token
    const { apiAuthKey } = jwt.verify(token);

    if (AppConfig.apiAuthKey !== apiAuthKey) {
      throw Boom.forbidden("Yor are not asaafsuthorized", {
        name: "apiClientTokenInvalid",
        message: "Client jwt token has been corroupted",
      });
    }

    next();
  } catch (err) {
    sendResponse(res, 401, "Unauthorized", "Yor are not authorized", err.data);
  }
};

module.exports = checkAuthToken;
