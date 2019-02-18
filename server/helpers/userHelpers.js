/**
 * @description Get the app base url
 *
 * @param {object} httpObj HTTP request object
 * @returns {string} the base url
 * @methodget BaseUrl
 */

export const getBaseUrl = httpObj => {
  return `${httpObj.protocol}://${httpObj.get("host")}/api/v1`;
};
