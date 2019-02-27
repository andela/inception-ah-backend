import { Op } from "sequelize";
import isEmpty from "lodash.isempty";

import models from "../models";
import { httpResponse, serverError } from "../helpers/http";
import { pagination } from "../helpers/pagination";
import { generateUniqueSlug } from "../helpers/generateUniqueSlug";
import { calculateReadTime } from "../helpers/calculateReadTime";

const { Articles, Users } = models;

/**
 * @description A function to fetch articles and apply pagination.
 *
 * @param {object} options
 * options:
 *  { whereCondition: condition to filter the query,
 *    query: the query parameters for pagination
 *  }
 * @returns {array}  Array of the articles
 */
const fetchArticles = async options => {
  const { pageLimit, offset } = pagination(options.query);
  const articles = await Articles.findAll({
    order: [["createdAt", "DESC"]],
    where: options.whereConditions,
    /* TODO: Add join for Comment, Category, ArticleTags */
    include: [
      {
        model: Users,
        as: "author",
        attributes: ["firstName", "lastName", "imageURL"]
      }
    ],
    limit: pageLimit,
    offset
  });
  return articles;
};

/**
 * @description Create a new Article
 *
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @returns {object}  Response message object
 */
export const createArticle = async (req, res) => {
  const { title, content, description, categoryId } = req.body;
  const { userId } = req.user;
  try {
    const newArticle = await Articles.create({
      title,
      authorId: userId,
      categoryId,
      content,
      description
    });

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
 * @returns {object}  Response message object
 */
export const publishArticle = async (req, res) => {
  const article = req.article;
  try {
    const publishedArticle = await article.update(
      { isPublished: true },
      { fields: ["isPublished"] }
    );
    /* TODO: Fetch followers and send email notification */
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
    const articles = await fetchArticles({
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
      message: "Articles retrived successfully",
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
          model: Users,
          as: "author",
          attributes: ["firstName", "lastName", "imageURL"]
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
    const articles = await fetchArticles({
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
    const authorsArticles = await fetchArticles({
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
