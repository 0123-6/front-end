<template>
  <!--最外层-->
  <div class="flex flex-direction">
    <!--主页面-->
    <keep-alive>
      <monitor v-if="showContent==0" @goEarlyWarningInformationPage="goEarlyWarningInformationPage" @goMonitoringRecordPage="goMonitoringRecordPage"></monitor>
    </keep-alive>
    <!--预警页面-->
    <keep-alive>
      <early-warning-information v-if="showContent==1" @return="earlyWarningInformationPageReturn"></early-warning-information>
    </keep-alive>
    <!--预警信息页面-->
    <keep-alive>
      <monitoring-record v-if="showContent==2" @return="goMonitorPage" @goEarlyWarningInformationPage="goEarlyWarningInformationPage"></monitoring-record>
    </keep-alive>
  </div>
</template>

<script>
import Monitor from "@/views/monitor";
import EarlyWarningInformation from "@/views/earlyWarningInformation";
import MonitoringRecord from "@/views/monitoringRecord";
export default {
  name: "realTimeMonitoring",
  components: {MonitoringRecord, EarlyWarningInformation, Monitor},
  data(){
    return{
      showContent:0,//0代表实时监控页面，1代表预警信息页面，2代表预警信息列表页面
      showContentOld:-1,//代表上一个展示的页面
    }
  },
  watch:{
    showContent(newVal,oldVal){
      this.showContentOld = oldVal
    },
  },
  methods:{
    //去实时监控页面
    goMonitorPage(){
      this.showContent = 0
    },
    //去预警信息页面
    goEarlyWarningInformationPage(){
      this.showContent = 1
    },
    //去预警信息列表页面
    goMonitoringRecordPage(){
      this.showContent = 2
    },
    //预警信息页面返回事件
    earlyWarningInformationPageReturn(){
      this.showContent = this.showContentOld
    },
  },
}
</script>

<style scoped>

</style>
