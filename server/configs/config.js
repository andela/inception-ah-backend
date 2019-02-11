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
  JWT_SECRET,
  JWT_SUBJECT
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
  issuer: JWT_ISSUER,
  secret: JWT_SECRET,
  subject: JWT_SUBJECT
};

export const expiryTime = NODE_ENV === "test" ? EXPIRY_TIME_TEST : EXPIRY_TIME;
