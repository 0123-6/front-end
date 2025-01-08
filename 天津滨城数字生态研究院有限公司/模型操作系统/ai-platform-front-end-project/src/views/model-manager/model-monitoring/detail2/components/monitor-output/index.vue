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
          v-model="selectedDateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="getMonitorOutput"
        />
      </div>
    </div>
    <!--选项行-->
    <div v-if="modelType === 'ObjectTest'" class="flex" style="width: 100%;margin-top: 14px;">
      <tab-seconds :tab-list="tabList" :active-tab="activeTab" @change="changeActiveTab" />
    </div>
    <!--折线图-->
    <div id="echartsArea" class="flex flex-direction flex-1 overflow-auto" style="width: 100%;">
      <!--加载中-->
      <div v-if="loading" v-loading="loading" class="flex flex-direction" style="width: 100%;height: 100%;" />
      <!--有数据-->
      <div v-else-if="data && data.haveData && modelType === 'ObjectTest'" class="flex flex-direction" style="width: 100%;height: 100%;overflow: visible;">
        <div style="width: 100%;height: 354px;min-height: 354px;">
          <histogram-chart v-if="chart1" :key="chart1" :config="chart1" />
        </div>
        <div style="width: 100%;height: 354px;min-height: 354px;">
          <line-chart v-if="chart2" :key="chart2" :config="chart2" :num="1" />
        </div>
        <div style="width: 100%;height: 354px;min-height: 354px;">
          <line-chart v-if="chart3" :key="chart3" :config="chart3" :num="2" />
        </div>
        <div style="width: 100%;height: 354px;min-height: 354px;">
          <line-chart v-if="chart4" :key="chart4" :config="chart4" :num="3" />
        </div>
      </div>
      <div v-else-if="data && data.haveData && modelType === 'ImageCategorySingle'" class="flex flex-direction" style="width: 100%;height: 100%;overflow: visible;">
        <div style="width: 100%;height: 354px;min-height: 354px;">
          <histogram-chart v-if="chart1" :key="chart1" :config="chart1" />
        </div>
        <div style="width: 100%;height: 354px;min-height: 354px;">
          <histogram-chart v-if="chart2" :key="chart2" :config="chart2" />
        </div>
      </div>
      <!--无数据-->
      <div v-else class="flex" style="width: 100%;height: 100%;">
        <no-data />
      </div>
    </div>
  </div>
</template>

<script>
import HpjTabs from '@/components/hpj/HpjTabs';
import LineChart from '@/views/model-manager/model-monitoring/detail2/components/line-chart';
import TabSeconds from '@/components/hpj/TabSeconds';
import HistogramChart from '@/views/model-manager/model-monitoring/detail2/components/histogram-chart';
import { changeTimeToLast, parseTime } from '@/utils';
import { getMonitorOutput, getMonitorPerformance } from '@/api/model-monitoring';
import NoData from '@/components/NoData';
export default {
  name: 'MonitorOutput',
  components: {
    HistogramChart,
    TabSeconds,
    LineChart,
    HpjTabs,
    NoData
  },
  props: {
    modelId: {
      type: Number,
      required: true
    },
    modelType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      dev: false,
      loading: false,
      selectedDateRange: [new Date('2022-10-14 00:00:00'), new Date()],
      tabList: ['输出类别分布及稳定性指标', '输出目标框大小分布及稳定性指标'],
      activeTab: '输出类别分布及稳定性指标',
      chart1: null,
      chart2: null,
      chart3: null,
      chart4: null,
      data: null
    };
  },
  created() {
    this.getMonitorOutput();
  },
  methods: {
    async getMonitorOutput() {
      const params = {
        modelId: this.modelId,
        startTime: this.selectedDateRange == null ? '' : parseTime(this.selectedDateRange[0]),
        endTime: this.selectedDateRange == null ? '' : changeTimeToLast(this.selectedDateRange[1])
      };
      this.loading = true;
      await getMonitorOutput(params).then(res => {
        this.data = res.data;
        this.changeActiveTab(this.activeTab);
      }).finally(() => {
        this.loading = false;
      });
    },
    changeActiveTab(tab) {
      this.activeTab = tab;
      if (document.getElementById('echartsArea')) {
        document.getElementById('echartsArea').scrollTop = 0;
      }
      if (!this.data.haveData) {
        return;
      }
      if (this.modelType === 'ObjectTest') {
        if (this.activeTab === '输出类别分布及稳定性指标') {
          this.chart1 = this.data.outputCategory.histogramVO;
          this.chart2 = this.data.outputCategory.colorEcharts[0];
          this.chart3 = this.data.outputCategory.colorEcharts[1];
          this.chart4 = this.data.outputCategory.colorEcharts[2];
        } else if (this.activeTab === '输出目标框大小分布及稳定性指标') {
          this.chart1 = this.data.outputTarget.histogramVO;
          this.chart2 = this.data.outputTarget.colorEcharts[0];
          this.chart3 = this.data.outputTarget.colorEcharts[1];
          this.chart4 = this.data.outputTarget.colorEcharts[2];
        }
      } else if (this.modelType === 'ImageCategorySingle') {
        this.chart1 = this.data.outputCategory.histogramVO;
        this.chart2 = this.data.outputPositives.histogramVO;
      }
    }

  }
};
</script>

<style scoped>

</style>
