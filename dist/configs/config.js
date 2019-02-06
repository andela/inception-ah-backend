"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

_dotenv.default.config();

const config = {
  development: {
    url: process.env.DEV_DATABASE_URL,
    dialect: process.env.DEV_DIALECT
  },
  test: {
    dialect: process.env.TEST_DIALECT,
    storage: process.env.TEST_STORAGE
  },
  production: {
    url: process.env.PROD_DATABASE_URL,
    dialect: process.env.PROD_DIALECT
  }
};
var _default = config;
exports.default = _default;
