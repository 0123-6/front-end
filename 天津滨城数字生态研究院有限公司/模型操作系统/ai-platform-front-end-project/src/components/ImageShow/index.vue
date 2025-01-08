<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-09-05 22:28:20
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-06 09:02:10
 * @FilePath: \ai-platform-front-end-project\src\components\ImageShow\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div id="myDiv" v-resize="resize" class="" style="width: 100%;height: 100%;">
    <!--width100%-->
    <div v-if="divWidth/divHeight < imgWidth/imgHeight" class="flex flex-direction justify-center bgc-white" style="width: 100%;height: 100%;">
      <img :src="src" width="100%" alt="">
    </div>
    <!--height100%-->
    <div v-if="divWidth/divHeight > imgWidth/imgHeight" class="flex justify-center bgc-white" style="width: 100%;height: 100%">
      <img :src="src" height="100%" alt="">
    </div>
  </div>
</template>

<script>
import elementResizeDetectorMaker from 'element-resize-detector';
export default {
  name: 'Index',
  props: {
    src: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      imgWidth: 0,
      imgHeight: 1,
      divWidth: 0,
      divHeight: 1
    };
  },
  created() {
    // 创建对象
    var img = new Image();
    // 改变图片的src
    img.src = this.src;
    const _this = this;
    // 加载完成执行
    img.onload = function() {
      // 打印
      _this.imgWidth = img.width;
      _this.imgHeight = img.height;
    };
  },
  mounted() {
    const _this = this;
    var erd = elementResizeDetectorMaker();
    erd.listenTo(this.$el, function(element) {
      _this.divWidth = element.offsetWidth;
      _this.divHeight = element.offsetHeight;
    });
  },
  methods: {
    resize() {

    }
  }
};
</script>

<style scoped>

</style>
