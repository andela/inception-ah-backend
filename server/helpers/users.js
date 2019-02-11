/**
 * @description Removes all white space character, if any
 *
 * @method cleanString
 * @param {Strng} string The string to remove white space(s)
 * @param {Boolean} removeAll: if false, multiple white space will reduce to single;
 * @returns {Object} An object with trimed attributes
 * @method sanitize
 */
export const sanitize = (string, removeAll) => {
  let all = typeof removeAll !== "undefined" ? removeAll : true;
  if (string) {
    return all
      ? string.trim().replace(/[ ]+/g, "") // remove all white spaces
      : string.trim().replace(/[ ]+/g, " "); // collapse multiple white spaces to single
  }
};

/**
 * @description Get the app base url
 *
 * @param {object} httpRequestOrResponseObj HTTP request object
 * @returns {string} the base url
 * @methodget BaseUrl
 */
export const getBaseUrl = httpRequestOrResponseObj => {
  return `${httpRequestOrResponseObj.protocol}://${httpRequestOrResponseObj.get(
    "host"
  )}/api/v1`;
};
