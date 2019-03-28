import { Op } from "sequelize";
import isEmpty from "lodash.isempty";

import models from "@models";
import { getBaseUrl } from "@helpers/users";
import { httpResponse, serverError } from "@helpers/http";
import {
  generateUniqueSlug,
  calculateReadTime,
  searchBuilder
} from "@helpers/articles";
import { pagination } from "@helpers/pagination";
import { sendPublishedArticleNotification } from "./notification";

const { Articles, Ratings, Users, Categories } = models;

/**
 * @description Create a new Article
 *
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @returns {object}  Response message object
 */
export const createArticle = async (req, res) => {
  const { title, content, description, /* categoryId, */ tags } = req.body;
  const category = await Categories.create({ category: title });
  const { userId } = req.user;
  try {
    const newArticle = await Articles.create({
      title,
      authorId: userId,
      categoryId: category.get("id"),
      content,
      description: content.substring(0, 200)
    });
    await newArticle.saveTags(tags);
    return httpResponse(res, {
      statusCode: 201,
      message: "Article created successfully",
      article: newArticle
    });
  } catch (error) {
    return serverError(res, error);
  }
};

/**
 * @description Publish an unpublished Article
 *
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @param {function} next
 * @returns {object}  Response message object
 */
export const publishArticle = async (req, res, next) => {
  const { article } = req;
  try {
    const publishedArticle = await article.update(
      { isPublished: true },
      { fields: ["isPublished"] }
    );
    /* TODO: Fetch followers and send email notification */
    const url = `${getBaseUrl(req)}/articles/${article.slug}`;
    await sendPublishedArticleNotification(
      article.authorId,
      article.slug,
      article.id,
      url,
      next
    );
    return httpResponse(res, {
      message: "Article published successfully",
      publishedArticle
    });
  } catch (error) {
    return serverError(res, error);
  }
};

/**
 * @description Get all published Articles
 *
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @returns {object}  Response message object
 */
export const getAllArticles = async (req, res) => {
  try {
    const articles = await Articles.fetchArticles({
      whereConditions: {
        isPublished: true
      },
      query: req.query
    });

    if (isEmpty(articles)) {
      return httpResponse(res, {
        statusCode: 404,
        message: "No published articles yet"
      });
    }
    return httpResponse(res, {
      message: "Articles retrieved successfully",
      articles
    });
  } catch (error) {
    return serverError(res, error);
  }
};

/**
 * @description Get one Article by Slug
 *
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @returns {object}  Response message object
 */
export const getArticleBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const article = await Articles.findOne({
      where: {
        slug: {
          [Op.eq]: slug
        }
      },
      /* TODO: Add join for Comment, Category, ArticleTags */
      include: [
        {
          model: models.Users,
          as: "author",
          attributes: ["firstName", "lastName", "imageURL"]
        },
        {
          model: models.Tags,
          attributes: ["id", "tag"]
        },
        {
          model: models.Reactions,
          as: "articleReactions"
        },
        {
          model: models.Comments,
          as: "articleComments"
        }
      ]
    });
    if (isEmpty(article)) {
      return httpResponse(res, {
        statusCode: 404,
        message: "Article not found"
      });
    }
    return httpResponse(res, {
      message: "Article retrieved successfully",
      article
    });
  } catch (error) {
    return serverError(res, error);
  }
};

/**
 * @description Get one Article by Category
 *
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @returns {object}  Response message object
 */
export const getArticlesByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const articles = await Articles.fetchArticles({
      whereConditions: {
        categoryId
      },
      query: req.query
    });
    if (isEmpty(articles)) {
      return httpResponse(res, {
        statusCode: 404,
        message: "Articles not found"
      });
    }
    return httpResponse(res, {
      message: "Articles retrieved successfully",
      articles: articles
    });
  } catch (error) {
    return serverError(res, error);
  }
};

/**
 * @description Get all Articles by an author
 *
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @returns {object}  Response message object
 */
export const getAuthorsArticles = async (req, res) => {
  const { userId } = req.user;
  try {
    const authorsArticles = await Articles.fetchArticles({
      whereConditions: {
        authorId: userId
      },
      query: req.query
    });
    if (isEmpty(authorsArticles)) {
      return httpResponse(res, {
        statusCode: 404,
        message: "Articles not found"
      });
    }
    return httpResponse(res, {
      statusCode: 200,
      message: "Articles retrieved successfully",
      articles: authorsArticles
    });
  } catch (error) {
    return serverError(res, error);
  }
};

/**
 * @description Update an Article
 *
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @returns {object}  Response message object
 */
export const updateArticle = async (req, res) => {
  const article = req.article;
  const slug = generateUniqueSlug(req.body.title);
  const readTime = calculateReadTime(req.body.content);
  try {
    const updatedArticle = await article.update(
      { slug, readTime, ...req.body },
      { fields: ["slug", "readTime", ...Object.keys(req.body)] }
    );
    await article.saveTags(req.body.tags);
    return httpResponse(res, {
      statusCode: 200,
      success: true,
      message: "Article updated successfully",
      article: updatedArticle
    });
  } catch (error) {
    return serverError(res, error);
  }
};

/**
 * @description Delete an Article
 *
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @returns {object}  Response message object
 */
export const deleteArticle = async (req, res) => {
  try {
    const article = req.article;
    await article.destroy();
    return httpResponse(res, {
      statusCode: 200,
      success: true,
      message: "Article deleted successfully"
    });
  } catch (error) {
    return serverError(res, error);
  }
};

export const rateArticle = async (req, res) => {
  const { slug, user, article } = req;
  const articleId = article.get("id");
  const raterId = user.userId;
  const { score } = req.body;
  const validScore = score < 6 && score > 0;

  try {
    const rating = await Ratings.findOne({
      where: { raterId: user.userId, articleId }
    });

    if (validScore && article.isPublished) {
      if (rating) {
        await Ratings.update({ score }, { where: { articleId } });
        httpResponse(res, {
          message: `Rating Updated for ${slug}`,
          statusCode: 202,
          data: { score }
        });
      } else {
        await Ratings.create({ articleId, raterId, score });
        httpResponse(res, {
          message: `Rating Added for ${slug}`,
          statusCode: 201,
          data: { score }
        });
      }
    } else {
      httpResponse(res, {
        success: false,
        message: "Rating is not in range of 1 - 5 or Article is not published",
        statusCode: 400,
        data: null
      });
    }
  } catch (e) {
    httpResponse(res, {
      success: false,
      message: "An internal Server Error occured, Rating failed",
      statusCode: 500,
      data: null
    });
  }
};

/**
 * Get Articles and Respective authors that contains specified
 * query keyword in either the Articles title or description
 * /articles/search&query={title|description}&pageLimit&offset
 * @param {*} req HttpServerRequest Object
 * @param {*} res HttpServerResponse Object
 */
export const searchArticle = async (req, res) => {
  let { query, pageLimit, pageNumber } = req.query;

  pageLimit = pageLimit < 0 ? 0 : pageLimit;
  pageNumber = pageNumber < 0 ? 0 : pageNumber;
  query = query || null;

  // return early avoid search for empty query
  if (!query) {
    httpResponse(res, {
      success: true,
      message: "empty query supplied",
      statusCode: 404,
      data: []
    });
  }
  const { limit, offset } = pagination({ pageLimit, pageNumber });
  const results = await Articles.findAll({
    where: searchBuilder(query, Op),
    limit,
    offset,
    include: [{ model: Users, as: "author" }]
  });
  const articles = results.map(data => {
    const { dataValues } = data;
    const { author } = dataValues;
    const { password, email, resetToken, ...authorsData } = author.dataValues;
    return { article: dataValues, author: authorsData };
  });
  httpResponse(res, {
    success: true,
    message: "successfull",
    statusCode: 200,
    data: articles
  });
};
