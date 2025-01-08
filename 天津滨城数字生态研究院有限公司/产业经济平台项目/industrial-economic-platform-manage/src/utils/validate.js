/**
 * @param {string} path
 * @returns {Boolean}
 */
export default function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * @param {object} obj
 * @returns {Boolean}
 */
export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

/**
 * 手机号验证
 * @returns {Boolean}
 */
export function validatePhone(rule, value, callback) {
  const re = /^1[3456789]\d{9}$/;
  if (value && !re.test(value)) {
    callback(new Error('请输入合法的手机号'));
  } else {
    callback();
  }
}

/**
 * 邮箱验证
 * @returns {Boolean}
 */
export function validateEmail(rule, value, callback) {
  const re = /^[A-Za-z0-9]+([_.][A-Za-z0-9]+)*@([A-Za-z0-9-]+\.)+[A-Za-z]{2,6}$/;
  if (!re.test(value)) {
    callback(new Error('请输入合法的邮箱号'));
  } else {
    callback();
  }
}

/**
 * 支持中英文，不支持特殊字符和空格验证
 * @returns {Boolean}
 */
export function validateName(rule, value, callback) {
  const re = /^[A-Za-z\u4e00-\u9fa5]+$/;
  if (!re.test(value)) {
    callback(new Error('请输入合法的姓名'));
  } else {
    callback();
  }
}

/**
 * 可使用手机号、姓名创建账号，支持文字、数字、字母，不支持特殊符号和空格验证
 * @returns {Boolean}
 */
export function validateAccount(rule, value, callback) {
  const re = /^[A-Za-z0-9]{1,18}$/;
  if (!re.test(value)) {
    callback(new Error('请输入合法的姓名'));
  } else {
    callback();
  }
}

export function validatePassword(rule, value, callback) {
  const re = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%^&!*+=._-])[a-zA-Z\d@#$%^&!*+=._-]{6,16}$/;
  if (!re.test(value)) {
    callback(new Error('请输入合法的密码'));
  } else {
    callback();
  }
}
