import { Op } from "sequelize";
import isEmpty from "lodash.isempty";

import models from "@models";
import { serverError, httpResponse } from "@helpers/http";

const { Articles } = models;
export const findArticle = async (req, res, next) => {
  const slug = req.params.slug || req.body.slug;
  console.log(req.body, slug, req);
  try {
    const article = await Articles.findOne({
      where: { slug }
    });

    if (!article) {
      return httpResponse(res, {
        statusCode: 404,
        message: "Article is not found"
      });
    }
    req.article = article;
    req.slug = slug;
    return next();
  } catch (error) {
    serverError(res, error);
  }
};

export const findPublishedArticle = async (req, res, next) => {
  const slug = req.params.slug || req.body.slug;
  try {
    const article = await Articles.findOne({
      where: {
        [req.params.slug ? "slug" : "id"]:
          req.params.slug || req.body.articleId,
          isPublished: true
      }
    });
    if (!article) {
      return httpResponse(res, {
        statusCode: 404,
        message: "Article is not found"
      });
    }

    req.article = article;
    req.slug = slug;
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
