import dotenv from "dotenv";

import { httpResponse, serverError } from "../../helpers/http";
import { decodeJWT } from "../../helpers/jwt";
import { jwtConfigs } from "../../configs/config";

dotenv.config();

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return httpResponse(res, {
      statusCode: 401,
      message: "No valid token provided"
    });
  }
  try {
    const decodedToken = await decodeJWT(token, jwtConfigs);
    req.user = decodedToken;
    return next();
  } catch (error) {
    return serverError(res, error);
  }
};
