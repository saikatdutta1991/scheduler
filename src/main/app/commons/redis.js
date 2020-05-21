const redis = require("redis");
const logger = require("./logger");
const AppConfig = require("../../config/app");
const { promisify } = require("util");

const client = redis.createClient({
  host: AppConfig.redis.host,
  port: AppConfig.redis.port,
  password: AppConfig.redis.password,
});

client.on("connect", function () {
  logger.debug("Redis connected.");
});

client.on("error", function (error) {
  logger.debug("Redis failed to connect");
});

const get = promisify(client.get).bind(client);
const set = promisify(client.set).bind(client);
const del = promisify(client.del).bind(client);

module.exports = {
  get,
  set,
  del,
};
