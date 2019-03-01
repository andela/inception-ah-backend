import { isProd } from "@configs/passport";
/**
 * @description Returns message to client
 *
 * @param {Object} res HTTP response object
 * @param {object} options
 * @returns {Object} HTTP response
 * @method httpResponse
 */
export const httpResponse = (res, options) => {
  let { statusCode, message, success, ...data } = options;
  statusCode = statusCode || 200;
  return res.status(statusCode).json({
    success: success || statusCode < 400,
    message,
    ...data
  });
};
/**
 * @description Returns an server error
 *
 * @param {object} res HTTP response object
 * @param {object} error error object
 * @returns {object} HTTP response
 * @method serverError
 */
export const serverError = (res, error) => {
  return res.status(error.status || 500).json({
    success: false,
    message: isProd
      ? `Sorry, internal error occured, try again later!`
      : error.message
  });
};
