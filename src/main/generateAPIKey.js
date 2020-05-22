require("./app/commons/env.loader");
const uuid = require("uuid");
const { sign } = require("./app/commons/jwt");

/** Generate random api key */

const apiAuthKey = uuid.v4();
const apiClientToken = sign({
  apiAuthKey,
});
console.log(`
# Set the below api auth key in your env file as API_AUTH_KEY
API Auth Key : ${apiAuthKey}

API Client Token (To access the apis): 
Bearer ${apiClientToken}
`);
