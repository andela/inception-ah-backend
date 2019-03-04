import models from "@models";
import { httpResponse, serverError } from "@helpers/http";

const { Comments } = models;

/**
 * @description Create a new Comment
 *
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @returns {object}  Response message object
 */
export const createComment = async (req, res) => {
  const articleId = req.article.id;
  const { content } = req.body;
  const { userId } = req.user;
  try {
    const newComment = await Comments.create({
      articleId,
      userId,
      content
    });

    return httpResponse(res, {
      statusCode: 201,
      message: "Comment created successfully",
      comment: newComment
    });
  } catch (error) {
    return serverError(res, error);
  }
};

/**
 * @description Get all Comments
 *
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @returns {object}  Response message object
 */
export const getAllComments = async (req, res) => {
  const { comments } = req;
  try {
    return httpResponse(res, {
      statusCode: 200,
      success: true,
      message: "Comments retrieved successfully",
      data: comments
    });
  } catch (error) {
    return serverError(res, error);
  }
};

/**
 * @description Update a Comment
 *
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @returns {object}  Response message object
 */
export const updateComment = async (req, res) => {
  const { user, comment } = req;
  const { content } = req.body;
  const userIdFromToken = user.userId;
  try {
    if (comment.userId === userIdFromToken) {
      const updatedComment = await comment.update(req.body);
      return httpResponse(res, {
        statusCode: 200,
        success: true,
        message: "Comment updated successfully",
        comment: updatedComment
      });
    }

    return httpResponse(res, {
      statusCode: 401,
      success: false,
      message: "Unauthorized. Can not update another user's comment"
    });
  } catch (error) {
    return serverError(res, error);
  }
};

/**
 * @description Delete a Comment
 *
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @returns {object}  Response message object
 */
export const deleteComment = async (req, res) => {
  const { user, comment } = req;
  const userIdFromToken = user.userId;
  try {
    if (comment.userId === userIdFromToken) {
      await comment.destroy();
      return httpResponse(res, {
        statusCode: 200,
        success: true,
        message: "Comment deleted successfully"
      });
    }

    return httpResponse(res, {
      statusCode: 401,
      success: false,
      message: "Unauthorized. Can not delete another user's comment"
    });
  } catch (error) {
    return serverError(res, error);
  }
};
