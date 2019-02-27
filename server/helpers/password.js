import bcrypt from "bcrypt";

/**
 * @description Hash a string
 *
 * @param {string} password the password to encrypt
 * @returns {string} the encypted password
 * @method hashPassword
 */
export const hashPassword = password => {
  if (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  }
};

/**
 * @description Compare two string representation of password to determine if they are the same
 *
 * @param {String} password Unhashed representaton of password
 * @param {String} hash Hashed representation of password
 * @returns {boolean} true if the two representation of password are the same
 * @method comparePassword
 */
export const comparePassword = async (password, hash) => {
  const equals = bcrypt.compare(password, hash);
  return Promise.resolve(equals);
};
