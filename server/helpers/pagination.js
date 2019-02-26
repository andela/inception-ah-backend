/* eslint-disable radix */
import { PAGE_LIMIT_DEFAULT, PAGE_NUMBER_DEFAULT } from "./constants";

/**
 * @description Pagination helper
 *
 * @param {object} query
 * @returns {object} - object containing limit and offset
 */

export const pagination = query => {
  const pageNumber = parseInt(query.pageNumber) || PAGE_NUMBER_DEFAULT;
  const pageLimit = parseInt(query.pageLimit) || PAGE_LIMIT_DEFAULT;
  const offset = pageLimit * (pageNumber - 1);
  return { pageLimit, offset };
};
