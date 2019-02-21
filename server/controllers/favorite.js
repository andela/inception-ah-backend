import { Op } from "sequelize";
import models from "../models";
import { httpResponse } from "../helpers/http";

const { Favorites } = models;
/**
 * @description This asynchronous function favorite an article
 *          that is not yet favorited and increase the favorite count on the article
 *          and also remove favorite on an article that is already
 * favorited and reduce the favorite count.s
 /**
 * @description Sign up a new user
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @returns {object} HTTP response
 * @method favoriteOrUnFavoriteArticle
 */
export const favoriteOrUnFavoriteArticle = async (req, res) => {
  const {
    article: { slug, id, title },
    user: { userId },
    article
  } = req;

  const favorites = await Favorites.findOne({
    where: {
      articleSlug: {
        [Op.eq]: slug
      },
      userId: {
        [Op.eq]: userId
      }
    }
  });

  if (!favorites) {
    await Favorites.create({
      userId,
      articleSlug: slug,
      articleId: id
    });
    await article.increment("favoriteCount");
    return httpResponse(res, {
      message: `${title} has been added as your favourite`
    });
  }
  await favorites.destroy();
  await article.decrement("favoriteCount");
  return httpResponse(res, {
    success: true,
    message: `${title} was successfully removed from your favorite lists of articles`
  });
};
