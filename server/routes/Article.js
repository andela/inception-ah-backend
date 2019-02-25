import { Router } from "express";
import { favoriteOrUnFavoriteArticle } from "../controllers/favorite";
import { verifyToken } from "../middlewares/authentications/verifyToken";
import { findArticle } from "../middlewares/articles/findArticle";

const articleRoutes = Router();

articleRoutes.post(
  "/articles/:slug/favorite",
  verifyToken,
  findArticle,
  favoriteOrUnFavoriteArticle
);

export default articleRoutes;
