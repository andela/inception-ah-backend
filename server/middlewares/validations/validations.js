import isEmpty from "lodash.isempty";
import models from "@models";
import { validator } from "@validations/validator";
import {
  signUpSchema,
  signInSchema,
  articleSchema,
  updateProfileSchema,
  commentSchema
} from "@schemas";
import { httpResponse, serverError } from "@helpers/http";

const { Users } = models;

/**
 * Validate input
 *
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @param {function} next callback
 * @returns {funcion} HTTP response
 */
export const validateInput = async (req, res, next) => {
  // Map Schema definitions to route path
  //This willenable us access the specific schema we need for the current validation
  const schemas = {
    "/signup": signUpSchema,
    "/signin": signInSchema,
    "/articles": articleSchema,
    "/updateProfile": updateProfileSchema,
    "/comments": commentSchema
  };

  const validation = await validator(
    req.body,
    schemas[`/${req.path.split("/").pop()}`]
  );
  if (validation.hasError) {
    return httpResponse(res, {
      statusCode: 400,
      errorMessages: validation.errors
    });
  }
  req.body = validation.fields;
  return next();
};

/**
 * Check if an email has been used
 *
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @param {function} next callback
 * @returns {object} HTTP response
 */
export const checkUniqueEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const foundUser = await Users.findOne({
      attributes: ["email"],
      where: { email }
    });
    return !isEmpty(foundUser)
      ? httpResponse(res, {
          statusCode: 409,
          message: "Email has already been used"
        })
      : next();
  } catch (error) {
    serverError(res, error);
  }
};

/* eslint-disable no-restricted-globals */
/**
 * @description - Method to validate the query param for pagination
 *
 * @param {object} req - request sent to the server
 * @param {object} res - response gotten from the server
 * @param {function} next - callback function to continue execution
 * @returns {object} - object representing response message
 */
export const validatePaginationParameters = (req, res, next) => {
  const { pageNumber, pageLimit } = req.query;
  if (pageNumber && isNaN(pageNumber)) {
    return res.status(400).json({
      success: false,
      message: "Page number can only be an Integer"
    });
  }
  if (pageLimit && isNaN(pageLimit)) {
    return res.status(400).json({
      success: false,
      message: "Page limit can only be an Integer"
    });
  }
  if (pageLimit < 0) {
    return res.status(400).json({
      success: false,
      message: "Page limit must not be negative"
    });
  }
  if (pageNumber < 0) {
    return res.status(400).json({
      success: false,
      message: "Page number must not be negative"
    });
  }
  return next();
};
