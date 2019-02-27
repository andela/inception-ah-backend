import { Op } from "sequelize";
import isEmpty from "lodash.isempty";

import models from "../../models";
import { serverError, httpResponse } from "../../helpers/http";

const { Articles } = models;
export const findArticle = async (req, res, next) => {
  try {
    const article = await Articles.findOne({
      where: {
        slug: req.params.slug
      }
    });

    if (isEmpty(article)) {
      return httpResponse(res, {
        statusCode: 404,
        message: "Article is not found"
      });
    }
    req.article = article;
    return next();
  } catch (error) {
    serverError(res, error);
  }
};

export const findAuthorsArticle = async (req, res, next) => {
  try {
    const articleDetails = await Articles.findOne({
      where: {
        slug: {
          [Op.eq]: req.params.slug
        },
        authorId: {
          [Op.eq]: req.user.userId
        }
      }
    });

    if (isEmpty(articleDetails)) {
      return httpResponse(res, {
        statusCode: 404,
        message: "Article is not found"
      });
    }
    req.article = articleDetails;
    return next();
  } catch (error) {
    serverError(res, error);
  }
};
