import isEmpty from "lodash.isempty";
import Joi from "joi";
import models from "@models";
import { serverError, httpResponse } from "@helpers/http";
import { uuidSchema } from "@schemas";

const { Comments } = models;

/**
 * @description A middleware to find single comment if the comment Id is supplied and
 *      append the comment instance to the request object
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @returns {object} HTTP response
 * @method findSingleComment
 */

export const findSingleComment = async (req, res, next) => {
  const { article } = req;
  let commentId = req.params.id;
  const validateId = Joi.validate(commentId, uuidSchema);
  try {
    if (validateId.error) {
      return httpResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid comment Id"
      });
    }
    const comment = await Comments.findOne({
      where: {
        id: commentId,
        articleId: article.dataValues.id
      }
    });

    if (!comment) {
      return httpResponse(res, {
        statusCode: 404,
        message: "Comment is not found"
      });
    }
    req.comment = comment;
    return next();
  } catch (error) {
    serverError(res, error);
  }
};

/**
 * @description A middleware to find all comments based on the artcle Id and
 *      append the comments instance to the request object
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @returns {object} HTTP response
 * @method findAllComments
 */

export const findAllComments = async (req, res, next) => {
  const { article } = req;
  try {
    const comments = await Comments.findAll({
      where: { articleId: article.dataValues.id }
    });
    if (isEmpty(comments)) {
      return httpResponse(res, {
        statusCode: 404,
        message: "No Comments found"
      });
    }
    req.comments = comments;
    return next();
  } catch (error) {
    serverError(res, error);
  }
};
