import { Op } from "sequelize";
import isEmpty from "lodash.isempty";

import models from "@models";
import { getBaseUrl } from "@helpers/users";
import { httpResponse, serverError } from "@helpers/http";
import { generateUniqueSlug, calculateReadTime } from "@helpers/articles";
import { sendPublishedArticleNotification } from "./notification";
import { findAuthorsArticle } from "@middlewares";

const { Articles, Categories } = models;

/**
 * @description Create a new Article
 *
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @param {object} next express next function
 * @returns {object}  Response message object
 *
 */
export const createArticle = async (req, res, next) => {
  const { title, content, description, imageURL, slug } = req.body;
  const category = await Categories.create({ category: title });
  req.body.categoryId = category.get("id");
  const { userId } = req.user;
  if (slug) {
    req.params = { slug };
    await findAuthorsArticle(req, res, next);
    req.params = { slug };
    await updateArticle(req, res, next);
  } else {
    try {
      const newArticle = await Articles.create({
        title,
        authorId: userId,
        categoryId: req.body.categoryId,
        content,
        description,
        imageURL
      });
      return httpResponse(res, {
        statusCode: 201,
        message: "Article created successfully",
        article: newArticle
      });
    } catch (error) {
      return serverError(res, error);
    }
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
  const userId = req.params.id;
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
  req.body.categoryId = article.get("categoryId");
  const slug = req.params.slug || generateUniqueSlug(req.body.title);
  const readTime = calculateReadTime(req.body.content);
  try {
    req.body.slug = slug;
    const updatedArticle = await article.update(
      { readTime, ...req.body },
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

export const getDraftArticle = async (req, res) => {
  try {
    const { slug, user } = req;
    console.log(slug, user);
    const articleDetails = await Articles.findOne({
      where: {
        authorId: user.userId,
        isPublished: null
      }
    });

    if (!articleDetails) {
      return httpResponse(res, {
        statusCode: 404,
        message: "No Article draft found"
      });
    }
    return httpResponse(res, {
      statusCode: 200,
      message: "Draft found Found",
      article: articleDetails
    });
  } catch (error) {
    serverError(res, error);
  }
};
