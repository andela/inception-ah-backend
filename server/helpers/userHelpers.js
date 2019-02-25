/**
 * @description Get the app base url
 *
 * @param {object} httpReqeustObject HTTP request object
 * @returns {string} the base url
 * @methodget BaseUrl
 */

export const getBaseUrl = httpReqeustObject => {
  return `${httpReqeustObject.protocol}://${httpReqeustObject.get(
    "host"
  )}/api/v1`;
};
