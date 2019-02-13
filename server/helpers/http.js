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
  const response = res.status(statusCode).json({
    success,
    message,
    ...data
  });
  res.end();
  return response;
};
