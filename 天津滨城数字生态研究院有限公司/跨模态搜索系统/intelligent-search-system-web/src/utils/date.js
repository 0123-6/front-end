/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'undefined' || time === null || time === 'null') {
    return '';
  }
  if (typeof time === 'object') {
    date = time;
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      // eslint-disable-next-line no-param-reassign
      time = parseInt(time, 10);
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      // eslint-disable-next-line no-param-reassign
      time *= 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  return format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value];
    }
    if (result.length > 0 && value < 10) {
      value = `0${value}`;
    }
    return value || 0;
  });
}

export function changeTimeToBegin(date) {
  let d = new Date(date);
  d.setHours(0, 0, 0);
  d = parseTime(d);
  return d;
}

export function changeTimeToLast(date) {
  let d = new Date(date);
  d.setHours(23, 59, 59);
  d = parseTime(d);
  return d;
}
