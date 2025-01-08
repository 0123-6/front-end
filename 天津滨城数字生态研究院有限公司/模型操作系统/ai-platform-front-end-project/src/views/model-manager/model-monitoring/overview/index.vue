<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-06-06 19:46:01
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-08-30 11:22:17
 * @FilePath: \ai-platform-front-end-project\src\views\model-manager\model-monitoring\other.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<template>
  <div class="monitoring-overview-container" style="width: 100%;">
    <div class="monitoring-options">
      <el-button type="text" @click="showDetail">详情</el-button>
      <!-- <el-button type="text" @click="showOverview">总览2</el-button> -->
    </div>
    <iframe width="100%" height="100%" :src="iframeSrc" frameborder="0" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  name:'MonitorResources',
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['grafanaUrl']),
    iframeSrc() {
      let s
      if (process.env.NODE_ENV === "development"){
        // 开发环境
        s = 'ai-base-dev'
      }
      if(process.env.NODE_ENV === "production"){
        // 线上环境
        s = 'ai-base-dev'
      }
      return `${this.grafanaUrl}/d/N9uZBy8Wz/mo-xing-fu-wu-zi-yuan-zong-lan-ye?orgId=1&var-node=&var-namespace=${s}&var-container=kserve-container&var-duration=6h&from=now-5m&to=now&theme=light&kiosk`;
    }
  },
  methods: {
    showDetail() {
      this.$router.push('/model-manager/monitoring/detail');
    }
    // showOverview() {
    //   this.$router.push('/model-manager/monitoring/monitoring-overview')
    // }
  }
};
</script>
<style scoped lang="scss">;
.monitoring-overview-container {
  //margin: 16px 217px 24px;
  //padding: 44px 56px;
  background: #f6faff;
  box-shadow: 0 2px 6px 0 rgba(194, 199, 199, 0.5);
  border-radius: 1px;
  height: calc( 100% - 48px);
  .monitoring-options {
    margin: 0 16px 8px;
  }
}
</style>
