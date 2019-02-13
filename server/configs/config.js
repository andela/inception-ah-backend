import dotenv from "dotenv";

dotenv.config();

const { EXPIRY_TIME, EXPIRY_TIME_TEST, NODE_ENV } = process.env;

const config = {
  development: {
    url: process.env.DEV_DATABASE_URL,
    dialect: process.env.DEV_DIALECT,
    logging: false
  },
  test: {
    dialect: process.env.TEST_DIALECT,
    storage: process.env.TEST_STORAGE,
    logging: false
  },
  production: {
    url: process.env.PROD_DATABASE_URL,
    dialect: process.env.PROD_DIALECT,
    logging: false
  }
};

export const expiryTime = NODE_ENV === "test" ? EXPIRY_TIME_TEST : EXPIRY_TIME;

export default config;
