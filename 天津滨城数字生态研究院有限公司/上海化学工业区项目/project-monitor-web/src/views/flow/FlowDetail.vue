<template>
  <el-container class="FlowDetail full-vh">
    <el-header class="ee-header FlowDetail__header is-shadow d-flex ai-center pdl20" height="58px">
      <el-button class="is-single" size="small" @click="$router.go(-1)">
        <el-icon><arrow-left-bold /></el-icon>
      </el-button>
      <div class="d-flex ai-center f14 f-l3 ml12">
        <svg-icon icon-class="home-bread" width="24px" height="24px" />当前位置：
      </div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/flow' }">流程模板</el-breadcrumb-item>
        <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-main class="FlowDetail__main flex-y-center over-h" style="padding: 20px 0 0;">
      <div class="full-w pdl20">
        <ee-title :title="title" level="2"></ee-title>
      </div>
      <div ref="mermaid" class="full-w flex-1 mt12 y-hidden">
        <EeFlowchart class="is-plain" :flowId="flowId" :text="flowText" mode="plain" :showFullscreen="false"
          nodePlacementStrategy="BRANDES_KOEPF" @node-click="handleNodeClick" />
      </div>
    </el-main>
    <NodeFlow :show="visible" :title="childTitle" :flowId="childFlowId" :image="flowImage" />
  </el-container>
</template>

<script>
import EeFlowchart from '@/components/EeFlowchart.vue'
import NodeFlow from './NodeFlow.vue'
import * as flowData from '@/utils/flowData.js'
const { flowList } = flowData
export default {
  name: 'FlowDetail',
  components: {
    EeFlowchart,
    NodeFlow
  },
  data() {
    return {
      title: '',
      flowId: `flow_${this.$route.params.id}`,
      // flowId: `flow_0_5`,
      // flowId: `flow_1_1`,
      visible: false,
      flowImage: '',
      childFlowId: '',
      childTitle: ''
    }
  },
  computed: {
    flowText() {
      return flowData[this.flowId]
    }
  },
  created() {
    this.title = flowList[this.$route.params.id].name + '流程模板'
  },
  mounted() {
    // this.handleNodeClick({ id: 0, name: '申请' })
  },
  methods: {
    handleNodeClick({ id, name }) {
      // console.log('handleNodeClick', id)
      this.childTitle = name
      this.childFlowId = `${this.flowId}_${id}`
      this.visible = !this.visible
    }
  }
}

</script>
<style lang='scss'>
.FlowDetail {
  &__main {
    background: #F6F6F6;
    box-shadow: 0px 0px 16px rgba(20, 38, 82, 0.07);
  }
}
</style>