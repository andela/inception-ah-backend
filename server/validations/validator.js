import Joi from "joi";

/**
 * @description Validate User Input
 *
 * @param {object} inputData
 * @param {object} schema
 * @returns {object} true if no error | array of errors
 */

export const validator = async (inputData, schema) => {
  try {
    const fields = await Joi.validate(inputData, schema, {
      abortEarly: false
    });
    return { hasError: false, fields };
  } catch ({ details }) {
    const errors = {};
    details.forEach(err => {
      errors[err.path[0]] =
        errors[err.path[0]] || err.message.replace(/"/g, "");
    });
    return { hasError: true, errors };
  }
};
