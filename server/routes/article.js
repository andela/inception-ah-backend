import { Router } from "express";
import { favoriteOrUnFavoriteArticle } from "@controllers/favorite";
import {
  verifyToken,
  findArticle,
  findAuthorsArticle,
  validateInput,
  validatePaginationParameters,
  findPublishedArticle
} from "@middlewares";

import {
  createArticle,
  publishArticle,
  getAllArticles,
  getArticleBySlug,
  getAuthorsArticles,
  getArticlesByCategory,
  updateArticle,
  deleteArticle,
  rateArticle
} from "@controllers/article";

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
  "/articles/:slug/favorite",
  verifyToken,
  findPublishedArticle,
  favoriteOrUnFavoriteArticle
);

/**
 * @description - Route is use to create an article
 * @returns - It returns an article object
 */
articleRouter.post("/articles", verifyToken, validateInput, createArticle);

/**
 * @description - Route to get all articles by an author
 * @returns - It returns an array of articles by an author
 */
articleRouter.get(
  "/articles/feed",
  verifyToken,
  validatePaginationParameters,
  getAuthorsArticles
);

/**
 * @description - Route gets all published articles
 * @returns - It returns an array of all published articles
 */
articleRouter.get("/articles", validatePaginationParameters, getAllArticles);

/**
 * @description - Route to get an article by slug
 * @returns - It returns an object of the article
 */
articleRouter.get("/articles/:slug", getArticleBySlug);

/**
 * @description - Route to update an article
 * @returns - It returns an object of the updated article
 */
articleRouter.put(
  "/articles/:slug",
  verifyToken,
  findAuthorsArticle,
  updateArticle
);

/**
 * @description - Route gets all published articles by category
 * @returns - It returns an array of all published articles
 */
articleRouter.get(
  "/categories/:categoryId/articles",
  validatePaginationParameters,
  getArticlesByCategory
);

/**
 * @description - Route to publish an unpublished article
 * @returns - It returns an object of the published article
 */
articleRouter.put(
  "/articles/:slug/publish",
  verifyToken,
  findAuthorsArticle,
  publishArticle
);

/**
 * @description - Route to delete an article
 * @returns - It returns a response
 */
articleRouter.delete(
  "/articles/:slug",
  verifyToken,
  findAuthorsArticle,
  deleteArticle
);
articleRouter.post(
  "/articles/:slug/reaction",
  verifyToken,
  findArticle,
  likeOrDislikeAnArticle
);

articleRouter.get(
  "/articles/:slug/reaction",
  verifyToken,
  findPublishedArticle,
  fetchAllArticleReactions
);

articleRouter.post(
  "/articles/:slug/rate",
  findArticle,
  verifyToken,
  rateArticle
);

articleRouter.post("/articles/rate", findArticle, verifyToken, rateArticle);

export { articleRouter };
