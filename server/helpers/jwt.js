import jwt from "jsonwebtoken";
import { jwtConfigs } from "../configs/config";

/**
 * Get the JWT configurations
 *
 * @param {object} configs
 * @returns {object} the congigurations as object
 * @method getJWTConfigs
 */
export const getJWTConfigs = configs => {
  if (configs) {
    return {
      ...jwtConfigs,
      ...configs
    };
  }
  return jwtConfigs;
};

/**
 * @description generate a jsonwebtoken
 *
 * @param {string} userId the user id
 * @param {object} configs
 * @returns {string} the generated token
 * @method generateJWT
 */
export const generateJWT = (userId, configs = getJWTConfigs()) => {
  const { secret, ...config } = configs;
  try {
    return jwt.sign({ userId }, secret, config);
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
