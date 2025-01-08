<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-10-08 10:30:04
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-10-13 17:08:30
 * @FilePath: \ai-platform-front-end-project\src\views\data-manager\dataSet\components\Progress.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="progress-container">
    {{ formatStatus(status) }}
    <div class="progress-detail-container">
      <div :class="'inner ' + status" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    status: {
      type: String,
      default: 'loading'
    }
  },
  data() {
    return {
      loadingInterval: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setLoading();
    });
  },
  destroyed() {
    clearInterval(this.loadingInterval);
    this.loadingInterval = null;
  },
  methods: {
    setLoading() {
      const repeat = document.querySelector('.progress-container .inner');
      let flag = 0;
      this.loadingInterval = setInterval(() => {
        if (this.status !== 'loading') {
          clearInterval(this.loadingInterval);
          this.loadingInterval = null;
        }
        flag++;
        if (flag === 200) {
          flag = 0;
        }
        repeat.style.marginLeft = -flag + 'px';
      }, 1000 / 60);
    },
    formatStatus() {
      let str = '';
      switch (this.status) {
        case 'loading':
          str = '上传中';
          break;
        case 'success':
          str = '上传成功';
          break;
        case 'error':
          str = '上传失败';
          break;
        default:
          break;
      }
      return str;
    }
  }
};
</script>
<style lang="scss" scoped>
.progress-container {
  display: inline-block;
  height: 20px;
  line-height: 20px;
  position: absolute;
  .progress-detail-container {
    display: inline-block;
    width: 200px;
    position: relative;
    height: 6px;
    overflow: hidden;
    top: -3px;
    .inner {
      width: 400px;
      height: 100%;
      &.loading {
        background: linear-gradient(45deg, #ffffff 25%, #16c0f3 0, #16c0f3 50%, #ffffff 0, #ffffff 75%, #16c0f3 0);
        background-size: 20px 20px !important;
        border: 1px solid #16c0f3;
      }
      &.success {
        background: #00AB5A;
        background-size: 20px 20px !important;
        border: 1px solid #00AB5A;
      }
      &.error {
        background: #FD5E3A;
        background-size: 20px 20px !important;
        border: 1px solid #FD5E3A;
      }
    }
  }
}
</style>
