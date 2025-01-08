<template>
  <!--最外层-->
  <div class="flex flex-direction" style="width: 100%;height: 100%;">
    <!--选择时间-->
    <div class="flex align-center" style="width: 100%;">
      <!--左-->
      <div class="flex ">
        监控时间
      </div>
      <!--右-->
      <div class="flex margin-left-8">
        <el-date-picker
          @change="getMonitorInput"
          v-model="selectedDateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
    </div>
    <!--选项行-->
    <div class="flex" style="width: 100%;margin-top: 14px;">
      <tab-seconds :tab-list="tabList" :active-tab="activeTab" @change="changeActiveTab"></tab-seconds>
    </div>
    <!--图像部分-->
    <div id="echartsArea" class="flex flex-direction flex-1 overflow-auto" style="width: 100%;">
      <!--加载中-->
      <div v-if="loading" v-loading="loading" class="flex flex-direction" style="width: 100%;height: 100%;">
      </div>
      <!--有数据-->
      <div v-else-if="data && data.haveData" class="flex flex-direction" style="width: 100%;height: 100%;overflow: visible;">
        <div v-if="isColorHistogram" style="width: 100%;height: 354px;min-height: 354px;">
          <histogram-chart v-if="hChart" :config="hChart" :key="hChart"></histogram-chart>
        </div>
        <div style="width: 100%;height: 354px;min-height: 354px;">
          <line-chart v-if="chart1" :config="chart1" :num="1" :key="chart1"></line-chart>
        </div>
        <div style="width: 100%;height: 354px;min-height: 354px;">
          <line-chart v-if="chart2" :config="chart2" :num="2" :key="chart2"></line-chart>
        </div>
        <div v-if="isColorHistogram" style="width: 100%;height: 354px;min-height: 354px;">
          <line-chart v-if="chart3" :config="chart3" :num="3" :key="chart3"></line-chart>
        </div>
      </div>
      <!--无数据-->
      <div v-else class="flex" style="width: 100%;height: 100%;">
        <no-data></no-data>
      </div>

    </div>
  </div>
</template>

<script>
import HpjTabs from "@/components/hpj/HpjTabs";
import LineChart from "@/views/model-manager/model-monitoring/detail2/components/line-chart";
import HistogramChart from "@/views/model-manager/model-monitoring/detail2/components/histogram-chart";
import TabSeconds from "@/components/hpj/TabSeconds";
import {changeTimeToLast, parseTime} from "@/utils";
import {getMonitorInput, getMonitorPerformance} from "@/api/model-monitoring";
import NoData from "@/components/NoData";
export default {
  name: "MonitorInput",
  props:{
    modelId:{
      type:Number,
      required:true,
    },
  },
  components: {
    TabSeconds,
    HistogramChart,
    LineChart,
    HpjTabs,
    NoData,
  },
  created() {
    this.getMonitorInput()
  },
  computed:{
    isColorHistogram(){
      return this.activeTab === '颜色直方图'
    }
  },
  data(){
    return{
      dev:false,
      loading:false,
      selectedDateRange:[new Date('2022-10-14 00:00:00'),new Date()],
      tabList:['遮挡率','清晰度','亮度值','灰度值','灰度值方差','颜色直方图'],
      activeTab:'遮挡率',
      hChart:null,
      chart1: null,
      chart2: null,
      chart3:null,
      data:null,
    }
  },
  methods:{
    changeActiveTab(tab){
      if(document.getElementById('echartsArea')){
        document.getElementById('echartsArea').scrollTop = 0
      }
      this.activeTab = tab
      if(!this.data.haveData){
        return
      }
      if(this.activeTab==='遮挡率'){
        this.chart1 = this.data.occlusionRate[0]
        this.chart2 = this.data.occlusionRate[1]
      }else if(this.activeTab==='清晰度'){
        this.chart1 = this.data.definition[0]
        this.chart2 = this.data.definition[1]
      }else if(this.activeTab==='亮度值'){
        this.chart1 = this.data.brightnessValue[0]
        this.chart2 = this.data.brightnessValue[1]
      }else if(this.activeTab==='灰度值'){
        this.chart1 = this.data.grayValue[0]
        this.chart2 = this.data.grayValue[1]
      }else if(this.activeTab==='灰度值方差'){
        this.chart1 = this.data.grayValueVariance[0]
        this.chart2 = this.data.grayValueVariance[1]
      }else if(this.activeTab==='颜色直方图'){
        this.hChart = this.data.colorHistogram.histogramVO
        this.chart1 = this.data.colorHistogram.colorEcharts[0]
        this.chart2 = this.data.colorHistogram.colorEcharts[1]
        this.chart3 = this.data.colorHistogram.colorEcharts[2]
      }
    },
    async getMonitorInput() {
      let params = {
        modelId: this.modelId,
        startTime: this.selectedDateRange == null ? '' : parseTime(this.selectedDateRange[0]),
        endTime: this.selectedDateRange == null ? '' : changeTimeToLast(this.selectedDateRange[1]),
      }
      this.loading = true
      await getMonitorInput(params).then(res => {
        this.data = res.data
        this.changeActiveTab(this.activeTab)
      }).finally(() => {
        this.loading = false
      })
    },
  },
}
</script>

<style scoped>

</style>
