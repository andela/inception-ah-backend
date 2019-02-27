import { Router } from "express";
import { favoriteOrUnFavoriteArticle } from "../controllers/favorite";
import { verifyToken } from "../middlewares/authentications/verifyToken";
import {
  findArticle,
  findAuthorsArticle
} from "../middlewares/articles/findArticle";
import {
  validateInput,
  validatePaginationParameters
} from "../middlewares/validations/validations";
import {
  createArticle,
  publishArticle,
  getAllArticles,
  getArticleBySlug,
  getAuthorsArticles,
  getArticlesByCategory,
  updateArticle,
  deleteArticle
} from "../controllers/article";

const articleRoutes = Router();

articleRoutes.post(
  "/articles/:slug/favorite",
  verifyToken,
  findArticle,
  favoriteOrUnFavoriteArticle
);

/**
 * @description - Route is use to create an article
 * @returns - It returns an article object
 */
articleRoutes.post("/articles", verifyToken, validateInput, createArticle);

/**
 * @description - Route to get all articles by an author
 * @returns - It returns an array of articles by an author
 */
articleRoutes.get(
  "/articles/feed",
  verifyToken,
  validatePaginationParameters,
  getAuthorsArticles
);

/**
 * @description - Route gets all published articles
 * @returns - It returns an array of all published articles
 */
articleRoutes.get("/articles", validatePaginationParameters, getAllArticles);

/**
 * @description - Route to get an article by slug
 * @returns - It returns an object of the article
 */
articleRoutes.get("/articles/:slug", getArticleBySlug);

/**
 * @description - Route to update an article
 * @returns - It returns an object of the updated article
 */
articleRoutes.put(
  "/articles/:slug",
  verifyToken,
  findAuthorsArticle,
  updateArticle
);

/**
 * @description - Route gets all published articles by category
 * @returns - It returns an array of all published articles
 */
articleRoutes.get(
  "/categories/:categoryId/articles",
  validatePaginationParameters,
  getArticlesByCategory
);

/**
 * @description - Route to publish an unpublished article
 * @returns - It returns an object of the published article
 */
articleRoutes.put(
  "/articles/:slug/publish",
  verifyToken,
  findAuthorsArticle,
  publishArticle
);

/**
 * @description - Route to delete an article
 * @returns - It returns a response
 */
articleRoutes.delete(
  "/articles/:slug",
  verifyToken,
  findAuthorsArticle,
  deleteArticle
);

export { articleRoutes };
