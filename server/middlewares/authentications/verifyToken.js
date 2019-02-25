import dotenv from "dotenv";
import { getJWTConfigs, decodeJWT } from "../../helpers/jwt";
import { httpResponse, serverError } from "../../helpers/http";

const tokenConfigs = getJWTConfigs({ subject: "Authentication Token" });
dotenv.config();
/**
 * @description A middleware to verify if Token is supplied,
 *      decodes the token and append the user instance to the request object
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @returns {object} HTTP response
 * @method verifyToken
 */

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return httpResponse(res, {
      statusCode: 401,
      message: "No valid token provided"
    });
  }
  try {
    const decodedToken = await decodeJWT(token, tokenConfigs);
    req.user = decodedToken;
    return next();
  } catch (error) {
    return serverError(res, error);
  }
};
