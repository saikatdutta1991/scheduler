module.exports = {
  appName: process.env.APP_NAME,
  apiAuthKey: process.env.API_AUTH_KEY,
  firebaseApiKey: process.env.FIREBASE_API_KEY,
  jwtSecret: process.env.JWT_SECRET,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsS3Bucket: process.env.AWS_S3_BUCKET,
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
  codes: {
    UNAUTHORIZED: 401,
    CREATED: 201,
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    NOT_ACCEPTABLE: 406,
    FORBIDDEN: 403,
  },
  constants: {
    booking: {
      type: {
        BLOCK: "block",
        APPOINTMENT: "appointment",
      },
    },
    role: {
      USER: "user",
      ADMIN: "admin",
    },
  },
};
