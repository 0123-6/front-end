<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-09-01 17:45:43
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-02 10:03:01
 * @FilePath: \ai-platform-front-end-project\src\components\hpj\HpjTabs.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="flex align-center">
    <div
      v-for="(item, index) in tabList"
      :key="index"
      class="flex justify-center align-center hand font-size-14 padding-left-12 padding-right-12"
      style="min-width: 112px;height: 38px;margin-right: 1px;"
      :class="[item == activeTab ? 'color-blue bgc-white' : 'color-content']"
      :style="[{ 'border-top': item == activeTab ? '3px solid #0164FF' : '3px solid transparent', 'background-color': item == activeTab ? '' : normalBackground }]"
      @click="changeActiveTab(item)"
    >
      {{ item }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'HpjTabs',
  props: {
    tabList: {
      type: Array,
      required: true
    },
    activeTab: {
      type: String,
      required: false,
      default: ''
    },
    normalBackground: {
      type: String,
      default: '#f2f2f2'
    }
  },
  computed: {
    currentTab: {
      get() {
        return this.activeTab;
      },
      set(newValue) {
        this.$emit('update:activeTab', newValue);
      }
    }
  },
  created() {
    if (this.currentTab === '') {
      this.currentTab = this.tabList[0];
    }
  },
  methods: {
    changeActiveTab(activeTab) {
      this.currentTab = activeTab;
      this.$emit('change', activeTab);
    }
  }
};
</script>

<style scoped>
</style>
