import Joi from "joi";
import models from "@models";
import { serverError, httpResponse } from "@helpers/http";
import { uuidSchema } from "@schemas";

const { Users } = models;

export const findUserById = async (req, res, next) => {
  const userId = req.params.userId || req.user.userId;
  try {
    const user = await Users.findByPk(userId, {
      include: [
        {
          model: models.Articles,
          as: "articles"
        },
        {
          model: models.Comments,
          as: "reviewer"
        },
        {
          model: models.Reactions,
          as: "userReactions"
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
