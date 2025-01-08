function removeScript(context) {
  // 防止脚本攻击
  // eslint-disable-next-line no-param-reassign
  context = context.replace(/<script/g, '*script');
  return context.replace(/<\/script/g, '*script');
}

function addBlank(context) {
  // nbsp 空格替换
  // eslint-disable-next-line no-param-reassign
  context = context.replace(/\s/g, '&nbsp;');
  return context;
}

// Vue文本高亮
function highlightText(el, binding, setting) {
  let context = binding.value[0];
  const lightTextArray = binding.value[1];
  const color = binding.value[2];
  context = addBlank(context);

  // if (lightText === '' || !lightText) {
  //   return removeScript(context)
  // }
  if (lightTextArray.length === 0 || !lightTextArray) {
    return removeScript(context);
  }
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < lightTextArray.length; i++) {
    const lightText = lightTextArray[i];
    const lightRegExp = new RegExp(lightText, 'g');
    if (color) {
      context = context.replace(
        lightRegExp,
        `<span class="${color}">${lightText}</span>`
      );
    } else {
      context = context.replace(
        lightRegExp,
        `<span class="${setting.defaultClass}">${lightText}</span>`
      );
    }
  }
  return removeScript(context);
}

export default function VueHighLight(Vue, setting) {
  if (!setting) {
    // eslint-disable-next-line no-param-reassign
    setting = {};
  }
  if (setting.defaultClass) {
    // eslint-disable-next-line no-param-reassign
    setting.defaultClass = 'default-class';
  }
  Vue.directive('light', {
    // 当被绑定的元素插入到 DOM 中时……
    inserted(el, binding) {
      // eslint-disable-next-line no-param-reassign
      el.innerHTML = highlightText(el, binding, setting);
    },
    update(el, binding) {
      // eslint-disable-next-line no-param-reassign
      el.innerHTML = highlightText(el, binding, setting);
    }
  });
}
