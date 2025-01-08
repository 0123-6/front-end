<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-06-06 19:46:16
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-06-07 22:36:23
 * @FilePath: \ai-platform-front-end-project\src\views\model-manager\model-monitoring\detail\other.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<template>
  <div class="monitoring-overview-container">
    <iframe width="100%" height="100%" :src="iframeSrc" frameborder="0" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      iframeSrc: 'http://8.219.125.128:31451/d/85a562078cdf77779eaa1add43ccec1e/kubernetes-compute-resources-namespace-pods?var-datasource=prometheus&var-cluster=&var-namespace=mj-test&from=1654506650365&to=1654510250365&orgId=1&theme=light&kiosk'
    };
  }
};
</script>
<style scoped lang="scss">
.monitoring-overview-container {
  //margin: 16px 217px 24px;
  //padding: 44px 56px;
  background: #f6faff;
  box-shadow: 0 2px 6px 0 rgba(194, 199, 199, 0.5);
  border-radius: 1px;
  height: 100vh;
}
</style>
