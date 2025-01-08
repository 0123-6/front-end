<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-07-07 10:32:15
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-06 10:28:12
 * @FilePath: \ai-platform-front-end-project\src\components\OverflowEllipsis\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="overflow-ellipsis-container">
    <div style="display: flex" class="overflow-ellipsis-content">
      <div ref="moreText" class="more-text">
        <div v-if="isShowBtn && !isExpand" class="more-btn" @click="toggleExpand">展开<i class="el-icon-arrow-down" /></div>
        <div v-if="isExpand" class="more-btn" @click="toggleExpand">收起<i class="el-icon-arrow-up" /></div>
        {{ content }}
      </div>
    </div>
    <div ref="contentCopy" class="content-copy">
      {{ content }}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    content: {
      type: String,
      default: '',
      required: true
    }
  },
  data() {
    return {
      isExpand: false,
      isShowBtn: false
    };
  },
  mounted() {
    const el = this.$refs.moreText;
    const elCopy = this.$refs.contentCopy;
    setTimeout(() => {
      this.isShowBtn = el.clientHeight < elCopy.clientHeight;
    }, 300);
    window.addEventListener('resize', () => {
      this.isShowBtn = el.clientHeight < elCopy.clientHeight;
    });
  },
  destroyed() {
    const el = this.$refs.moreText;
    const elCopy = this.$refs.contentCopy;
    window.removeEventListener('resize', () => {
      this.isShowBtn = el.clientHeight < elCopy.clientHeight;
    });
  },
  methods: {
    toggleExpand() {
      this.$refs.moreText.style.display = this.isExpand ? '-webkit-box' : 'block';
      this.isExpand = !this.isExpand;
    }
  }
};
</script>
<style lang="scss" scoped>
.overflow-ellipsis-container {
  position: relative;
  .overflow-ellipsis-content {
      display: inline;
      font-size: 14px;
      color: #323232;
      letter-spacing: -0.6px;
      text-align: center;
      font-weight: 400;
    }
    .more-text{
      display: inline-block;
      font-size: 14px;
      color: #646464;
      letter-spacing: -0.6px;
      text-align: justify;
      line-height: 25px;
      font-weight: 400;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      word-break: break-all;
      &::before {
        content: '';
        float: right;
        width: 5px;
        height: calc(100% - 25px);
      }
      .more-btn{
        float: right;
        clear: both;
        color: #0164FF;
        cursor: pointer;
      }
    }
    .content-copy{
      position: absolute;
      display: inline-block;
      visibility: hidden;
      font-size: 14px;
      width: 100%;
      color: #646464;
      letter-spacing: -0.6px;
      text-align: justify;
      line-height: 25px;
      font-weight: 400;
      word-break: break-all;
    }
}
</style>
