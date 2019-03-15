/**
 * @description Perform an async operation on array items
 *
 * @param {array} array array to iterate
 * @param {function} callback a callback function
 * @returns {Promise} a promise that resolves
 * @method mapAsync
 */
export const mapAsync = async (array, callback) => {
  const result = [];
  const LENGTH = array.length;
  for (let i = 0; i < LENGTH; i++) {
    result[i] = await callback.call(this, await array[i]);
  }
  return result;
};
