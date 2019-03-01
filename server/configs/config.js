import dotenv from "dotenv";

dotenv.config();

const {
  NODE_ENV,
  EXPIRY_TIME_TEST,
  EXPIRY_TIME,
  DEV_DIALECT,
  TEST_DIALECT,
  TEST_STORAGE,
  DEV_DATABASE_URL,
  PROD_DATABASE_URL,
  PROD_DIALECT,
  JWT_ISSUER,
  JWT_VERIFICATION_SUBJECT,
  JWT_AUTH_SUBJECT,
  JWT_VERIFICATION_SECRET,
  JWT_AUTH_SECRET
} = process.env;

export const dbConfig = {
  development: {
    url: DEV_DATABASE_URL,
    dialect: DEV_DIALECT
  },
  test: {
    dialect: TEST_DIALECT,
    storage: TEST_STORAGE,
    logging: false
  },
  production: {
    url: PROD_DATABASE_URL,
    dialect: PROD_DIALECT
  }
};

export const jwtConfigs = {
  authentication: {
    issuer: JWT_ISSUER,
    secret: JWT_AUTH_SECRET,
    subject: JWT_AUTH_SUBJECT
  },
  verification: {
    issuer: JWT_ISSUER,
    secret: JWT_VERIFICATION_SECRET,
    subject: JWT_VERIFICATION_SUBJECT
  }
};

export const expiryTime = NODE_ENV === "test" ? EXPIRY_TIME_TEST : EXPIRY_TIME;
