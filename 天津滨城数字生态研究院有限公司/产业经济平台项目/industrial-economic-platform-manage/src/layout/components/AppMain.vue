<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2023-01-04 14:10:59
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2023-01-29 11:31:10
 * @FilePath: \smart search web\src\layout\components\AppMain.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="include">
        <router-view />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
/*eslint-disable*/
import { mapGetters } from 'vuex';

export default {
  name: 'app-main',
  data() {
    return {
      formalComponent: null,
      trialComponent: null,
      include: [
        'EditFormal',
        'EditTrial',
        'Home',
        'Formal',
        'Trail',
        'AddFormal',
        'AddTrial',
        'OrgList',
        'PolicyList',
        'CompanyList',
        'IndustryChainList'
      ]
    };
  },
  computed: {
    ...mapGetters(['ROUTER_TAGS'])
  },
  updated() {
    // layout布局时全部页面跳转滚动条置顶
    const dom = document.getElementsByClassName('app-main')[0];
    dom.scrollTo(0, 0);
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.app-main {
  /*80 = navbar  */
  height: calc(100vh - 60px);
  min-height: calc(100vh - 60px);
  width: 100%;
  position: relative;
  overflow: auto;
}
</style>
