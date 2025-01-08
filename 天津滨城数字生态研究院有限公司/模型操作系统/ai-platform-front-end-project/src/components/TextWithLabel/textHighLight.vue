<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-07-23 15:09:04
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-07-23 17:23:04
 * @FilePath: \ai-platform-front-end-project\src\components\TextWithLabel\textHighLight.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="text-high-light-container">
    <div v-for="(item, index) of labelContent" :key="index" class="content-container">
      <div ref="textContainer" class="text-container">{{ item.textDetail }}</div>
      <div class="label-container">
        <div
          v-for="(labelItem, labelIndex) of labelCalloutWithCurrentType[index]"
          :key="index + '-' + labelIndex"
          class="label-detail"
          :style="{'background': labelItem.activeStyle}"
        >
          {{ labelItem.name }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Mark from 'mark.js';
export default {
  props: {
    labelContent: {
      type: Array,
      required: true
    },
    // 当前高亮的标签实体类
    currentHighLabeledType: {
      type: String,
      required: true
    }
  },
  computed: {
    labelCalloutWithCurrentType() {
      let list = []; // 二维数组
      list = this.labelContent.map(item => {
        return item.labelDetail.filter(innerItem => { return innerItem.type === this.currentHighLabeledType; });
      });
      this.setMarkText();
      return list;
    }
  },
  methods: {
    setMarkText() {
      this.$nextTick(() => {
        this.labelCalloutWithCurrentType.map((item, index) => {
          const MarkObj = new Mark(this.$refs.textContainer[index]);
          item.map((innerItem, innerIndex) => {
            MarkObj.mark(innerItem.name, { className: `marked-container${index}-${innerIndex}` });
            // , ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split('')
            const classDom = document.getElementsByClassName(`marked-container${index}-${innerIndex}`);
            for (let classDomKey = 0; classDomKey < classDom.length; classDomKey++) {
              classDom[classDomKey].style.background = '#ffffff';
              classDom[classDomKey].style.color = innerItem.activeStyle;
            }
          });
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.text-high-light-container {
  padding: 16px 32px;
  line-height: 1.5;
  .content-container {
    &+.content-container {
      margin-top: 16px;
    }
    .label-detail {
      display: inline-block;
      padding: 4px 8px;
      color: #ffffff;
      font-size: 14px;
      border-radius: 4px;
      &+.label-detail {
        margin-left: 8px;
      }
    }
  }
}
</style>
