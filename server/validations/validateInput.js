import Joi from "joi";

/**
 * Validate User Input
 * @param {object} inputData
 * @param {object} schema
 * @returns {boolean|array} true if no error | array of errors
 */
export const validateInput = async (inputData, schema) => {
  try {
    await Joi.validate(inputData, schema, {
      abortEarly: false
    });
    return true;
  } catch (errors) {
    const errorMessages = errors.details.map(error => {
      return error.message.replace(/"/g, "");
    });
    return { errorMessages };
  }
};
