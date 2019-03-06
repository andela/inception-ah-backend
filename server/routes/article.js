import { Router } from "express";
import { favoriteOrUnFavoriteArticle } from "@controllers/favorite";
import {
  verifyToken,
  findArticle,
  findAuthorsArticle,
  validateInput,
  validatePaginationParameters
} from "@middlewares";
import {
  createArticle,
  publishArticle,
  getAllArticles,
  getArticleBySlug,
  getAuthorsArticles,
  getArticlesByCategory,
  updateArticle,
  deleteArticle
} from "@controllers/article";

const articleRouter = Router();

/**
 * @description - Route to favorite and unfavorite an article
 * @returns - It returns reponse message
 */
articleRouter.post(
  "/articles/:slug/favorite",
  verifyToken,
  findArticle,
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

export { articleRouter };
