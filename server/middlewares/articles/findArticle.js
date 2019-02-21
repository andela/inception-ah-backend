import models from "../../models";
import { serverError, httpResponse } from "../../helpers/http";

const { Articles } = models;
/**
 * @description Middleware that search an Article by slug and 
              returns the article, error code 404 if not found
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @param {object} next HTTP Next function
 * @returns {object} HTTP response
 * @method findArticle
 */
export const findArticle = async (req, res, next) => {
  try {
    const article = await Articles.findOne({
      where: {
        slug: req.params.slug
      }
    });

    if (!article) {
      return httpResponse(res, {
        statusCode: 404,
        message: "Article is Not found"
      });
    }
    req.article = article;
    return next();
  } catch (error) {
    serverError(res, error);
  }
};
