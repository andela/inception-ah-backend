import Joi from "joi";

/**
 * Validate User Input
 * @param {object} inputData
 * @param {object} schema
 * @returns Promise(object|array)true if no error | array of errors
 */

export const validateData = async (inputData, schema) => {
  try {
    await Joi.validate(inputData, schema, {
      abortEarly: false
    });
    return {};
  } catch (errors) {
    const errorMessages = errors.details.map(error => {
      return error.message.replace(/"/g, "");
    });
    return { errorMessages };
  }
};
