// 滚动条自动隐藏
let t1 = 0;
let t2 = 0;
let timer = null;
document.styleSheets[0].addRule('*::-webkit-scrollbar-thumb', 'display:none;');

// scroll监听
// eslint-disable-next-line func-names
document.onscroll = function () {
  clearTimeout(timer);
  // eslint-disable-next-line no-use-before-define
  timer = setTimeout(isScrollEnd, 1000);
  t1 = document.documentElement.scrollTop || document.body.scrollTop;
  document.styleSheets[0].addRule('*::-webkit-scrollbar-thumb', 'display:block;');
};

function isScrollEnd() {
  t2 = document.documentElement.scrollTop || document.body.scrollTop;
  if (t2 === t1) {
    document.styleSheets[0].addRule('*::-webkit-scrollbar-thumb', 'display:none;');
  }
}
