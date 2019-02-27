/**
 *  Format validation error message
 *
 * @param {object} errors the validation error
 * @param {string} label
 * @param {string} message message to be displayed
 * @returns {string} the formatted error message
 */
export const errorFormatter = (errors, label, message) => {
  const err = errors[0];
  switch (err.type) {
    case "string.regex.base":
      return message || `${label || err.path} is inavlid`;
    default:
      return err;
  }
};
