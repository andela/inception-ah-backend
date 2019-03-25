/**
 * @description Perform an async operation on array items
 *
 * @param {array} array array to iterate
 * @param {function} callback a callback function
 * @returns {Promise} a promise that resolves
 * @method mapAsync
 */
export const mapAsync = async (array, callback) => {
  return Promise.all(
    array.map(async item => {
      return await callback.call(this, item);
    })
  );
};
