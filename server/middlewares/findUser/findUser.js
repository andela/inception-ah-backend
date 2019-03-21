import Joi from "joi";
import models from "@models";
import { serverError, httpResponse } from "@helpers/http";
import { uuidSchema } from "@schemas";

const { Users, Reactions, Comments, Articles, Followers } = models;

export const findUserById = async (req, res, next) => {
  const userId = req.params.id || req.user.userId;
  const validateId = Joi.validate(userId, uuidSchema);

  try {
    if (validateId.error) {
      return httpResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid User Id"
      });
    }

    const user = await Users.findByPk(userId, {
      include: [
        {
          model: Articles,
          as: "author"
        },
        {
          model: Reactions,
          as: "userReactions"
        },
        {
          model: Comments,
          as: "reviews"
        },
        {
          model: Followers,
          as: "following"
        },
        {
          model: Followers,
          as: "followers"
        }
      ]
    });
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
