<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-07-07 11:17:29
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-06 09:04:01
 * @FilePath: \ai-platform-front-end-project\src\components\ImageWithLabel\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="image-with-label-container">
    <canvas id="imgCanvas" ref="imgCanvas" :width="initWidth" :height="initWidth" />
    <div v-if="isShowBtn" class="operation-container">
      <div
        class="icon-button"
        :class="{'active': canButtonMove}"
        @mousemove="changeHoverButtonType('hand')"
        @mouseout="changeHoverButtonType('')"
        @click="changeCanButtonMove"
      >
        <svg-icon
          :class-name="hoverButtonType === 'hand' || canButtonMove?'card-hand-hover-icon':'card-hand-icon'"
          :icon-class="hoverButtonType === 'hand' || canButtonMove?'card-hand-hover':'card-hand'"
        />
      </div>
      <div
        class="icon-button"
        @mousemove="changeHoverButtonType('zoom-out')"
        @mouseout="changeHoverButtonType('')"
        @click="changeScale(0.04)"
      >
        <svg-icon
          :class-name="hoverButtonType === 'zoom-out'?'card-zoom-out-hover-icon':'card-zoom-out-icon'"
          :icon-class="hoverButtonType === 'zoom-out'?'card-zoom-out-hover':'card-zoom-out'"
        />
      </div>
      <div
        class="icon-button"
        @mousemove="changeHoverButtonType('zoom-in')"
        @mouseout="changeHoverButtonType('')"
        @click="changeScale(-0.04)"
      >
        <svg-icon
          :class-name="hoverButtonType === 'zoom-in'?'card-zoom-in-hover-icon':'card-zoom-in-icon'"
          :icon-class="hoverButtonType === 'zoom-in'?'card-zoom-in-hover':'card-zoom-in'"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    labelConfig: {
      type: Array,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    // 放大缩小的控制类型。 按钮/鼠标 button/mouse
    canvasControlType: {
      type: String,
      default: 'button'
    },
    isShowBtn: {
      type: Boolean,
      default: true
    },
    initWidth: {
      type: Number,
      default: 600
    },
    initImageConfig: {
      type: Object,
      default: () => {
        return {
          width: 0,
          height: 0
        };
      }
    },
    // 是否需要改变标注框颜色-搭配highCanvasLabelInfo使用，试下实现点击标签，标注功能
    isNeedChangeRectFill: {
      type: Boolean,
      default: false
    },
    // 当前高亮标签信息-搭配isNeedChangeRectFill使用，试下实现点击标签，标注功能
    highCanvasLabelInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      canvas: null,
      context: null, // 画布
      imageObj: null, // 图片
      imgH: 0, // 图片的高
      imgW: 0, // 图片的宽
      initImgW: 0, // 图片的初始宽
      initImgH: 0, // 图片的初始高
      beginX: 0, // 最终渲染x轴坐标
      beginY: 0, // 最终渲染y轴坐标
      PO: { x: 0, y: 0 }, // 这里用改变坐标原点的方式来画图，让坐标原点始终在图片的中心
      scale: 1, //  缩放比例
      rectList: [
        // {
        //   rectX: 0, // 标注框的X
        //   rectY: 0, // 标注框的Y
        //   initRectX: 0, // 标注框的初始X
        //   initRectY: 0, // 标注框的初始Y
        //   rectH: 0, // 标注框的高
        //   rectW: 0, // 标注框的宽
        //   color: '' // 标注框的颜色
        // }
      ],
      canButtonMove: false,
      canMove: false,
      canScale: false,
      hoverButtonType: ''
    };
  },
  watch: {
    imageUrl: function() {
      this.$nextTick(() => this.initCanvas());
    },
    highCanvasLabelInfo: {
      handler(newItem, oldItem) {
        if (this.isNeedChangeRectFill) {
          for (let i = 0; i < this.rectList.length; i++) {
            const item = this.rectList[i];
            if ((item.initRectX === newItem.x) && (item.initRectY === newItem.y)) {
              item.fillStyle = item.activeStyle;
            } else if (oldItem && (item.initRectX === oldItem.x) && (item.initRectY === oldItem.y)) {
              item.fillStyle = oldItem.fillStyle;
            }
          }
        }
        this.drawImage();
      },
      deep: true
    }
  },
  mounted() {
    this.initCanvas();
  },
  methods: {
    // 初始化
    initCanvas() {
      this.canvas = this.$refs.imgCanvas;
      this.context = this.canvas.getContext('2d');
      this.rectList = [];
      this.imageObj = new Image();
      this.imageObj.src = this.imageUrl;
      this.imageObj.onload = () => {
        // 原图不符合canvas，做缩放处理
        // canvas最大600 * 600，其余根据图片大小展示
        if (this.initImageConfig.width && this.initImageConfig.height) {
          // 存在特殊定制的裁剪图片
          let widthScale = 1;
          let heightScale = 1;
          if (this.initImageConfig.width > this.initWidth) {
            widthScale = (this.canvas.width / this.initImageConfig.width).toFixed(2) * 1;
          }
          if (this.initImageConfig.height > this.initWidth) {
            heightScale = (this.canvas.height / this.initImageConfig.height).toFixed(2) * 1;
          }
          this.scale = widthScale < heightScale ? widthScale : heightScale;
          this.initImgH = this.initImageConfig.height;
          this.canvas.height = this.imgH = this.initImageConfig.height * this.scale;
          this.initImgW = this.initImageConfig.width;
          this.canvas.width = this.imgW = this.initImageConfig.width * this.scale;
        } else {
          // 原图
          let widthScale = 1;
          let heightScale = 1;
          if (this.imageObj.width > this.initWidth) {
            widthScale = (this.canvas.width / this.imageObj.width).toFixed(2) * 1;
          }
          if (this.imageObj.height > this.initWidth) {
            heightScale = (this.canvas.height / this.imageObj.height).toFixed(2) * 1;
          }
          this.scale = widthScale < heightScale ? widthScale : heightScale;
          this.initImgH = this.imageObj.height;
          this.canvas.height = this.imgH = this.imageObj.height * this.scale;
          this.initImgW = this.imageObj.width;
          this.canvas.width = this.imgW = this.imageObj.width * this.scale;
        }
        this.labelConfig.map(item => {
          const rectX = item.x * this.scale;
          const initRectX = item.x;
          const rectY = item.y * this.scale;
          const initRectY = item.y;
          const rectW = item.width;
          const rectH = item.height;
          const fillStyle = item.fillStyle;
          const strokeStyle = item.strokeStyle;
          const initStyle = item.fillStyle;
          const activeStyle = item.activeStyle;
          this.rectList.push(
            { rectX, rectY, initRectX, initRectY, rectW, rectH, fillStyle, strokeStyle, initStyle, activeStyle }
          );
        });
        // 记录一下canvas原点  为图片的中心点,因为旋转图标在外面，初始化改变一下位置，离边远一点
        this.PO = { x: this.imgW / 2, y: this.imgH / 2 };
        // 改变画布的中心点
        this.context.translate(this.PO.x, this.PO.y);
        this.drawImage();
      };
      if (this.isNeedChangeRectFill) {
        this.canvas.onclick = (e) => {
          this.beginX = e.offsetX;
          this.beginY = e.offsetY;
          // 把点击的win坐标转为canvas坐标
          const Cp = this.convertCoordinate(this.beginX, this.beginY);
          this.clickRect(Cp.x, Cp.y);
          this.drawImage();
        };
      }
      if (!this.isShowBtn && this.canvasControlType === 'mouse') {
        this.canvas.onmousedown = (e) => {
          // e.offsetX是鼠标点击到canvas边的位置
          this.beginX = e.offsetX;
          this.beginY = e.offsetY;
          // 把点击的win坐标转为canvas坐标
          const Cp = this.convertCoordinate(this.beginX, this.beginY);
          // 判断在canvas坐标点上是否在图片上
          this.canMove = this.imgIsDown(Cp.x, Cp.y);
          this.canvas.onmousemove = (e) => {
            const x = e.offsetX;
            const y = e.offsetY;
            // 拖拽
            if (this.canMove) {
              // 算出来移动的像素（每次都是减去上次的值）
              const Mx = x - this.beginX;
              const My = y - this.beginY;
              // Mx和My是win上面移动的像素，还需要转为canvas坐标,加上坐标是因为要从坐标原点开始算
              const CPO = this.convertCoordinate(Mx + this.PO.x, My + this.PO.y);
              // 改变canvas原点坐标
              this.context.translate(CPO.x, CPO.y);
              this.drawImage();
              // 画完以后要保存起来最终画到哪里了
              this.PO.x += Mx; // canvas坐标原点
              this.PO.y += My;
              this.beginX = x; // 保存起来这次图画到了哪里
              this.beginY = y;
            }
          };
          document.onmouseup = () => {
            this.canvas.onmousemove = null;
            document.onmouseup = null;
            this.canMove = false;
          };
        };
        this.canvas.onmousewheel = (e) => {
          const x = e.offsetX;
          const y = e.offsetY;
          const Cp = this.convertCoordinate(x, y);
          // 同样需要判断如果鼠标在图片上，才允许缩放
          this.canScale = this.imgIsDown(Cp.x, Cp.y);
          if (this.canScale) {
            // e.wheelDelta如果大于0，证明鼠标是向上滚动，反之向下
            if (e.wheelDelta > 0) {
              // 放大的倍数可以根据实际情况定义，可以丝滑一点
              this.scale += 0.04;
            }
            if (e.wheelDelta < 0) {
              this.scale -= 0.04;
            }
            // 不管放大还是缩小，都是用初始的宽高，来放大或者缩小
            this.imgW = this.scale * this.initImgW;
            this.imgH = this.scale * this.initImgH;
            // 不管放大还是缩小，都是用初始的XY，来放大或者缩小
            for (let i = 0; i < this.rectList.length; i++) {
              const updateItem = this.rectList[i];
              updateItem.rectX = this.scale * updateItem.initRectX;
              updateItem.rectY = this.scale * updateItem.initRectY;
            }
            this.drawImage();
          }
        };
      }
      if (this.isShowBtn && this.canvasControlType === 'button') {
        this.canvas.onmousedown = (e) => {
          // e.offsetX是鼠标点击到canvas边的位置
          this.beginX = e.offsetX;
          this.beginY = e.offsetY;
          // 把点击的win坐标转为canvas坐标
          const Cp = this.convertCoordinate(this.beginX, this.beginY);
          // 判断在canvas坐标点上是否在图片上
          this.canMove = this.imgIsDown(Cp.x, Cp.y);
          this.canvas.onmousemove = (e) => {
            const x = e.offsetX;
            const y = e.offsetY;
            if (!this.canButtonMove) return;
            // 拖拽
            if (this.canMove) {
              // 算出来移动的像素（每次都是减去上次的值）
              const Mx = x - this.beginX;
              const My = y - this.beginY;
              // Mx和My是win上面移动的像素，还需要转为canvas坐标,加上坐标是因为要从坐标原点开始算
              const CPO = this.convertCoordinate(Mx + this.PO.x, My + this.PO.y);
              // 改变canvas原点坐标
              this.context.translate(CPO.x, CPO.y);
              this.drawImage();
              // 画完以后要保存起来最终画到哪里了
              this.PO.x += Mx; // canvas坐标原点
              this.PO.y += My;
              this.beginX = x; // 保存起来这次图画到了哪里
              this.beginY = y;
            }
          };
          document.onmouseup = () => {
            this.canvas.onmousemove = null;
            document.onmouseup = null;
            this.canMove = false;
          };
        };
      }
    },
    //  绘制图片
    drawImage() {
      // 先清除画布，清除两倍的画布，因为要改变坐标原点，只有这样才能不管原点在哪里都能完全清除画布
      this.context.clearRect(-this.canvas.width, -this.canvas.height, this.canvas.width * 2, this.canvas.height * 2);
      // 画图片，因为原点在图片的中心点，所以每次画图只需要从图片的负一半坐标开始画，就能看到我们想要的效果
      this.context.drawImage(this.imageObj, -this.imgW / 2, -this.imgH / 2, this.imgW, this.imgH);
      this.rectList.map(item => {
        this.context.fillStyle = item.fillStyle;
        this.context.strokeStyle = item.strokeStyle;
        this.context.lineWidth = 3 * this.scale;
        this.context.fillRect(item.rectX - this.imgW / 2, item.rectY - this.imgH / 2, item.rectW * this.scale, item.rectH * this.scale);
        this.context.strokeRect(item.rectX - this.imgW / 2, item.rectY - this.imgH / 2, item.rectW * this.scale, item.rectH * this.scale);
      });
    },
    // 判断鼠标是否在图片上按下
    imgIsDown(x, y) {
      // 找到图片的最小值和最大值，因为画图是从-imgW / 2开始的，那么这就是图片占据的位置的最小值，最大值是imgW / 2,y轴同理
      return -this.imgW / 2 < x && x < this.imgW / 2 && -this.imgH / 2 < y && y < this.imgH / 2;
    },
    // window屏幕坐标转化为canvas坐标
    convertCoordinate(x, y) {
      // 在屏幕坐标系中，相对canvas坐标系原点PO的偏移,所以要减去canvas坐标原点
      x = x - this.PO.x;
      y = y - this.PO.y;
      return { x: x, y: y };
    },
    // 改变高亮按钮类型
    changeHoverButtonType(type) {
      this.hoverButtonType = type;
    },
    // 放大缩小
    changeScale(scaleNumber) {
      this.scale += scaleNumber;
      // 不管放大还是缩小，都是用初始的宽高，来放大或者缩小
      this.imgW = this.scale * this.initImgW;
      this.imgH = this.scale * this.initImgH;
      // 不管放大还是缩小，都是用初始的XY，来放大或者缩小
      for (let i = 0; i < this.rectList.length; i++) {
        const updateItem = this.rectList[i];
        updateItem.rectX = this.scale * updateItem.initRectX;
        updateItem.rectY = this.scale * updateItem.initRectY;
      }
      this.drawImage();
    },
    // 是否可以移动
    changeCanButtonMove() {
      this.canButtonMove = !this.canButtonMove;
    },
    // 点击矩形，改变颜色
    clickRect(x, y) {
      let isChange = false;
      for (let i = this.rectList.length - 1; i >= 0; i--) {
        const item = this.rectList[i];
        if ((item.rectX - this.imgW / 2) <= x && (item.rectX + item.rectW * this.scale - this.imgW / 2) >= x && (item.rectY - this.imgH / 2) <= y && (item.rectY + item.rectH * this.scale - this.imgH / 2) >= y) {
          // 处理重合部分，只渲染一个
          if (!isChange) {
            item.fillStyle = item.activeStyle;
            this.currentClickRect = item;
            isChange = !isChange;
            this.$emit('changeRectFill', item);
          } else {
            item.fillStyle = item.initStyle;
          }
        } else {
          item.fillStyle = item.initStyle;
        }
      }
      if (!isChange) {
        this.$emit('changeRectFill', '');
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.image-with-label-container {
  text-align: center;
  padding-top: 40px;
  position: relative;
  #imgCanvas {
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  }
  .operation-container {
    width: 40px;
    display: inline-block;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 0 0 1px rgb(0 0 0 / 5%), 0 5px 10px rgb(0 0 0 / 10%);
    padding: 8px 4px;
    position: absolute;
    bottom: 8px;
    margin-left: 8px;
    .icon-button {
      height: 32px;
      width: 32px;
      cursor: pointer;
      line-height: 32px;
      &.active {
        background: rgba(0,0,0,.1);
        border-radius: 5px;
        box-shadow: inset 0 1px 0 rgb(0 0 0 / 5%), inset 0 0 0 1px rgb(0 0 0 / 5%);
      }
      .svg-icon {
        width: 24px;
        height: 24px;
        position: relative;
        top: 4px;
      }
    }
  }
}
</style>
