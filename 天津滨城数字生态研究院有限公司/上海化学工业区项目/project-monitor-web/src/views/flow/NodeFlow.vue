<template>
  <el-drawer class="NodeFlow" v-model="visible" :size="968" :close-on-click-modal="false">
    <template #header="{ close, titleId, titleClass }">
      <div class="d-flex ai-center jc-between flex-1">
        <div class="f500">{{ title }}</div>
      </div>
    </template>
    <ee-title class="ml24 mt12" title="流程示例" level="2"></ee-title>
    <div class="mermaid mt12">
      <EeFlowchart :flowId="flowId" :image="flowId" height="296px" mode="plain" :showFullscreen="false" />
    </div>
    <div class="pdl24 mt20">
      <ee-title title="环节流程" level="2"></ee-title>
    </div>
    <div style="padding: 24px 24px 0;">
      <div class="ee-timeline">
        <div v-for="(n, i) in nodeList" :key="n.stepName" class="ee-timeline-item d-flex">
          <div class="ee-timeline-item__node">
            <div class="ee-timeline-item__icon flex-y-center ddin">{{ i + 1 }}</div>
          </div>
          <div class="ee-timeline-item__content ml8 flex-1">
            <div class="d-flex ai-center jc-between">
              <div class="f16 f500">{{ n.stepName }}</div>
              <!-- <el-button type="primary" link>上传知识文件</el-button> -->
            </div>
            <el-descriptions class="mt8 layout-fixed" :column="3">
              <el-descriptions-item label="发起部门：" label-class-name="w75" align="left" width="32%">
                <span :title="n.startDeptName">{{ n.startDeptName || '-' }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="受理或经办部门：" label-class-name="w120" align="left" width="36%">
                <span :title="n.acceptDeptName">{{ n.acceptDeptName || '-' }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="协调部门：" align="left" width="32%">
                <span :title="n.coordinateDeptName">{{ n.coordinateDeptName || '-' }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="联系人：" label-class-name="w75" align="left" width="32%">
                {{ n.stepContactName || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="法定时限：" label-class-name="w120" align="left" width="32">
                <span :class="{ 'ddin-n f16': n.stepDurationFd }">{{ n.stepDurationFd || '-' }}</span>
                <span v-if="n.stepDurationFd">个{{ getDictName(duration_type, n.durationTypeCode || 'work_day') }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="承诺时限：" align="left" width="36%">
                <span :class="{ 'ddin-n f16': n.stepDuration }">{{ n.stepDuration || '-' }}</span>
                <span v-if="n.stepDuration">个{{ getDictName(duration_type, n.durationTypeCode || 'work_day') }}</span>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { nodeStatusList } from '@/utils/constant.js'
import { flowList } from '@/utils/flowData.js'
import EeFlowchart from '@/components/EeFlowchart.vue'
import { stepBaseinfo_getByPeriodId } from '@/api/pm/stepBaseinfo.js'
import useDictStore from '@/store/modules/dict'

const periodIds = [
  [10001, 10002, 10003, 10004, 10005, 10006],
  [10007, 10008, 10009, 10010, 10011, 10012],
]

export default {
  name: 'NodeFlow',
  components: {
    EeFlowchart
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    flowId: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      ...useDictStore().getDicts(['duration_type']),
      visible: false,
      nodeStatusList,
      flowList,
      tableData: [],
      flowImage: 'flow_0_0',
      nodeList: []
    }
  },
  watch: {
    show() {
      this.visible = true
    },
    flowId() {
      this.getNodeList()
    }
  },
  created() {
    this.getNodeList()
  },
  methods: {
    getNodeList() {
      if (!this.flowId) return
      stepBaseinfo_getByPeriodId({
        periodId: periodIds[this.flowId.split('_')[1]][this.flowId.split('_')[2]]
      }).then(({ result }) => {
        this.nodeList = result
      })
    }
  }
};
</script>

<style lang="scss">
.NodeFlow {
  .mermaid {
    background: #F6F6F6;
  }

  .w75,
  .w120 {
    display: inline-block;
    text-align: right;
  }

  .w75 {
    width: 75px;
  }

  .w120 {
    width: 120px;
  }

  .ee-timeline {
    &-item {
      margin-top: 8px;

      &:first-child {
        margin-top: 0;
      }

      &:last-child {
        .ee-timeline-item__node {
          &::after {
            display: none;
          }
        }
      }

      &__icon {
        width: 24px;
        height: 24px;
        background: #02ADEC;
        border: 2px solid #d2eef9;
        border-radius: 100%;
        color: #fff;
      }

      &__node {
        position: relative;

        &::after {
          content: '';
          position: absolute;
          top: 32px;
          bottom: 0;
          left: 50%;
          width: 1px;
          background: #DBE1E9;
          transform: translateX(-50%);
        }
      }

      &__content {
        padding-bottom: 4px;
      }

      .el-descriptions {
        padding: 14px;
        border-radius: 8px;
        background: #F6F6F6;
      }

      .el-descriptions__body {
        background: none;
      }

      .el-descriptions__cell {
        padding-bottom: 0 !important;
      }
    }
  }
}
</style>

