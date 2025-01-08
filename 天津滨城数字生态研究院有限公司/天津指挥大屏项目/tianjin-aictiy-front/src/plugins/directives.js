
import Vue from 'vue';

// v-dialogDrag: 弹窗拖拽
Vue.directive('dialogDrag', {
  bind(el, binding, vnode, oldVnode) {
    return
    const dialogHeaderEl = el.firstElementChild.querySelector('.head');
    const dragDom = el
    console.log('dragDom:',dragDom)
    console.log('dialogHeaderEl:',dialogHeaderEl)
    dialogHeaderEl.style.cursor = 'move';
    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);

    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft;
      const disY = e.clientY - dialogHeaderEl.offsetTop;

      // 获取到的值带px 正则匹配替换
      let styL, styT;

      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100);
        styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100);
      } else {
        styL = +sty.left.replace(/px/g, '');
        styT = +sty.top.replace(/px/g, '');
      }

      document.onmousemove = function(e) {
        // 通过事件委托，计算移动的距离
        const l = e.clientX - disX;
        const t = e.clientY - disY;

        // 移动当前元素
        dragDom.style.left = `${l + styL}px`;
        dragDom.style.top = `${t + styT}px`;

        // 将此时的位置传出去
        // binding.value({x:e.pageX,y:e.pageY})
        let pos = {
          x:e.pageX,
          y:e.pageY,
        }
        console.log(pos)
      };

      document.onmouseup = function(e) {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }
});

Vue.directive('resize', { // 指令的名称
  bind(el, binding) { // el为绑定的元素，binding为绑定给指令的对象
    let width = ''; let height = '';
    function isReize() {
      const style = document.defaultView.getComputedStyle(el);
      if (width !== style.width || height !== style.height) {
        binding.value(); // 关键
      }
      width = style.width;
      height = style.height;
    }
    el.__vueSetInterval__ = setInterval(isReize, 300);
  },
  unbind(el) {
    clearInterval(el.__vueSetInterval__);
  }
});

// v-dialogDragWidth: 弹窗宽度拖大 拖小
Vue.directive('dialogDragWidth', {
  bind(el, binding, vnode, oldVnode) {
    const dragDom = binding.value.$el.querySelector('.el-dialog');

    el.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - el.offsetLeft;

      document.onmousemove = function(e) {
        e.preventDefault(); // 移动时禁用默认事件

        // 通过事件委托，计算移动的距离
        const l = e.clientX - disX;
        dragDom.style.width = `${l}px`;
      };

      document.onmouseup = function(e) {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }
});

// test
Vue.directive('focus', {
  // 当被绑定的元素插入到DOM中时
  inserted: function(el) {
    el.focus();
  }
});

