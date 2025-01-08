<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-11-10 14:41:20
 * @LastEditors: zywu 1061096367@qq.com
 * @LastEditTime: 2023-09-11 18:02:36
 * @FilePath: /industrial-economic-platform/src/layout/index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="app-wrapper" :style="{ minWidth, maxWidth }">
    <div class="main-container">
      <div style="box-shadow: 0px 1px 4px 0px rgba(20, 38, 82, 0.06)" class="tw-z-50 tw-relative">
        <navbar />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import { AppMain, Navbar } from '@/layout/components';

export default {
  name: 'Layout-page',
  components: {
    Navbar,
    AppMain
  },
  data() {
    return {
      minWidth: '1366px',
      maxWidth: `${screen.width}px`
    };
  },
  created() {
    this.changeMinWidth();
    // this.getMenuRoutes();
    this.$router.afterEach((to, from) => {
      this.changeMinWidth();
    });
  },
  methods: {
    changeMinWidth() {
      // 获取当前页面的 URL
      const currentUrl = window.location.href;
      // 判断 URL 是否包含 "home"，如果包含则设置不同的 min-width
      if (currentUrl.includes('home')) {
        this.minWidth = '1300px';
      } else {
        this.minWidth = '1366px';
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import '~@/styles/variables.less';
.app-wrapper {
  margin: 0 auto;
  overflow-x: auto;
  position: relative;
}
</style>
