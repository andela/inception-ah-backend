import { Router } from "express";
import {
  createComment,
  updateComment,
  deleteComment
} from "@controllers/comment";
import {
  findArticle,
  verifyToken,
  findSingleComment,
  validateInput,
  validateUuid
} from "@middlewares";
import {
  likeOrDislikeACommment,
  fetchAllCommentReactions
} from "@controllers/reaction";

const commentsRouter = Router();

/**
 * Group all similar routes
 */
commentsRouter
  .route("/")

  /**
   * @description - Route is used to create a comment
   * @returns - It returns a comment object
   */
  .post(verifyToken, findArticle, validateInput, createComment);

/**
 * Group all similar routes
 */
commentsRouter
  .route("/:commentId")

  /**
   * Perform middleware checks common to the grouped routes
   */
  .all(verifyToken, validateUuid, findSingleComment)

  /**
   * @description - Route to update a comment
   * @returns - It returns an object of the updated comment
   */
  .put(updateComment)

  /**
   * @description - Route to delete a comment
   * @returns - It returns an object of the deleted comment
   */
  .delete(deleteComment);

/**
 * Group all similar routes
 */
commentsRouter
  .route("/:commentId/reaction")

  /**
   * Perform middleware checks common to the grouped routes
   */
  .all(verifyToken, findSingleComment)

  /**
   * @description - Route is use to create a comment's rction
   */
  .post(likeOrDislikeACommment)

  /**
   * @description - Route is use to get all comment's reactions
   */
  .get(fetchAllCommentReactions);
export { commentsRouter };
