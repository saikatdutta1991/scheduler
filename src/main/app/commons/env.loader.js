const envFilePath = `${__dirname}/../../../../.env.${process.env.NODE_ENV}`;
require("dotenv").config({
  path: envFilePath,
});
