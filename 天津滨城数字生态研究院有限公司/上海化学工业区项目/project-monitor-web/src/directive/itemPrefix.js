
function addPrefix(el, binding, className) {
  // 创建一个新节点
  var newNode = document.createElement("span");
  newNode.classList.add('el-input__prefix')
  // 创建节点内容
  var textNode = document.createTextNode(binding.value);
  // 将内容添加到新节点中
  newNode.appendChild(textNode);
  // 将新节点插入到目标节点中
  var targetNode = el.querySelector(className);
  targetNode.prepend(newNode);
}

export default {
  mounted(el, binding, vnode, prevVnode) {
    if (el.querySelector('.el-date-editor--daterange')) {
      addPrefix(el, binding, ".el-date-editor")
      return
    } else if (el.querySelector('.el-cascader')) {
      addPrefix(el, binding, ".el-cascader .el-input__wrapper")
      return
    }
    el.querySelector('.el-input__prefix-inner').innerHTML = binding.value
  },
}