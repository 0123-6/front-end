<template>
  <!--最外层-->
  <div
    class="flex flex-direction bgc-white margin-16 font-size-14 color-content box-shadow-1 border-radius-4"
    style="width: calc(100% - 32px);height: calc(100% - 32px);min-height: 600px;"
  >
    <!--标题-->
    <div
      class="flex justify-between align-center padding-left-24 padding-right-24"
      style="width: 100%;height: 52px;border-bottom: 1px solid #ECEEF5;"
    >
      <div class="flex font-size-16 font-weight-600 color-title">
        {{ modelId }}-{{ modelNameCh }}
      </div>
      <el-button class="return-btn" icon="el-icon-caret-left" @click="goBack">返回</el-button>
    </div>
    <!--选项行-->
    <div
      class="flex margin-top-16 margin-left-24 margin-right-24"
      style="width: calc(100% - 48px);"
    >
      <hpj-tabs :tab-list="tabList" :active-tab.sync="activeTab" @change="changeActiveTab" />
    </div>
    <!--组件-->
    <div class="flex flex-1 margin-left-24 margin-right-24 overflow-auto" style="width: calc(100% - 48px);margin-top: 10px;">
      <component :is="tabToComponents[activeTab]" :model-id="modelId" :namespace="namespace" :deployment="deployment" :model-type="modelType" />
    </div>
  </div>
</template>

<script>
import HpjTabs from '@/components/hpj/HpjTabs';
export default {
  name: 'Index',
  components: {
    HpjTabs,
    MonitorPerformance: () => import('./components/monitor-performance'),
    MonitorInput: () => import('./components/monitor-input'),
    MonitorOutput: () => import('./components/monitor-output'),
    MonitorResources: () => import('./components/monitor-resources'),
    MonitorFairness: () => import('./components/monitor-fairness'),
    MonitorSet: () => import('./components/monitor-set')
  },
  props: {
    id: {
      type: String,
      required: true
    },
    modelNameCh: {
      type: String,
      required: true
    },
    namespace: {
      type: String,
      required: true
    },
    deployment: {
      type: String,
      required: true
    },
    tab: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      modelId: null,
      // tabList:['性能','输入','输出','资源','公平性','设置'],
      tabList: ['性能', '输入', '输出', '资源'],
      tabToComponents: {
        '性能': 'MonitorPerformance',
        '输入': 'MonitorInput',
        '输出': 'MonitorOutput',
        '资源': 'MonitorResources',
        '公平性': 'MonitorFairness',
        '设置': 'MonitorSet'
      },
      activeTab: '性能',
      selectedDateRange: []
    };
  },
  created() {
    this.modelId = Number(this.id);
    this.modelType = this.type;
    this.activeTab = this.tab;
  },
  methods: {
    // 修改活跃选项框
    changeActiveTab(activeTab) {
      this.activeTab = activeTab;
    },
    goBack() {
      this.$router.back();
    }
  }
};
</script>

<style scoped>

</style>
