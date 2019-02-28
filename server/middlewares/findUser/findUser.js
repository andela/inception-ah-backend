import Joi from "joi";
import models from "../../models/index";
import { serverError, httpResponse } from "../../helpers/http";
import { uuidSchema } from "../../validationSchemas/user";

const { Users } = models;

export const findUserById = async (req, res, next) => {
  const userId = req.params.id;
  const validateId = Joi.validate(userId, uuidSchema);

  try {
    if (validateId.error) {
      return httpResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid User Id"
      });
    }

    const user = await Users.findByPk(userId);
    if (!user) {
      return httpResponse(res, {
        statusCode: 404,
        success: false,
        message: "User not found"
      });
    }
    req.userDetails = user;
    return next();
  } catch (error) {
    return serverError(res, error);
  }
};
