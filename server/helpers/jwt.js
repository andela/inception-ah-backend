import jwt from "jsonwebtoken";
import { jwtConfigs } from "@configs/config";

/**
 * Get the JWT configurations
 *
 * @param {object} options
 * Note:
 * - options.option is required, and must be either authentication or verification
 * @returns {object} the congigurations as object
 * @method getJWTConfigs
 */
export const getJWTConfigs = options => {
  const { option, ...extraOptions } = options || {};
  if (!option) {
    throw new Error("An object with property option is required");
  }

  if (extraOptions) {
    return {
      ...jwtConfigs[option],
      ...extraOptions
    };
  }

  return jwtConfigs[option];
};

/**
 * @description generate a jsonwebtoken
 *
 * @param {object} payload the payload
 * @param {object} configs
 * @returns {string} the generated token
 * @method generateJWT
 */
export const generateJWT = (payload, configs) => {
  const { secret, ...config } = configs;
  try {
    return jwt.sign(payload, secret, config);
  } catch (error) {
    throw error;
  }
};

/**
 * @description Decode a jsonweb token
 *
 * @param {string} token the token to decode
 * @param {object} configs the configuration that was used to sign the token
 * @returns {object} the decoded token
 * @method decodeJWT
 */
export const decodeJWT = (token, configs) => {
  try {
    const { secret, ...options } = configs;
    return jwt.verify(token, secret, options);
  } catch (error) {
    throw error;
  }
};
