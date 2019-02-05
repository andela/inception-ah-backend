import dotenv from "dotenv";

dotenv.config();

const config = {
  development: {
    url: process.env.DEV_DATABASE_URL,
    dialect: process.env.DEV_DIALECT
  },
  test: {
    dialect: process.env.TEST_DIALECT,
    storage: process.env.TEST_STORAGE,
    logging: process.env.VERBOSE
  },
  production: {
    url: process.env.PROD_DATABASE_URL,
    dialect: process.env.PROD_DIALECT
  }
};

export default config;
