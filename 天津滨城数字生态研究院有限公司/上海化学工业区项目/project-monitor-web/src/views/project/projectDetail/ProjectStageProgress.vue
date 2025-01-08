<template>
  <div class="ProjectStageProgress">
    <div class="ee-title jc-between">
      <span class="ee-title__text">阶段环节详情</span>
    </div>

    <div v-show="stageList.length > 0" v-loading="loading" element-loading-background="transparent"
      element-loading-spinner="none" class="stage-wrap mt12 pdb12 x-auto y-hidden">
      <div class="d-flex">
        <div v-for="(n, i) in stageList" :key="n.periodId" class="ee-card stage-card flex-1 pointer relative"
          :class="{ 'is-active': i === curStage }" @click="curStage = i">
          <div class="d-flex ai-center">
            <span class="f18 f500">{{ n.periodName }}</span>
            <ee-tag class="is-dark ml12" :type="stageStyles[n.statusCode]" shape="oval">
              {{ getDictName(period_status, n.statusCode) }}
            </ee-tag>
          </div>
          <div class="mt2 flex-1" :class="i !== curStage ? 'f-l3' : ''">
            共 <span class="f18 ddin" :class="{ 'f-primary': i !== curStage }">{{ n.totalSteps || 0 }}</span> 个环节
          </div>
          <!-- <div class="d-flex ai-center">
            <el-progress class="flex-1" :percentage="Number(n.periodProgress || 0)" :color="stageColors[n.statusCode]"
              :stroke-width="8" :show-text="false" />
            <span :class="i !== curStage ? 'f-' + stageStyles[n.statusCode] : ''" class="ml12 ddin">
              {{ n.periodProgress || 0 }}%
            </span>
          </div> -->
          <el-descriptions class="layout-fixed f16" :column="1">
            <template v-if="[10005, 10006, 10011, 10012].indexOf(n.periodId) < 0">
              <el-descriptions-item label="承诺用时：" label-class-name="w75" align="left">
                <template v-if="n.esUseDays">
                  <span class="ddin-n f16">{{ n.esUseDays }}</span>
                  <span>天</span>
                </template>
                <template v-else>-</template>
              </el-descriptions-item>
              <el-descriptions-item label="实际用时：" label-class-name="w75" align="left">
                <template v-if="n.days">
                  <span class="ddin-n f16">{{ n.days }}</span>
                  <span>天</span>
                </template>
                <template v-else>-</template>
              </el-descriptions-item>
            </template>
          </el-descriptions>
          <el-icon class="stage-card__arrow absolute" v-show="curStage === i" color="#86B3D3" size="28">
            <CaretBottom />
          </el-icon>
        </div>
      </div>
    </div>

    <div v-loading="loading" element-loading-background="transparent" element-loading-spinner="none"
      class="ee-card ee-card--shadow mt8 flow-wrap" :class="tabId == 1 ? 'show-flowchart' : 'show-table'">
      <div class="radio-row d-flex jc-between pl-l pr-l pt-l">
        <div class="d-flex ai-center flex-1 flex-wrap mr20">
          <el-tag v-for="n in curStageConditions" class="mr8 mb8" type="info">{{ n.conditionName }}：<span
              class="el-tag__val">{{ n.itemName }}</span></el-tag>
        </div>
        <div>
          <el-radio-group v-model="tabId">
            <el-radio-button label="1">
              <div class="d-flex ai-center">
                <svg-icon class="el-icon--left" icon-class="card" width="16px" height="16px" />卡片
              </div>
            </el-radio-button>
            <el-radio-button label="2">
              <div class="d-flex ai-center">
                <svg-icon class="el-icon--left" icon-class="list" width="16px" height="16px" />
                列表
              </div>
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div v-if="tabId == 1" class="wrap-flowchart">
        <div class="flow-tools"></div>
        <ProjectNodeFlow v-show="flowData.nodeData.length > 0" ref="ProjectNodeFlow" :flowId="flowId" :data="flowData"
          height="auto" show-status @policy="handleOpenPolicy" @shift="e => { handleNodeAction('nodeShift', e) }"
          @remark="e => { handleNodeAction('nodeRemark', e) }" @detail="handleNodeDetail" @change="handleNodeChange"
          @fullscreen="handleFullscreen" />
        <el-empty v-show="flowData.nodeData.length < 1" class="ee-empty-data" description="暂无环节信息">
          <template #image>
            <svg-icon icon-class="empty-data" />
          </template>
        </el-empty>
      </div>
      <ProjectNodeList v-show="tabId == 2" class="mt20" :data="flowData.nodeData" @policy="handleOpenPolicy"
        @detail="handleNodeDetail" @shift="e => { handleNodeAction('nodeShift', e) }"
        @remark="e => { handleNodeAction('nodeRemark', e) }" @change-status="handleNodeChange"
        style="padding: 0 20px 20px;" />
    </div>
    <NodeHandleDetail :show="showNodeDetail" :params="curRow" @remark="e => { handleNodeAction('nodeRemark', e) }" />
    <ProjectHandleForm :show="dialogVisible" :mode="mode" :params="curRow" @success="onHandleFormSuccess" />
  </div>
</template>

<script>
import { stageColors, stageStyles } from '@/utils/constant.js'
import ProjectNodeList from './ProjectNodeList';
import NodeHandleDetail from './NodeHandleDetail';
import ProjectNodeFlow from '../ProjectNodeFlow';
import ProjectHandleForm from './ProjectHandleForm';
import { ruPeriodAct_getPeriodFLow } from '@/api/pm/ruPeriodAct.js'
import { ruStepAct_getStepFlowDetail, ruStepAct_updateStepStatus } from '@/api/pm/ruStepAct.js'
import useDictStore from '@/store/modules/dict'
import useProjectStore from '@/store/modules/project'

export default {
  name: 'ProjectStageProgress',
  components: {
    ProjectNodeList,
    NodeHandleDetail,
    ProjectNodeFlow,
    ProjectHandleForm
  },
  props: {
    params: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      ...useDictStore().getDicts(['period_status', 'project_type', 'land_supply_type']),
      visible: false,
      stageColors,
      stageStyles,
      form: {},
      curStage: '',
      stageList: [],
      tabId: '1',
      showNodeDetail: false,
      flowData: {
        nodeData: [],
        lineData: []
      },
      dialogVisible: false,
      mode: '',
      curRow: {},
      loading: false,
    }
  },
  computed: {
    flowId() {
      return `flow_${this.periodId}`
    },
    periodId() {
      return this.stageList.length > 0 && this.curStage !== '' ? this.stageList[this.curStage].periodId : ''
    },
    curStageConditions() {
      if (this.stageList.length > 0 && this.curStage !== '')
        return this.stageList[this.curStage].conditions
      return []
    }
  },
  watch: {
    curStage() {
      this.getNodeList()
    },
    params: {
      handler() {
        this.getStageList(false)
      },
      deep: true
    }
  },
  created() {
    this.projectId = this.$route.params.id
    this.getStageList(true)
  },
  methods: {
    getStageList(resetCurStage) {
      ruPeriodAct_getPeriodFLow({
        projectId: this.projectId
      }).then(({ result }) => {
        this.stageList = result || []
        let newStage = result.findIndex(n => n.statusCode === '0' || n.statusCode === '1')
        if (newStage < 0) {
          newStage = result.length - 1
        }
        if (newStage === this.curStage || !resetCurStage) {
          this.getNodeList()
        }
        if (resetCurStage) {
          this.curStage = newStage
        }
      }).catch(e => {
        console.log(e)
      })
    },
    getFlowLinesByNodeList(list) {
      const lineData = list.filter(n => !n.nextNodeId.includes(',') && n.nextNodeId != '0')
      list.filter(n => n.nextNodeId.includes(',')).forEach(n => {
        n.nextNodeId.split(',').forEach(c => {
          if (c !== '0' && c !== '') {
            lineData.push({
              ...n,
              nextNodeId: c,
            })
          }
        })
      })
      return lineData.map(n => ({
        begin: n.nodeId,
        end: n.nextNodeId
      }))
    },
    getNodeList() {
      if (!this.periodId) return
      this.loading = true
      ruStepAct_getStepFlowDetail({
        projectId: this.projectId,
        periodId: this.periodId
      }).then(({ result }) => {
        let nodeData = result.map(n => ({
          ...n,
          name: n.stepName,
          nodeId: n.stepId,
          status: n.statusCode || '0',
          lastNodeId: n.lastSteps,
          nextNodeId: n.nextSteps
        }))
        let lineData = this.getFlowLinesByNodeList(nodeData)
        this.flowData = {
          nodeData,
          lineData
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleNodeChange({ id, status }) {
      const nodeObj = this.flowData.nodeData.find(n => n.nodeId === id)
      const { stepId, startTime, statusCode } = nodeObj
      const statusMap = {
        '1': 'nodeContinue',
        '2': 'nodeStop',
        '3': 'nodeComplete',
      }
      this.handleNodeAction(statusMap[status], {
        projectId: this.projectId,
        periodId: this.periodId,
        stepId, statusCode: status, curStatusCode: statusCode, startTime
      })
    },
    handleNodeAction(mode, obj) {
      this.curRow = obj
      this.mode = mode
      this.dialogVisible = !this.dialogVisible
    },
    onHandleFormSuccess(mode) {
      console.log(`ProjectStageProgress onHandleFormSuccess ${mode}`)
      if (['nodeComplete', 'nodeContinue', 'nodeStop'].indexOf(mode) > -1) {
        this.$emit('refresh')
      } else if (mode === 'nodeRemark') {
        useProjectStore().setRefreshRemark()
      }
    },
    handleBack() {
      this.$router.go(-1)
    },
    handleNodeDetail(obj) {
      this.curRow = {
        ...obj,
        projectId: this.projectId,
        periodId: this.periodId,
        stepId: obj.nodeId,
        periodName: this.stageList[this.curStage].periodName
      }
      this.showNodeDetail = !this.showNodeDetail
    },
    handleOpenPolicy(obj, type = 0) {
      window.open(`${location.origin}/policy?labelType=${type}&labelId=${obj.stepId}&periodId=${this.periodId}`, '_blank')
    },
    handleFullscreen() {
      this.$emit('fullscreen')
    },
    resetFlowchart() {
      this.$refs.ProjectNodeFlow.reset()
    }
  }
};
</script>

<style lang="scss">
.ProjectStageProgress {
  .stage-card {
    padding: 12px 16px 16px;
    margin-right: 16px;
    min-width: 206px;
    height: 131px;
    border-radius: 16px;

    .el-descriptions__body {
      background: none;
    }

    &__arrow {
      bottom: -16px;
      left: 50%;
      transform: translateX(-50%);
    }

    &:last-child {
      margin-right: 0;
    }

    &.is-active {
      background: linear-gradient(to bottom, #3478A9, #86B3D3);
      color: #fff !important;

      .el-descriptions__cell,
      .el-descriptions__label,
      .el-descriptions__content {
        color: #fff !important;
      }
    }

    .ee-tag {
      font-size: 14px;
    }
  }

  .el-descriptions__body .el-descriptions__table:not(.is-bordered) .el-descriptions__cell {
    padding-bottom: 3px;
  }

  .w98 {
    display: inline-block;
    width: 98px;
    text-align: left;
  }

  .w75 {
    display: inline-block;
    width: 75px;
    text-align: left;
  }

  .show-flowchart {
    background: #F6F6F6;

    .radio-row {
      padding-bottom: 20px;
      background: #FAFAFA;
      border-bottom: 1px solid #EBE9F1;
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
    }

    .flow-tools {
      background: #FAFAFA;
      height: 60px;
    }

    .ee-flowchart__tool {
      top: -44px;
    }
  }

  .show-table {
    background: #fff;
  }

  &.project-status--4 {
    .ee-flowchart .node .ee-tag {
      cursor: default;

      .iconfont {
        display: none;
      }

      &:hover {
        .node-dropdown {
          display: none !important;
        }
      }
    }

    .node-dropdown {
      display: none !important;
    }

    .cell {
      .el-dropdown {
        pointer-events: none;

        .el-icon {
          display: none;
        }
      }

      .btn-shift {
        color: #a8acad !important;
        pointer-events: none;
      }
    }

    .node-link--shift {
      pointer-events: none;
      opacity: 0.5;
    }

  }
}

@media screen and (max-width: 1600px) {
  .ProjectStageProgress {
    .stage-card {
      margin-right: 6px;
    }
  }
}
</style>

