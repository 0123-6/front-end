function removeScript(context) {
  // 防止脚本攻击
  context = context.replace(/<script/g, '*script');
  return context.replace(/<\/script/g, '*script');
}

function addBlank(context) {
  // nbsp 空格替换
  context = context.replace(/\s/g,
    `&nbsp;`);
  return context;
}

// Vue文本高亮
function highlightText(el, binding, setting) {
  var context = binding.value[0];
  var lightTextArray = binding.value[1];
  var color = binding.value[2];
  context = addBlank(context);

  // if (lightText === '' || !lightText) {
  //   return removeScript(context)
  // }
  if (lightTextArray.length === 0 || !lightTextArray) {
    return removeScript(context);
  }
  for (let i = 0; i < lightTextArray.length; i++) {
    const lightText = lightTextArray[i];
    var lightRegExp = new RegExp(lightText, 'g');
    if (color) {
      context = context.replace(lightRegExp,
        `<span style="color: ${color};">${lightText}</span>`);
    } else {
      context = context.replace(lightRegExp,
        `<span class="${setting.defaultClass}">${lightText}</span>`);
    }
  }
  return removeScript(context);
}

export default function VueHighLight(Vue, setting) {
  if (!setting) {
    setting = {};
  }
  if (setting.defaultClass) {
    setting.defaultClass = 'default-class';
  }
  Vue.directive('light', {
    // 当被绑定的元素插入到 DOM 中时……
    inserted: function(el, binding) {
      el.innerHTML = highlightText(el, binding, setting);
    },
    update: function(el, binding) {
      el.innerHTML = highlightText(el, binding, setting);
    }
  });
}
