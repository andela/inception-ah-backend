import { Router } from "express";
import { favoriteOrUnFavoriteArticle } from "@controllers/favorite";
import {
  verifyToken,
  findAuthorsArticle,
  validateInput,
  findAllComments,
  findPublishedArticle,
  findArticle,
  validatePaginationParameters
} from "@middlewares";

import {
  createArticle,
  publishArticle,
  getAllArticles,
  getArticleBySlug,
  getAuthorsArticles,
  updateArticle,
  deleteArticle,
  rateArticle,
  searchArticle
} from "@controllers/article";
import { getAllComments } from "@controllers/comment";
import {
  likeOrDislikeAnArticle,
  fetchAllArticleReactions
} from "@controllers/reaction";

const articleRouter = Router();

/**
 * @description - Route to favorite and unfavorite an article
 * @returns - It returns reponse message
 */
articleRouter.post(
  "/:slug/favorite",
  verifyToken,
  findPublishedArticle,
  favoriteOrUnFavoriteArticle
);

/**
 * @description - Route is use to create an article
 * @returns - It returns an article object
 */
articleRouter.post("/", verifyToken, validateInput, createArticle);

/**
 * @description - Route to get all articles by an author
 * @returns - It returns an array of articles by an author
 */
articleRouter.get(
  "/feed",
  verifyToken,
  validatePaginationParameters,
  getAuthorsArticles
);

/**
 * @description - Route gets all published articles
 * @returns - It returns an array of all published articles
 */
articleRouter.get("/", validatePaginationParameters, (req, res, next) => {
  if ("search" in req.query) {
    next();
  } else {
    getAllArticles(req, res, next);
  }
});

/**
 * Group all similar route
 */
articleRouter
  .route("/:slug")
  /**
   * @description - Route to get an article by slug
   * @returns - It returns an object of the article
   */
  .get(getArticleBySlug)

  /**
   * Perform middleware checks common to the grouped routes
   */
  .all(verifyToken, findAuthorsArticle)

  /**
   * @description - Route to update an article
   * @returns - It returns an object of the updated article
   */
  .put(updateArticle)

  /**
   * @description - Route to delete an article
   * @returns - It returns a response
   */
  .delete(deleteArticle);

/**
 * @description - Route to publish an unpublished article
 * @returns - It returns an object of the published article
 */
articleRouter.put(
  "/:slug/publish",
  verifyToken,
  findAuthorsArticle,
  publishArticle
);

/**
 * @description - Route to get all comments on an article
 * @returns - It returns an array of all the comments on an article
 */
articleRouter.get(
  "/:slug/reaction",
  verifyToken,
  findPublishedArticle,
  fetchAllArticleReactions
);

/**
 * @description - Route to post rating on an article
 * @returns - It returns a response
 */

articleRouter.post(
  "/:slug/rate",
  verifyToken,
  findPublishedArticle,
  rateArticle
);

articleRouter.get(
  "/:slug/comments",
  findPublishedArticle,
  findAllComments,
  getAllComments
);

articleRouter.get("/", verifyToken, (req, res, next) => {
  if ("search" in req.query) {
    searchArticle(req, res, next);
  } else {
    next();
  }
});

/**
 * Group similar routes
 */
articleRouter
  .route("/:slug/reaction")

  /**
   * Perform all middleware checks common to the grouped routes
   */
  .all(verifyToken, findPublishedArticle)

  /**
   * @description - Route is use to create article's reactions
   */
  .post(likeOrDislikeAnArticle)

  /**
   * @description - Route is use to get all article's reactions
   */
  .get(fetchAllArticleReactions);

export { articleRouter };
