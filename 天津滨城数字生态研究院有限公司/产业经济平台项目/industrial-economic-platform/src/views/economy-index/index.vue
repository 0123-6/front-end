<!--
 * @Date: 2023-09-08 11:12:44
 * @LastEditors: zywu 1061096367@qq.com
 * @LastEditTime: 2023-09-11 15:07:00
 * @FilePath: /industrial-economic-platform/src/views/economy-index/index.vue
-->
<template>
  <div class="economy-index">
    <!--左边-->
    <div class="side-tab tw-w-full tw-box-border tw-flex tw-flex-col tw-pl-6 tw-pr-6 tw-text-sm tw-text-[#86909C] tw-z-20">
      <el-breadcrumb class="ee-breadcrumb" separator="/">
        <el-breadcrumb-item>宏观经济</el-breadcrumb-item>
        <el-breadcrumb-item class="is-active">经济指数分析</el-breadcrumb-item>
      </el-breadcrumb>
      <!--上面-->
      <div class="tw-mt-[20px] tw-box-border tw-w-full tw-h-[104px] tw-flex tw-flex-col tw-justify-center tw-items-center tw-rounded tw-cursor-pointer"
           style="background: rgba(53, 109, 246, 0.07);"
           :style="{
             border: menu === '数字经济' ? '1px solid #386ff6' : '',
             boxShadow: menu === '数字经济' ? '0px 2px 3px 0px rgba(215, 215, 215, 0.5)' : '',
           }"
           @click="menu = '数字经济'">
        <div class="tw-w-[48px] tw-h-[48px] tw-flex tw-justify-center tw-items-center">
          <img src="./icon/2.svg" alt="" />
        </div>
        <span class="tw-mt-1 tw-tracking-[-0.6px]">数字经济产业发展指数</span>
      </div>
      <!--下面-->
      <div class="tw-mt-[13px] tw-box-border tw-w-full tw-h-[104px] tw-flex tw-flex-col tw-justify-center tw-items-center tw-rounded tw-cursor-pointer"
           style="background: rgba(74, 175, 156, 0.07);"
           :style="{
             border: menu === '大数据' ? '1px solid #4AAF9C' : '',
             boxShadow: menu === '大数据' ? '0px 2px 3px 0px rgba(215, 215, 215, 0.5)' : '',
           }"
           @click="menu = '大数据'">
        <div class="tw-w-[48px] tw-h-[48px] tw-flex tw-justify-center tw-items-center">
          <img src="./icon/1.svg" alt="" />
        </div>
        <span class="tw-mt-1 tw-tracking-[-0.6px]">大数据产业发展指数</span>
      </div>
    </div>
    <!--右边 数字经济-->
    <digital-economy v-if="menu === '数字经济'"/>
    <!--右边 大数据-->
    <big-data v-if="menu === '大数据'"/>
  </div>
</template>

<script>
import DigitalEconomy from './digital-economy/index.vue';
import BigData from './big-data/index.vue';

export default {
  name: 'EconomyIndex',
  components: {
    DigitalEconomy,
    BigData,
  },
  data() {
    return {
      // 左侧菜单，数字经济，大数据
      menu: '数字经济',
    };
  },
  watch: {
  },
  methods: {
  },
};
</script>

<style lang="less">
@import '~@/styles/variables.less';
.popper-nopadding {
  padding: 0 !important;
}

.economy-index {
  .side-tab {
    position: fixed;
    top: 64px;
    bottom: 0;
    left: 0;
    padding-top: 24px;
    width: 240px;
    background: #fff;
    box-shadow: 5px 0px 16px 0px rgba(20, 38, 82, 0.07);
  }
}
</style>
