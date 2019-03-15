import { Router } from "express";
import { validatePaginationParameters, validateUuid } from "@middlewares";
import { getArticlesByCategory } from "@controllers/article";

const categoryRouter = Router();

/**
 * @description - Route gets all published articles by category
 * @returns - It returns an array of all published articles
 */
categoryRouter.get(
  "/:categoryId/articles",
  validateUuid,
  validatePaginationParameters,
  getArticlesByCategory
);

export { categoryRouter };
