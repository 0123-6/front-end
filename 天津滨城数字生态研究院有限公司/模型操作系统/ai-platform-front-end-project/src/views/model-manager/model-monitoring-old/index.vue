<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-06-01 11:03:00
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-06 10:31:23
 * @FilePath: \ai-platform-front-end-project\src\views\model-manager\model-monitoring\other.vue
 * @Description: 监控总览
-->
<template>
  <div class="monitoring-container">
    <div class="monitoring-options">
      <el-select v-model="timeSelected" placeholder="请选择">
        <el-option
          v-for="item in timeSelectOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div class="monitoring-overview-container" @click="toMonitoringDetail">
      <el-row :gutter="12">
        <el-col :span="6">
          <div class="monitoring-overview-center">
            <div class="monitoring-overview-type">服务模型数</div>
            <div class="monitoring-overview-detail model-color">
              {{ overviewOptions.modelNumber }}
              <span
                class="normal-color normal-size"
              >/ {{ overviewOptions.modelTotal }}
              </span>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="monitoring-overview-center">
            <div class="monitoring-overview-type">请求总数</div>
            <div class="monitoring-overview-detail total-color">
              {{ overviewOptions.requestTotal }}
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="monitoring-overview-center">
            <div class="monitoring-overview-type">请求延迟记录数</div>
            <div class="monitoring-overview-detail delay-color">
              {{ overviewOptions.requestDelayNumber }}
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="monitoring-overview-center">
            <div class="monitoring-overview-type">请求延迟记录和</div>
            <div class="monitoring-overview-detail sum-color">
              {{ overviewOptions.requestDelaySum }}
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="monitoring-charts-container">
      <div class="monitoring-charts-center">
        <!-- <div class="monitoring-charts-type">CPU使用率</div> -->
        <div class="monitoring-charts-detail">
          <line-area-chart
            :el-id="'CPUContainer'"
            :y-axis-name="'CPU用量(core)'"
            :detail-data="CPUData"
          />
        </div>
      </div>
      <!-- <div class="monitoring-charts-center">
        <div class="monitoring-charts-type">GPU使用率</div>
        <div class="monitoring-charts-detail">
          <line-area-chart
            :el-id="'GPUContainer'"
            :yAxisName="'GPU使用率'"
            :detail-data="GPUData"
          />
        </div>
      </div> -->
      <div class="monitoring-charts-center">
        <!-- <div class="monitoring-charts-type">内存使用情况</div> -->
        <div class="monitoring-charts-detail">
          <line-area-chart
            :el-id="'memoryContainer'"
            :y-axis-name="'内存用量(Gi)'"
            :detail-data="memoryData"
            :format-size="1024*1024*1024"
          />
        </div>
      </div>
      <div class="monitoring-charts-center">
        <!-- <div class="monitoring-charts-type">出站流量</div> -->
        <div class="monitoring-charts-detail">
          <line-area-chart
            :el-id="'transmittedContainer'"
            :y-axis-name="'出站流量(Mbps)'"
            :detail-data="transmittedData"
            :format-size="1024*1024"
          />
        </div>
      </div>
      <div class="monitoring-charts-center">
        <!-- <div class="monitoring-charts-type">入站流量</div> -->
        <div class="monitoring-charts-detail">
          <line-area-chart
            :el-id="'receivedContainer'"
            :y-axis-name="'入站流量(Kbps)'"
            :detail-data="receivedData"
            :format-size="1024"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import lineAreaChart from '@/views/model-manager/model-monitoring/components/lineAreaChart.vue';
import chartsJson from '@/assets/json/chartsData.json';

export default {
  components: {
    lineAreaChart
  },
  data() {
    return {
      timeSelected: '7days',
      timeSelectOptions: [
        { value: '5min', label: '最后5分钟' },
        { value: '15min', label: '最后15分钟' },
        { value: '30min', label: '最后30分钟' },
        { value: '1hours', label: '过去1小时' },
        { value: '3hours', label: '过去3小时' },
        { value: '6hours', label: '过去6小时' },
        { value: '12hours', label: '过去12小时' },
        { value: '24hours', label: '过去24小时' },
        { value: '2days', label: '过去2天' },
        { value: '7days', label: '过去7天' },
        { value: '30days', label: '过去30天' },
        { value: '90days', label: '过去90天' }
      ],
      overviewOptions: {
        modelTotal: 200,
        modelNumber: 20,
        requestTotal: 100000,
        requestDelayNumber: 100,
        requestDelaySum: 10
      },
      CPUData: [],
      memoryData: [],
      transmittedData: [],
      receivedData: []
    };
  },
  mounted() {
    this.getChartsData();
  },
  methods: {
    getChartsData() {
      chartsJson.results.map((item) => {
        if (item.metric_name === 'pod_cpu_usage') {
          this.CPUData = item.data.result;
        } else if (item.metric_name === 'pod_memory_usage_wo_cache') {
          this.memoryData = item.data.result;
        } else if (item.metric_name === 'pod_net_bytes_transmitted') {
          this.transmittedData = item.data.result;
        } else if (item.metric_name === 'pod_net_bytes_received') {
          this.receivedData = item.data.result;
        }
      });
    },
    toMonitoringDetail() {
      this.$router.push('/model-manager/monitoring/monitoring-detail');
    }
  }
};
</script>

<style scoped lang="scss">
$fontColor_normal: #646464;
$fontColor_model: #0164ff;
$fontColor_total: #00b1b2;
$fontColor_delay: #e56e0d;
$fontColor_sum: #fd5e3a;

.monitoring-container {
  margin: 16px 217px 24px;
  padding: 44px 56px;
  background: #f6faff;
  box-shadow: 0 2px 6px 0 rgba(194, 199, 199, 0.5);
  border-radius: 1px;
  .monitoring-options {
    margin-bottom: 8px;
  }
  .monitoring-overview-container {
    .monitoring-overview-center {
      height: 98px;
      background: #ffffff;
      border: 1px solid rgba(207, 213, 222, 1);
      padding-top: 16px;
      padding-bottom: 16px;
      text-align: center;
      .monitoring-overview-type {
        font-family: SourceHanSansSC-Medium;
        font-size: 14px;
        color: $fontColor_normal;
        letter-spacing: 0;
        line-height: 14px;
        font-weight: 400;
        margin-bottom: 14px;
      }
      .monitoring-overview-detail {
        font-family: Helvetica-Bold;
        font-size: 32px;
        letter-spacing: 0;
        line-height: 32px;
        font-weight: 700;
      }
    }
  }
  .monitoring-charts-container {
    margin-top: 24px;
    .monitoring-charts-center {
      & + .monitoring-charts-center {
        margin-top: 24px;
      }
      .monitoring-charts-type {
        font-family: SourceHanSansSC-Regular;
        font-size: 14px;
        color: #262626;
        letter-spacing: -0.6px;
        line-height: 14px;
        font-weight: 400;
        &::before {
          content: "";
          width: 3px;
          height: 14px;
          display: inline-block;
          background: $fontColor_model;
          top: 3px;
          position: relative;
          margin-right: 8px;
        }
      }
    }
  }
  .normal-size {
    font-size: 16px;
  }
  .normal-color {
    color: $fontColor_normal;
  }
  .model-color {
    color: $fontColor_model;
  }
  .total-color {
    color: $fontColor_total;
  }
  .delay-color {
    color: $fontColor_delay;
  }
  .sum-color {
    color: $fontColor_sum;
  }
}
</style>
