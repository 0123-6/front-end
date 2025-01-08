export function downLoadFile(data, fileName, type, fileType = 'xlsx') {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const eleLink = document.createElement('a');
  eleLink.download = `${fileName}.${fileType}`;
  eleLink.style.display = 'none';
  eleLink.href = url;
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // 然后移除
  document.body.removeChild(eleLink);
}
