import slug from "slug";
import { getTime } from "date-fns";
import { readingTime } from "reading-time-estimator";

/**
 * @description function to generate unique slug
 * @param {string} title - article title
 * @returns {function} random string
 */
export const generateUniqueSlug = title => {
  return `${slug(title.toLowerCase())}-${getTime(new Date())}`;
};

/**
 * @description function to calculate estimated amount of time to read an article
 * @param {string} content - article content
 * @returns {function} time in minutes to the nearest whole number
 */
export const calculateReadTime = content => {
  const result = readingTime(content);

  const readTime = Math.round(result.minutes).toFixed(0);
  return readTime <= 0 ? 1 : readTime;
};
