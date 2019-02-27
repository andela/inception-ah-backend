import { readingTime } from "reading-time-estimator";

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
