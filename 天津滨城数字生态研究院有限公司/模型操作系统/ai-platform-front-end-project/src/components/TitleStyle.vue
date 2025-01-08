<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-09-05 22:28:20
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-10-13 16:57:28
 * @FilePath: \ai-platform-front-end-project\src\components\TitleStyle.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--一条蓝线 + 标题 组件-->
<template>
  <!--最外层-->
  <div class="flex justify-between align-center" :class="[notMarginBottom?'':'margin-bottom-16']">
    <!--左-->
    <div class="flex align-center">
      <div class="flex bgc-blue margin-right-8" style="width: 3px;" :style="[{'height':fontSize?fontSize+'px':'14px',}]" />
      <div class="flex color-title" :class="fontSize?'font-size-'+fontSize:'font-size-14'">
        {{ title }}
      </div>
    </div>
    <!--右-->
    <div class="flex align-center">
      <span v-if="endIcon" class="endIcon" style="" @click="toInterfaceDemo">
        <i class="el-icon-document" style="margin-right: 8px" />帮助文档
      </span>
      <span v-if="downloadIcon" class="endIcon" style="" @click="download">
        <i class="el-icon-download" style="margin-right: 8px" />下载
      </span>
      <slot />
    </div>
  </div>
</template>

<script>
import { downLoadFile } from '@/utils/download-file.js';
import { downloadConfusionMatrix } from '@/api/model-evaluation';

export default {
  name: 'TitleStyle',
  props: {
    title: {
      type: String,
      required: true
    },
    notMarginBottom: {
      type: Boolean,
      required: false
    },
    fontSize: {
      type: Number,
      default: 0,
      required: false
    },
    endIcon: {
      type: Boolean,
      default: false
    },
    downloadIcon: {
      type: Boolean,
      default: false
    },
    confusionMatrixData: {
      type: Object,
      default: () => {}
    },
    sourceRoute: {
      type: String,
      default: 'model-base'
    },
    modelId: {
      type: String,
      default: '0'
    }
  },
  methods: {
    toInterfaceDemo() {
      const info = {
        id: this.modelId,
        route: this.sourceRoute
      };
      sessionStorage.setItem('info', JSON.stringify(info));
      const { href } = this.$router.resolve({
        path: `/interface-demo`
      });
      window.open(href, '_blank');
      // this.$router.push('/interface-demo');
    },
    download() {
      if (this.downloadIcon) {
        downloadConfusionMatrix(this.confusionMatrixData).then(res => {
          downLoadFile(res, '混淆矩阵', 'text/csv', 'csv');
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.endIcon{
  font-size: 14px;
  color: #646464;
  cursor: pointer;
  &:hover{
    color: #0164FF;
  }
  &:active{
    color: #0164FF;
  }
}
</style>
