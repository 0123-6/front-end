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
          @change="getMonitorPerformance"
        />
      </div>
    </div>
    <!--选项行-->
    <div class="flex" style="width: 100%;margin-top: 14px;">
      <tab-seconds :tab-list="tabList" :active-tab="activeTab" @change="changeActiveTab" />
    </div>
    <!--折线图-->
    <div id="echartsArea" class="flex flex-direction flex-1 overflow-auto" style="width: 100%;">
      <!--加载中-->
      <div v-if="loading" v-loading="loading" class="flex flex-direction" style="width: 100%;height: 100%;" />
      <!--有数据-->
      <div v-else-if="data && data.haveData" class="flex flex-direction" style="width: 100%;height: 100%;overflow: visible;">
        <div style="width: 100%;height: 354px;min-height: 354px;">
          <line-chart v-if="chart1" :key="chart1" :config="chart1" :num="1" />
        </div>
        <div style="width: 100%;height: 354px;min-height: 354px;">
          <line-chart v-if="chart2" :key="chart2" :config="chart2" :num="2" />
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
import { changeTimeToLast, parseTime } from '@/utils';
import { getMonitorPerformance } from '@/api/model-monitoring';
import NoData from '@/components/NoData';
export default {
  name: 'MonitorPerformance',
  components: {
    NoData,
    TabSeconds,
    LineChart,
    HpjTabs
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
      tabList: ['IOU≥0.5 mAP', 'IOU≥0.75 mAP', 'IOU≥0.95 mAP'],
      activeTab: 'IOU≥0.5 mAP',
      data: null,
      chart1: null,
      chart2: null
    };
  },
  created() {
    if (this.modelType === 'ObjectTest') {
      this.tabList = ['IOU≥0.5 mAP', 'IOU≥0.75 mAP', 'IOU≥0.95 mAP'];
      this.activeTab = 'IOU≥0.5 mAP';
    } else if (this.modelType === 'ImageCategorySingle') {
      this.tabList = ['准确率Accuracy', '精确率Precision', '召回率Recall', 'F1-score', 'AUC', 'AP'];
      this.activeTab = '准确率Accuracy';
    }
    this.getMonitorPerformance();
  },
  methods: {
    async getMonitorPerformance() {
      const params = {
        modelId: this.modelId,
        startTime: this.selectedDateRange == null ? '' : parseTime(this.selectedDateRange[0]),
        endTime: this.selectedDateRange == null ? '' : changeTimeToLast(this.selectedDateRange[1])
      };
      this.loading = true;
      await getMonitorPerformance(params).then(res => {
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
        if (this.activeTab === 'IOU≥0.5 mAP') {
          this.chart1 = this.data.iouGreater5[0];
          this.chart2 = this.data.iouGreater5[1];
        } else if (this.activeTab === 'IOU≥0.75 mAP') {
          this.chart1 = this.data.iouGreater75[0];
          this.chart2 = this.data.iouGreater75[1];
        } else if (this.activeTab === 'IOU≥0.95 mAP') {
          this.chart1 = this.data.iouGreater95[0];
          this.chart2 = this.data.iouGreater95[1];
        }
      } else if (this.modelType === 'ImageCategorySingle') {
        if (this.activeTab === '准确率Accuracy') {
          this.chart1 = this.data.accuracyList[0];
          this.chart2 = this.data.accuracyList[1];
        } else if (this.activeTab === '精确率Precision') {
          this.chart1 = this.data.precisionList[0];
          this.chart2 = this.data.precisionList[1];
        } else if (this.activeTab === '召回率Recall') {
          this.chart1 = this.data.recallList[0];
          this.chart2 = this.data.recallList[1];
        } else if (this.activeTab === 'F1-score') {
          this.chart1 = this.data.f1ScoreList[0];
          this.chart2 = this.data.f1ScoreList[1];
        } else if (this.activeTab === 'AUC') {
          this.chart1 = this.data.aucList[0];
          this.chart2 = this.data.aucList[1];
        } else if (this.activeTab === 'AP') {
          this.chart1 = this.data.apList[0];
          this.chart2 = this.data.apList[1];
        }
      }
    }
  }
};
</script>

<style scoped>

</style>
