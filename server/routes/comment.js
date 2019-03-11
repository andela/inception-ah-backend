import { Router } from "express";
import {
  createComment,
  getAllComments,
  updateComment,
  deleteComment
} from "@controllers/comment";
import {
  findArticle,
  verifyToken,
  findAllComments,
  findSingleComment,
  validateInput
} from "@middlewares";
import {
  likeOrDislikeACommment,
  fetchAllCommentReactions
} from "@controllers/reaction";

const commentsRouter = Router();

/**
 * @description - Route is used to create a comment
 * @returns - It returns a comment object
 */
commentsRouter.post(
  "/articles/:slug/comments",
  verifyToken,
  findArticle,
  validateInput,
  createComment
);

/**
 * @description - Route to get all comments on an article
 * @returns - It returns an array of all the comments on an article
 */
commentsRouter.get(
  "/articles/:slug/comments",
  findArticle,
  findAllComments,
  getAllComments
);

/**
 * @description - Route to update a comment
 * @returns - It returns an object of the updated comment
 */
commentsRouter.put(
  "/articles/:slug/comments/:id",
  verifyToken,
  findArticle,
  findSingleComment,
  updateComment
);

/**
 * @description - Route to delete a comment
 * @returns - It returns an object of the deleted comment
 */
commentsRouter.delete(
  "/articles/:slug/comments/:id",
  verifyToken,
  findArticle,
  findSingleComment,
  deleteComment
);
commentsRouter.post(
  "/articles/:slug/comments/:id/reaction",
  verifyToken,
  findArticle,
  findSingleComment,
  likeOrDislikeACommment
);

commentsRouter.get(
  "/articles/:slug/comments/:id/reaction",
  verifyToken,
  findArticle,
  findSingleComment,
  fetchAllCommentReactions
);
export { commentsRouter };
