import slug from "slug";
import { getTime } from "date-fns";

/**
 * @description function to generate unique slug
 * @param {string} title - article title
 * @returns {function} random string
 */
export const generateUniqueSlug = title => {
  return `${slug(title.toLowerCase())}-${getTime(new Date())}`;
};
