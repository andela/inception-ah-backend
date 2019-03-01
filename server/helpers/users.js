import { generateJWT, getJWTConfigs } from "@helpers/jwt";

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

/**
 * @description format the user JSON
 *
 * @param  {object} user instance of User model
 * @returns {object} responseObject
 */
export const userResponse = user => {
  const { id, email, biography, imageURL } = user.dataValues;
  return {
    id,
    email,
    biography,
    imageURL,
    token: generateJWT(
      { userId: id },
      getJWTConfigs({ option: "authentication" })
    )
  };
};

/**
 * @description get user profile
 *
 * @param  {object} user instance of User
 * @returns {object} responseObject
 */
export const userProfileResponse = user => {
  const {
    id,
    firstName,
    middleName,
    biography,
    lastName,
    gender,
    mobileNumber,
    imageURL
  } = user.dataValues;
  return {
    id,
    firstName,
    middleName,
    lastName,
    gender,
    biography,
    mobileNumber,
    imageURL
  };
};
