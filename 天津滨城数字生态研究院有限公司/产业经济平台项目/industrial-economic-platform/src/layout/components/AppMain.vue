<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2023-01-04 14:10:59
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2023-07-18 14:42:49
 * @FilePath: \smart search web\src\layout\components\AppMain.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <div style="min-height: 100%">
        <keep-alive :include="keepInclude">
          <router-view></router-view>
        </keep-alive>
      </div>
    </transition>
    <!--    <div class="footer">-->
    <!--      <div>-->
    <!--        <span>备案号：&nbsp;<a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">皖ICP备2022016718号-1</a></span>-->
    <!--        &nbsp;&nbsp;&nbsp;&nbsp;-->
    <!--        <span>地址：&nbsp;安徽省合肥市金寨路91号立基大厦18层</span>-->
    <!--      </div>-->
    <!--      <div>©2023&nbsp;&nbsp;<a href="https://www.hiabr.com" target="_blank">合肥人工智能与大数据研究院</a>&nbsp;&nbsp;版权所有</div>-->
    <!--    </div>-->
  </section>
</template>

<script>
export default {
  name: 'app-main',
  data() {
    return {
      keepInclude: [
        'HomePage',
        'StructuralAnalysis',
        'IndustryMap',
        'IndustryMapDetail',
        'ComprehensiveComparison',
        'IndustrialInvestment',
        'EconomyMonitor',
        'PolicyDoc',
        'PolicyCompany',
        'PolicyList',
        'PolicyQuery',
        'PersonCenter',
        'FollowCompany'
      ]
    };
  },
  // layout布局时全部页面跳转滚动条置顶
  updated() {
    const dom = document.getElementsByClassName('app-main')[0];
    dom.scrollTo(0, 0);
  }
};
</script>

<style lang="less" scoped>
@import '~@/styles/variables.less';
.app-main {
  /* 62 = navbar  */
  height: calc(100vh - 62px);
  width: 100%;
  position: relative;
  overflow: auto;
  background-color: @background-color;
  .footer {
    background-color: rgba(0, 0, 0, 1);
    height: 100px;
    text-align: center;
    color: rgba(255, 255, 255, 0.6);
    display: flex;
    justify-content: center;
    flex-direction: column;
    font-size: 14px;
    line-height: 30px;
    a {
      text-decoration: none;
      color: rgba(255, 255, 255, 0.6);
    }
  }
}
</style>
