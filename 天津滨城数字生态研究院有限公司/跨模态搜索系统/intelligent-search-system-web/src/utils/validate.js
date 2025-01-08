/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export default function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}
