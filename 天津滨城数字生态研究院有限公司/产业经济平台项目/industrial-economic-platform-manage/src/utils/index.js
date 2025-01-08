/*eslint-disable*/
import dayjs from 'dayjs';
import { myMessage } from '@/plugins/resetMessage';

export function replaceStr(str, reg, newStr) {
  if (!str) return '';
  return str.replace(new RegExp(reg, 'g'), (match) => newStr);
}

export function flatNodes(data, leafOnly) {
  return data.reduce((res, node) => {
    if (!node.children || node.children.length === 0) {
      res.push(node);
    } else {
      !leafOnly && res.push(node);
      res = res.concat(flatNodes(node.children, leafOnly));
    }
    return res;
  }, []);
}

export function getTimeDiff(begin, end) {
  let beginDate = dayjs(begin)
  let nowDate = dayjs().startOf('day');
  let diff = dayjs(end).diff(nowDate.isBefore(beginDate) ? beginDate : nowDate, 'hour', true) / 24
  // console.log('diff', diff)
  return diff <= 0 ? 0 : Math.ceil(diff)
}

export function copyToClipboard(text) {
  // 检查浏览器是否支持 Clipboard API
  if (!navigator.clipboard) {
    // 如果不支持，则使用传统的 document.execCommand("copy") 方式
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    myMessage({
      type: 'success',
      message: '复制成功',
      duaration: 1000
    })
    return;
  }

  // 使用 Clipboard API 复制内容到剪切板
  navigator.clipboard.writeText(text).then(
    function () {
      myMessage({
        type: 'success',
        message: '复制成功',
        duaration: 1000
      })
    },
    function () { }
  );
}

export function getRowIndex(index, curPage, pageSize) {
  return (curPage - 1) * pageSize + index + 1;
}

export function traverseTree(node, callback) {
  callback(node)
  if (node.children && node.children.length) {
    node.children.forEach(child => {
      traverseTree(child, callback)
    })
  }
}

export function findNodeByDFS(root, callback) {
  let result = null
  traverseTree(root, node => {
    if (callback(node)) {
      result = node
    }
  })
  return result
}
