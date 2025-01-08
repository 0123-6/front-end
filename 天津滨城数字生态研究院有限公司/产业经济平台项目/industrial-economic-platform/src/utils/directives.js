/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-11-16 10:49:28
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2023-01-05 09:28:03
 * @FilePath: \intelligent-search-system-web\src\utils\directives.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue from 'vue';

// v-dialogDrag: 弹窗拖拽
Vue.directive('dialogDrag', {
  bind(el, binding, vnode, oldVnode) {
    const dialogHeaderEl = el.querySelector('.el-dialog__header');
    const dragDom = el.querySelector('.el-dialog');
    dialogHeaderEl.style.cursor = 'move';
    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);

    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft;
      const disY = e.clientY - dialogHeaderEl.offsetTop;

      // 获取到的值带px 正则匹配替换
      let styL;
      let styT;

      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/\\%/g, '') / 100);
        styT = +document.body.clientHeight * (+sty.top.replace(/\\%/g, '') / 100);
      } else {
        styL = +sty.left.replace(/\px/g, '');
        styT = +sty.top.replace(/\px/g, '');
      }

      // eslint-disable-next-line func-names
      document.onmousemove = function (ev) {
        // 通过事件委托，计算移动的距离
        const l = ev.clientX - disX;
        const t = ev.clientY - disY;

        // 移动当前元素
        dragDom.style.left = `${l + styL}px`;
        dragDom.style.top = `${t + styT}px`;

        // 将此时的位置传出去
        // binding.value({x:e.pageX,y:e.pageY})
      };

      // eslint-disable-next-line func-names
      document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }
});

// 中文逗号转英文
Vue.directive('comma', {
  update(el, binding, vnode) {
    try {
      // eslint-disable-next-line no-underscore-dangle
      let _value = vnode.data.model.value;
      if (_value && typeof _value === 'string') {
        _value = _value.replace(/，/g, ',');
        vnode.data.model.callback(_value);
      }
    } catch (error) {
      console.error(error);
    }
  }
});
