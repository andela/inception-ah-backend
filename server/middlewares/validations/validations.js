import isEmpty from "lodash.isempty";
import { validateData } from "../../validations/validateData";
import { signUpSchema, signInSchema } from "../../validationSchemas/user";
import { httpResponse, serverError } from "../../helpers/http";
import models from "../../models";

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
    "/signin": signInSchema
  };
  const validation = await validateData(req.body, schemas[req.path]);
  if (validation.hasError) {
    return httpResponse(res, {
      statusCode: 400,
      errorMessages: validation.errors
    });
  }
  req.body = validation.fields;
  next();
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
