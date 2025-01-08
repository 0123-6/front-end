<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-09-28 16:48:37
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-29 15:37:01
 * @FilePath: \ai-platform-front-end-project\src\views\data-manager\dataSet\components\YoloDetail.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="instance-container">
    <div class="type-title-container">JSON示例 <el-button class="blue-btn" @click="downloadDetail">下载示例</el-button></div>
    <div class="file-format-container">
      <div class="title-container">上传压缩文件夹，文件夹包括的内容：</div>
      <div class="icon-container">
        <div class="file-icon-container">
          <svg-icon class-name="dataSet-folder-icon" icon-class="dataSet-folder" />
          <span class="dataSet-icon-label">cat</span>
        </div>
        <div class="file-icon-container">
          <svg-icon class-name="dataSet-folder-icon" icon-class="dataSet-folder" />
          <span class="dataSet-icon-label">dog</span>
        </div>
        <div class="file-icon-container">
          <svg-icon class-name="dataSet-classes-json-icon" icon-class="dataSet-classes-json" />
          <span class="dataSet-icon-label">classes.json</span>
        </div>
      </div>
    </div>
    <div class="file-detail-container">
      <div class="step-container">
        <div class="title-container"><span class="step-number-container">1</span>cat、dog: 原图片数据集</div>
        <div class="icon-container">
          <img :src="catDataSetImage" alt="" srcset="">
        </div>
        <div class="icon-container">
          <img :src="dogDataSetImage" alt="" srcset="">
        </div>
      </div>
      <div class="step-container">
        <div class="title-container"><span class="step-number-container">2</span>classes.json: 原图片数据对应的json标签</div>
        <div class="icon-container">
          <img :src="jsonImage" alt="" srcset="">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      catDataSetImage: require('@/assets/images/dataSet/json-cat-dataSet.png'),
      dogDataSetImage: require('@/assets/images/dataSet/json-dog-dataSet.png'),
      jsonImage: require('@/assets/images/dataSet/json-json.png')
    };
  },
  methods: {
    downloadDetail() {
      this.$emit('download');
    }
  }
};
</script>
<style lang="scss" scoped>
.instance-container {
  .type-title-container {
    font-size: 16px;
    color: #262626;
    font-weight: 600;
    .blue-btn {
      margin-left: 16px;
    }
  }
  .file-format-container {
    .title-container {
      margin-top: 16px;
      font-size: 14px;
      color: #262626;
      font-weight: 600;
      &::before {
        content: "";
        width: 3px;
        height: 16px;
        background: #0164FF;
        display: inline-block;
        margin-right: 8px;
        top: 3px;
        position: relative;
      }
    }
    .file-icon-container {
      margin-top: 16px;
      height: 40px;
      .dataSet-folder-icon,.dataSet-classes-json-icon {
        width: 40px;
        height: 40px;
      }
      .dataSet-icon-label {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        position: relative;
        top: -14px;
        right: -10px;
      }
    }
  }
  .file-detail-container {
    margin-top: 24px;
    .step-container {
      &+.step-container {
        margin-top: 24px;
      }
      .title-container {
        font-size: 14px;
        color: #262626;
        line-height: 14px;
        font-weight: 600;
        margin-bottom: 4px;
        .step-number-container {
          background: rgba(1, 100, 255, 0.3);
          width: 21px;
          height: 21px;
          display: inline-block;
          border-radius: 50%;
          line-height: 21px;
          text-align: center;
          margin-right: 8px;
        }
      }
    }
  }
}
</style>
