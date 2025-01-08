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
          @change="getMonitorResources"
        />
      </div>
    </div>
    <!--选项行-->
    <div class="flex" style="width: 100%;margin-top: 14px;">
      <tab-seconds :tab-list="tabList" :active-tab="activeTab" @change="changeActiveTab" />
    </div>
    <div v-if="false">
      <div>namespace:{{ namespace }}</div>
      <div>deployment:{{ deployment }}</div>
      <div>grafanaUrl:{{ grafanaUrl }}</div>
    </div>
    <div v-if="false" class="padding-top-16 padding-bottom-16" style="width: 100%;height: calc(100%);">
      <!--iframe页面-->
      <iframe
        v-if="iframeSrc"
        class="flex flex-direction"
        width="100%"
        height="100%"
        :src="iframeSrc"
        frameborder="0"
      />
    </div>
    <div v-if="activeTab == '服务'" class="padding-top-16 padding-bottom-16" style="width: 100%;height: calc(100%);">
      <div style="width: 100%;height: 354px;min-height: 354px;">
        <line-chart v-if="chart1" :key="chart1" :config="chart1" :num="1" />
      </div>
      <div style="width: 100%;height: 354px;min-height: 354px;">
        <line-chart v-if="chart2" :key="chart2" :config="chart2" :num="2" />
      </div>
      <div style="width: 50%;height: 354px;min-height: 354px;display: inline-block;">
        <line-chart v-if="chart3" :key="chart3" :config="chart3" :num="1" />
      </div>
      <div style="width: 50%;height: 354px;min-height: 354px;display: inline-block;">
        <line-chart v-if="chart4" :key="chart4" :config="chart4" :num="2" />
      </div>
      <div style="width: 50%;height: 354px;min-height: 354px;display: inline-block;">
        <line-chart v-if="chart5" :key="chart5" :config="chart5" :num="1" />
      </div>
      <div style="width: 50%;height: 354px;min-height: 354px;display: inline-block;">
        <line-chart v-if="chart6" :key="chart6" :config="chart6" :num="2" />
      </div>
    </div>
    <div v-else-if="activeTab == 'Pod'" class="padding-top-16 padding-bottom-16" style="width: 100%;height: calc(100%);">
      <div style="width: calc(50% - 8px);border: 1px solid #EBEEF5; margin-right: 8px;height: 354px;min-height: 354px; display: inline-block;">
        <pie-chart v-if="chart4" :key="chart4" :config="chart4" />
      </div>
      <div style="width: calc(50% - 8px);border: 1px solid #EBEEF5; margin-left: 8px;height: 354px;min-height: 354px; display: inline-block;">
        <area-chart v-if="chart1" :key="chart1" :config="chart1" />
      </div>
      <div style="width: 200px;border: 1px solid #EBEEF5; margin-top: 16px;height: 354px;min-height: 354px; float: left;">
        <div
          style="
            margin-top: 16px;
            margin-left: 4px;
            color: #262626;
            font-weight: 600;"
        >容器重启总数</div>
        <div
          style="    top: 50%;
    position: relative;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    text-align: center;
    color: #267aff;
    font-weight: bold;
    font-size: 120px;"
        >{{ chart5 }}</div>
      </div>
      <div style="width: calc(100% - 216px); border: 1px solid #EBEEF5; margin-left: 16px;margin-top: 16px;height: 354px;min-height: 354px;; display: inline-block;">
        <area-chart v-if="chart2" :key="chart2" :config="chart2" />
      </div>
      <div style="width: 100%;border: 1px solid #EBEEF5; margin-top: 16px;height: 354px;min-height: 354px;">
        <area-chart v-if="chart3" :key="chart3" :config="chart3" />
      </div>
    </div>
    <div v-else-if="activeTab == 'Node'" class="padding-top-16 padding-bottom-16" style="width: 100%;height: calc(100%);">
      <div style="width: 100%;height: 354px;min-height: 354px;">
        <area-chart v-if="chart1" :key="chart1" :config="chart1" />
      </div>
      <div style="width: 100%;height: 354px;min-height: 354px;">
        <area-chart v-if="chart2" :key="chart2" :config="chart2" />
      </div>
      <div style="width: 100%;height: 354px;min-height: 354px;">
        <area-chart v-if="chart3" :key="chart3" :config="chart3" />
      </div>
      <div style="width: 100%;height: 354px;min-height: 354px;">
        <area-chart v-if="chart4" :key="chart4" :config="chart4" />
      </div>
      <div style="width: 100%;height: 354px;min-height: 354px;">
        <area-chart v-if="chart5" :key="chart5" :config="chart5" />
      </div>
      <div style="width: 100%;height: 354px;min-height: 354px;">
        <area-chart v-if="chart6" :key="chart6" :config="chart6" />
      </div>
    </div>

  </div>
</template>

<script>
import TabSeconds from '@/components/hpj/TabSeconds';
import LineChart from '@/views/model-manager/model-monitoring/detail2/components/line-chart';
import AreaChart from '@/views/model-manager/model-monitoring/detail2/components/area-chart';
import PieChart from '@/views/model-manager/model-monitoring/detail2/components/pie-chart';
import { changeTimeToLast, parseTime } from '@/utils';
import { getMonitorOutputTimeCost, getMonitorOutputAggregation, getMonitorResourcesWithNode, getMonitorResourcesWithPod } from '@/api/model-monitoring';
import { mapGetters } from 'vuex';

export default {
  name: 'MonitorResources',
  components: {
    TabSeconds,
    LineChart,
    AreaChart,
    PieChart
  },
  props: {
    namespace: {
      type: String,
      required: true
    },
    deployment: {
      type: String,
      required: true
    },
    modelId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      selectedDateRange: [new Date('2022-10-14 00:00:00'), new Date()],
      tabList: ['服务', 'Pod', 'Node'],
      activeTab: '服务',
      iframeParams: {
        path: '/d/5J05uyr7z/fu-wu-ren-wu-zi-yuan-jian-kong-xiang-qing',
        params: {
          orgId: 1,
          refresh: '1m',
          'var-PromDs': 'default',
          'var-namespace': this.namespace,
          'var-deployment': this.deployment,
          'var-pod': 'All',
          'var-container': 'All',
          theme: 'light',
          kiosk: null
        }
      },
      chart1: null,
      chart2: null,
      chart3: null,
      chart4: null,
      chart5: null,
      chart6: null
    };
  },
  computed: {
    ...mapGetters(['grafanaUrl'])
    // iframeSrc() {
    //   // return 'http://grafana.model-hubs.cn/d/5J05uyr7z/fu-wu-ren-wu-zi-yuan-jian-kong-xiang-qing?orgId=1&refresh=1m&var-cluster=ai-base-monitor&var-prom_ds=prometheus&var-PromDs=prometheus&var-namespace=ai-base&var-deployment=tensorflow-serve-predictor-default-00001-deployment&var-pod=All&var-container=All&theme=light&kiosk'
    //   // return this.grafanaUrl+'/d/5J05uyr7z/fu-wu-ren-wu-zi-yuan-jian-kong-xiang-qing?orgId=1&refresh=1m&var-cluster=ai-base-monitor&var-prom_ds=prometheus&var-PromDs=prometheus&var-namespace=ai-base&var-deployment=tensorflow-serve-predictor-default-00001-deployment&var-pod=All&var-container=All&theme=light&kiosk'
    //   // return `${this.grafanaUrl}/d/5J05uyr7z/devopsprodigy-kubegraf-deployments-dashboard?orgId=1&refresh=1m&var-cluster=ai-base-monitor&var-prom_ds=prometheus&var-PromDs=prometheus&var-namespace=${this.namespace}&var-deployment=${this.deployment}&var-pod=all&var-container=All&theme=light&kiosk`
    //   // return `${this.grafanaUrl}/d/5J05uyr7z/fu-wu-ren-wu-zi-yuan-jian-kong-xiang-qing?orgId=1&refresh=1m&var-cluster=ai-base-monitor&var-prom_ds=prometheus&var-PromDs=prometheus&var-namespace=${this.namespace}&var-deployment=${this.deployment}&var-pod=all&var-container=All&theme=light&kiosk`
    //   let url = this.grafanaUrl + this.iframeParams.path;
    //   const list = Object.getOwnPropertyNames(JSON.parse(JSON.stringify(this.iframeParams.params)));
    //   console.log(list);
    //   for (let i = 0; i < list.length; i++) {
    //     url += i === 0 ? '?' : '&';
    //     url += list[i];
    //     if (this.iframeParams.params[list[i]]) {
    //       url += '=' + this.iframeParams.params[list[i]];
    //     }
    //     if (this.selectedDateRange && this.selectedDateRange.length === 2) {
    //       url += `&from=${this.selectedDateRange[0].getTime()}`;
    //       url += `&to=${this.selectedDateRange[1].getTime()}`;
    //     }
    //   }
    //   url += '&new=' + Math.random();
    //   console.log(url);
    //   return url;
    // }
  },
  created() {
    // console.log('namespace:', this.namespace);
    // console.log('deployment:', this.deployment);
    // console.log('grafanaUrl:', this.grafanaUrl);
    this.getMonitorResources();
  },
  methods: {
    async getMonitorResources() {
      const params = {
        modelId: this.modelId,
        start: this.selectedDateRange == null ? '' : parseTime(this.selectedDateRange[0]),
        end: this.selectedDateRange == null ? '' : changeTimeToLast(this.selectedDateRange[1])
      };
      await getMonitorOutputTimeCost(params).then(res => {
        this.chart2 = res.data;
      });
      await getMonitorOutputAggregation(params).then(res => {
        this.chart1 = res.data[0];
        this.chart3 = res.data[1];
        this.chart4 = res.data[2];
        this.chart5 = res.data[3];
        this.chart6 = res.data[4];
      });
    },
    async getMonitorResourcesWithNode() {
      const params = {
        modelId: this.modelId,
        namespace: this.namespace,
        deployment: this.deployment,
        start: this.selectedDateRange == null ? '' : parseTime(this.selectedDateRange[0]),
        end: this.selectedDateRange == null ? '' : changeTimeToLast(this.selectedDateRange[1])
      };
      await getMonitorResourcesWithNode(params).then(res => {
        this.chart1 = {
          title: '内存使用情况',
          data: res.data.memoryList
        };
        this.chart2 = {
          title: '流量传输',
          data: res.data.trafficTransList
        };
        this.chart3 = {
          title: '流量接收',
          data: res.data.trafficReceiveList
        };
        this.chart4 = {
          title: 'CPU使用率',
          data: res.data.cpuUsedList
        };
        this.chart5 = {
          title: '写入IOPS',
          data: res.data.iopsWriteList
        };
        this.chart6 = {
          title: '读取IOPS',
          data: res.data.iopsReadList
        };
      });
    },
    async getMonitorResourcesWithPod() {
      const params = {
        modelId: this.modelId,
        namespace: this.namespace,
        deployment: this.deployment,
        start: this.selectedDateRange == null ? '' : parseTime(this.selectedDateRange[0]),
        end: this.selectedDateRange == null ? '' : changeTimeToLast(this.selectedDateRange[1])
      };
      await getMonitorResourcesWithPod(params).then(res => {
        this.chart1 = {
          title: '状态',
          data: res.data.statusList
        };
        this.chart2 = {
          title: '容器重启',
          data: res.data.containerRestartList
        };
        this.chart3 = {
          title: '容器状态',
          data: res.data.containerStatusList
        };
        this.chart4 = {
          title: '资源总览',
          data: res.data.resourceOverviewList
        };
        this.chart5 = res.data.containerRestartNum;
      });
    },
    changeActiveTab(tab) {
      this.activeTab = tab;
      if (document.getElementById('echartsArea')) {
        document.getElementById('echartsArea').scrollTop = 0;
      }
      this.chart1 = null;
      this.chart2 = null;
      this.chart3 = null;
      this.chart4 = null;
      this.chart5 = null;
      this.chart6 = null;
      if (this.activeTab === '服务') {
        this.getMonitorResources();
      } else if (this.activeTab === 'Node') {
        this.getMonitorResourcesWithNode();
      } else if (this.activeTab === 'Pod') {
        this.getMonitorResourcesWithPod();
      }
    }
  }
};
</script>

<style scoped>

</style>
