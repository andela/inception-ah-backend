import isEmpty from "lodash.isempty";
import models from "@models";
import { httpResponse, serverError } from "@helpers/http";

const { Tags, Articles } = models;
const { Op } = models.Sequelize;

/**
 * Get a specific tag from storage
 *
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @param {function} next http callback
 * @returns {object} HTTP response
 * @method getTag
 */
export const getTag = async (req, res) => {
  try {
    const { tagId } = req.params;
    const tag = await Tags.findByPk(tagId, {
      include: [Articles]
    });

    return httpResponse(res, {
      statusCode: isEmpty(tag) ? 404 : 302,
      message: isEmpty(tag) ? "Tag not found" : "Tag successfully retrieved",
      tag
    });
  } catch (error) {
    serverError(res, error);
  }
};

/**
 * Get all tags from storage
 *
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @returns {object} HTTP response
 * @param {function} next HTTP callback
 * @method getAllTags
 * @see searchTags
 */
export const getAllTags = async (req, res, next) => {
  if (req.query.search) {
    return next();
  }
  try {
    const { search } = req.query;
    const tags = await Tags.findAll();
    const response = {};
    if (isEmpty(tags)) {
      response.message = "Tags not found";
      response.statusCode = 404;
    }
    return httpResponse(res, {
      statusCode: response.statusCode || 302,
      message: response.message || "List of tags",
      tags
    });
  } catch (error) {
    serverError(res, error);
  }
};

/**
 * Get all tags that matches a search from storage
 *
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @returns {object} HTTP response
 * @method searchTags
 * @see getAllTags
 */
export const searchTags = async (req, res) => {
  try {
    const { search } = req.query;
    let tags;
    if (models.sequelize.getDialect() === "sqlite") {
      const result = await models.sequelize.query(
        `SELECT * FROM tags WHERE tag LIKE '%${search}%' COLLATE NOCASE`
      );
      tags = result[0]; // Get the tags array from result
    } else {
      tags = await Tags.findAll({
        where: { tag: { [Op.iLike]: `%${search}%` } }
      });
    }
    const response = {};
    if (isEmpty(tags)) {
      response.message = "No result matches your search";
      response.statusCode = 404;
    }
    return httpResponse(res, {
      statusCode: response.statusCode || 302,
      message: response.message || "List of tags",
      tags
    });
  } catch (error) {
    serverError(res, error);
  }
};

/**
 * Update a tag instance
 *
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @returns {object} HTTP object
 * @method updateTag
 */
export const updateTag = async (req, res) => {
  try {
    const { tagId } = req.params;
    const foundTag = await Tags.findByPk(tagId);
    const response = {};
    if (isEmpty(foundTag)) {
      response.statusCode = 404;
      response.message = "Tag does not exist";
    } else if (foundTag) {
      /**
       * Since tags are unique, we need to make sure the new tag does not exist
       * We'll query our storage using the new tag to check if it exists
       */
      const tag = await Tags.findOne({
        where: { tag: req.body.tag }
      });
      /**
       * Prevent creating duplicate tags when updating a specific tag
       */
      if (!isEmpty(tag) && tag.get("id") !== tagId) {
        return httpResponse(res, {
          statusCode: 409,
          message: "Tag already exist"
        });
      }
      foundTag.tag = req.body.tag;
      await foundTag.save();
    }

    httpResponse(res, {
      statusCode: response.statusCode || 200,
      message: response.message || "Tag updated successfully",
      tag: foundTag
    });
  } catch (error) {
    serverError(res, error);
  }
};

/**
 * Delete an instance of a tag
 *
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @returns {object} HTTP response
 * @method deleteTag
 */
export const deleteTag = async (req, res) => {
  try {
    const { tagId } = req.params;
    const tagInstance = await Tags.findByPk(tagId, {
      include: [Articles]
    });
    if (isEmpty(tagInstance)) {
      return httpResponse(res, {
        statusCode: 404,
        message: "Tag not found"
      });
    }
    /**
     * We have restricted deleting a Tag instance that is being reference
     * So, we need the above check
     */
    const response = {};
    if (!isEmpty(tagInstance.Articles)) {
      response.statusCode = 403;
      response.message = "Tag cannot be deleted";
    } else await tagInstance.destroy();

    httpResponse(res, {
      statusCode: response.statusCode || 200,
      message:
        response.message || `${tagInstance.tag} tag succcessfully deleted`
    });
  } catch (error) {
    serverError(res, error);
  }
};
