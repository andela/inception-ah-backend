import bcrypt from "bcrypt";
import { generateJWT, verifyJWT } from "./jwt";

export const generateJWToken = generateJWT;
export const verifyJWToken = verifyJWT;
/**
 * @description Compare two string representation of password to determine if they are the same
 *
 * @param {String} password Unhashed representaton of password
 * @param {String} hash Hashed representation of password
 * @returns {boolean} true if the two representation of password are the same
 * @method comparePassword
 */
export const comparePassword = async (password, hash) => {
  const equals = bcrypt.compare(password, hash);
  return Promise.resolve(equals);
};

/**
 * @description Returns message to client
 *
 * @param {Object} res HTTP response object
 * @param {object} options
 * @returns {Object} HTTP response
 * @method httpResponse
 */
export const httpResponse = (res, options) => {
  let { statusCode, message, success, ...data } = options;
  const response = res.status(statusCode).json({
    success,
    message,
    ...data
  });
  res.end();
  return response;
};

/**
 * @description Excrypt password
 *
 * @param {string} password the password to ecrypt
 * @returns {string} the encypted password
 * @method hashPassword
 */
export const hashPassword = password => {
  if (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  }
};

export default {
  comparePassword,
  generateJWT: generateJWToken,
  verifyJWT: verifyJWToken,
  httpResponse
};
