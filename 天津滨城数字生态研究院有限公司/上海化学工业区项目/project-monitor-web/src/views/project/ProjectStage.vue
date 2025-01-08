<template>
  <el-container v-loading="loading" element-loading-background="transparent" element-loading-spinner="none"
    class="ProjectStage over-h">
    <el-header class="d-flex ai-center jc-between transition-all pl-l pr-l" height="118px">
      <template v-for="(n, i) in stages" :key="n.periodName">
        <div class="flex-y-center stage-item pointer relative flex-1" :class="{ 'is-active': curStage === i }"
          @click="curStage = i">
          <div class="stage-item__index f14 ddin absolute">{{ i + 1 }}</div>
          <div class="stage-item__icon-bg flex-y-center">
            <svg-icon :icon-class="`stage${i + 1}`" width="32px" height="32px" />
          </div>
          <span class="stage-item__name mt4 f14 f500">{{ n.periodName }}</span>
          <el-icon class="stage-item__arrow absolute" v-show="curStage === i" color="#86B3D3" size="24">
            <CaretBottom />
          </el-icon>
        </div>
        <svg-icon v-if="i < stages.length - 1" class="stage-arrow ml12 mr12" icon-class="stage-arrow" width="24px"
          height="24px" />
      </template>
    </el-header>
    <el-main class="ProjectStage__main" style="min-height: 0px;">
      <div v-show="!curStageObj.noneProp || isEdit" class="d-flex condition-wrap pdb8">
        <el-form class="judgement-form flex-1 d-flex ai-center flex-wrap pl-l mt20" inline :model="form" :rules="rules">
          <el-form-item v-for="n in propList" :key="n.name" v-show="hiddenProps.indexOf(n.name) < 0"
            :label="n.label + ':'" :labelWidth="n.labelWidth" :prop="n.name">
            <el-select class="flex-1" v-model="form[n.name]" placeholder="请选择" :disabled="n.disabled"
              style="width: 140px;">
              <el-option v-for="item in n.options" :key="item.conditionItemCode" :label="item.conditionItemName"
                :value="item.conditionItemCode" />
            </el-select>
            <el-button class="ml8" type="primary" link @click="handleOpenPolicy(n, 1)"
              :style="{ visibility: n.associatedKnowledge ? 'visible' : 'hidden' }">
              <svg-icon icon="policy" width="18px" height="18px" />
            </el-button>
          </el-form-item>
          <el-form-item label-width="20px" :style="{ visibility: curStageObj.noneProp ? 'hidden' : 'visible' }">
            <el-button class="ml10" @click="handleResetForm">重置</el-button>
          </el-form-item>
        </el-form>
        <div>
          <el-button class="ml8 mr20 mt28" type="primary" link @click="handleShift">
            <svg-icon class="el-icon--left" icon-class="shift" width="14px" height="14px" />
            调度转办
          </el-button>
        </div>
      </div>
      <div class="full-w pl-l pr-l pdt16 pdb16 node-set-title">
        <ee-title title="环节设置" level="2"></ee-title>
      </div>
      <div v-show="showFlow" class="full-w flex-1" style="min-height:0;">
        <ProjectNodeFlow ref="ProjectNodeFlow" :flowId="flowId" :data="flowData" showEdit :showStatus="isEdit"
          :disabled="isEdit" @edit="handleEditNode" @policy="handleOpenPolicy" @fullscreen="handleFullscreen" />
      </div>
      <el-empty v-show="!showFlow" class="full-w flex-1" description="请先完成以上条件筛选"
        style="--el-empty-image-width:337px;--el-empty-description-margin-top:-50px;--el-font-size-base:18px;">
        <template #image>
          <svg-icon icon-class="empty" width="337px" height="221px" />
        </template>
      </el-empty>
    </el-main>
    <el-footer class="d-flex ai-center jc-end transition-all over-h pr-l" height="72px">
      <el-button @click="handleCancel">取消</el-button>
      <el-button v-show="isDraft || !isEdit" type="primary" plain @click="handleSave(true)">存为草稿</el-button>
      <el-button type="primary" plain :disabled="curStage == 0" @click="handleLast">上一步</el-button>
      <el-button type="primary" plain :disabled="curStage == stages.length - 1" @click="handleNext">下一步</el-button>
      <el-button type="primary" @click="handleConfirm(true)">确定</el-button>
    </el-footer>
    <ProjectNodeForm :show="showNodeForm" :data="curNode" />
    <ProjectHandleForm :show="showHandleForm" mode="shift" :propList="propList" :params="handleFormParam"
      @success="onHandleFormSuccess" />
  </el-container>
</template>

<script>
import ProjectNodeFlow from './ProjectNodeFlow';
import ProjectNodeForm from '@/views/project/ProjectNodeForm'
import ProjectHandleForm from './projectDetail/ProjectHandleForm';
import { periodCondition_queryByPeriodId } from '@/api/pm/periodCondition.js'
import { stepBaseFlow_stepFlow } from '@/api/pm/stepBaseFlow.js'

export default {
  name: 'ProjectStage',
  components: {
    ProjectNodeFlow,
    ProjectNodeForm,
    ProjectHandleForm
  },
  props: {
    isDraft: {
      type: Boolean,
      default: false
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    projectTypeCode: {
      type: [String, Number],
      default: ''
    },
    stageList: {
      type: Array,
      default() {
        return []
      }
    },
    defaultForm: {
      type: Object,
      default() {
        return {}
      }
    },
    autoFill: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      isEdit: false,
      loading: false,
      stages: [],
      curStage: 0,
      form: {},
      rules: {},
      showNodeForm: false,
      curNode: {},
      showHandleForm: false,
      handleFormParam: {},
      flowIdTimestamp: ''
    }
  },
  computed: {
    showFlow() {
      return this.curStageObj.noneProp || (this.propList.length > 0 && this.propList.filter(n => this.hiddenProps.indexOf(n.name) < 0).findIndex(n => !this.form[n.name]) < 0)
    },
    curStageObj() {
      return this.stages.length > 0 ? this.stages[this.curStage] : {}
    },
    periodId() {
      return this.curStageObj.periodId
    },
    propList() {
      return this.curStageObj.propList || []
    },
    flowId() {
      return `flow_${this.periodId}_${this.flowIdTimestamp}`
    },
    flowData() {
      return this.curStageObj.flowData || {}
    },
    hiddenProps() {
      let props = []
      if (this.periodId == 10002 || this.periodId == 10008) {
        if (this.form.land_type === 'jiti') {
          props.push('build_land')
        }
      }
      if (this.periodId == 10005) {
        if (this.form.paiW === 'no') {
          props.push('y_paiW')
        }
      }
      if (this.periodId == 10006) {
        if (this.form.xianZh_land === 'yes') {
          props.push('dixiao_land')
        }
      }
      return props
    },
    isIndustry() {
      return this.projectTypeCode === 'industry_project'
    }
  },
  watch: {
    curStage() {
      this.getPropList()
    },
    stageList(val) {
      this.propInitMap = {}
      this.form = {}
      this.curStage = 0
      this.stages = val
      this.getPropList()
    },
    form: {
      handler() {
        if (this.showFlow) {
          this.getNodeFlowList()
        } else if (this.stages.length > 0) {
          this.stages[this.curStage].queryParams = ''
          this.stages[this.curStage].flowData = {}
        }
      },
      deep: true
    }
  },
  created() {
    this.projectId = this.$route.params.id
    this.isEdit = this.projectId && this.projectId !== '0'
    this.stages = this.stageList
    this.flowInitMap = {}
    this.propInitMap = {}
    this.handleFormParam = {
      projectId: this.projectId
    }
    this.getPropList()
  },
  methods: {
    handleShift() {
      if (!this.isEdit) {
        this.$confirm(
          '请先将项目存为草稿后，再发起调度转办提醒！',
          '提示',
          {
            confirmButtonText: '存为草稿',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(() => {
            this.handleSave(true)
          })
          .catch(() => {

          })
        return
      }
      this.showHandleForm = !this.showHandleForm
    },
    onHandleFormSuccess() {

    },
    handleFullscreen() {
      this.$emit('fullscreen', !this.fullscreen)
    },
    handleEditNode(obj) {
      this.curNode = obj
      this.showNodeForm = !this.showNodeForm
      console.log('handleEditNode', obj)
    },
    handleOpenPolicy(obj, type = 0) {
      window.open(`${location.origin}/policy?labelType=${type}&labelId=${obj[type == 0 ? 'nodeId' : 'name']}&periodId=${this.periodId}`, '_blank')
    },
    getConditionValueList(valueKey) {
      return this.propList.filter(n => this.hiddenProps.indexOf(n.name) < 0).map(n => {
        let obj = {
          conditionCode: n.name.split('__')[0],
          runFlag: n.runFlag || 0
        }
        obj[valueKey] = this.form[n.name]
        return obj
      })
    },
    getFlowQueryParams() {
      return {
        conditionReqList: this.getConditionValueList('conditionItemCode'),
        periodId: this.periodId
      }
    },
    formatNodeFlowData(result, nodeIdProp) {
      const lineData = []
      result.forEach(n => {
        if (!(n.nextNodeId || '').includes(',') && n.nextNodeId !== '0') {
          if (result.findIndex(r => r[nodeIdProp] == parseInt(n.nextNodeId)) > -1) {
            lineData.push({
              begin: n[nodeIdProp],
              end: n.nextNodeId,
            })
          }
        } else if ((n.nextNodeId || '').includes(',')) {
          n.nextNodeId.split(',').forEach(c => {
            if (c !== '0' && result.findIndex(r => r[nodeIdProp] == parseInt(c)) > -1) {
              lineData.push({
                begin: n[nodeIdProp],
                end: c,
              })
            }
          })
        }
      })
      return {
        nodeData: result.map(n => ({
          ...n,
          name: n.stepName,
          nodeId: n[nodeIdProp],
          status: n.statusCode,
          startDept: n.startDept ? n.startDept.split(',') : [],
          acceptDept: n.acceptDept ? n.acceptDept.split(',') : [],
          coordinateDept: n.coordinateDept ? n.coordinateDept.split(',') : [],
          stepContact: n.stepContact ? parseInt(n.stepContact) : ''
        })),
        lineData
      }
    },
    getNodeFlowList() {
      // 如果是初始化编辑
      const { stepacts } = this.stages[this.curStage]
      if ((this.isEdit || this.autoFill) && !this.flowInitMap[this.periodId] && stepacts && stepacts.length > 0) {
        this.getFlowListByProjectId()
        this.flowInitMap[this.periodId] = true
        return
      }
      const params = this.getFlowQueryParams()
      if (this.stages[this.curStage].queryParams === JSON.stringify(params)) return
      stepBaseFlow_stepFlow(params).then(({ result }) => {
        this.flowIdTimestamp = new Date().getTime()
        let realRes = result
        if (this.isEdit) {
          realRes = result.map(n => {
            let oldNode = this.stages[this.curStage].stepacts.find(s => s.stepId == n.nodeId) || {}
            return {
              ...n,
              ...oldNode,
              nextNodeId: n.nextNodeId
            }
          })
        }
        this.stages[this.curStage].flowData = this.formatNodeFlowData(realRes, 'nodeId')
        this.stages[this.curStage].conditions = this.getConditionValueList('conditionValue')
        this.stages[this.curStage].queryParams = JSON.stringify(params)
      }).catch((e) => {
        console.log(e)
        this.stages[this.curStage].flowData = {}
        this.stages[this.curStage].conditions = this.getConditionValueList('conditionValue')
      })
    },
    getFlowListByProjectId() {
      this.$nextTick(() => {
        this.stages[this.curStage].flowData = this.formatNodeFlowData(this.stages[this.curStage].stepacts, 'stepId')
        this.stages[this.curStage].conditions = this.getConditionValueList('conditionValue')
      })
    },
    getPropExisted(name) {
      if (name === 'land_supply_type') return false
      const sindex = this.stages.findIndex(n => n.propList && n.propList.findIndex(p => p.name === name) > -1)
      return sindex > -1 && sindex < this.curStage
    },
    getPropOptions(obj, filterPType) {
      if (obj.conditionCode === 'project_type') {
        return obj.itemCodeList.filter(c => c.conditionItemCode != filterPType)
      }
      if (obj.conditionCode === 'land_supply_type' && !this.isIndustry) {
        return obj.itemCodeList.filter(c => c.conditionItemCode != 'land_transfer')
      }
      return obj.itemCodeList
    },
    formatPropList(list, useOldValue) {
      if (list.length < 1) {
        this.stages[this.curStage].noneProp = true
        this.form.triggerValue = new Date().getTime()
        return
      } else {
        this.stages[this.curStage].noneProp = false
      }
      const filterPType = this.isIndustry ? 'approval' : 'record'
      let labelWidth = list.length < 5 ? '' : `${Math.max(...(list.map(n => (n.conditionName.length + 1) * 14 + 15)))}px`
      let propList = list.map(n => ({
        name: n.conditionCode === 'land_supply_type' ? `${n.conditionCode}__${this.periodId}` : n.conditionCode,
        label: n.conditionName,
        labelWidth,
        options: this.getPropOptions(n, filterPType),
        disabled: n.runFlag === 1 || this.getPropExisted(n.conditionCode),
        value: n.selectConditionItemCode,
        associatedKnowledge: n.associatedKnowledge
      }))
      propList.forEach(n => {
        this.rules[n.name] = [{ required: true, message: '请选择', trigger: 'change' }]
        if (useOldValue) {
          this.form[n.name] = n.value
        } else {
          if (this.periodId == '10006') {
            this.form[n.name] = 'no'
          } else if (this.defaultForm[n.name.split('__')[0]]) {
            this.form[n.name] = this.defaultForm[n.name.split('__')[0]]
          } else if (!this.form[n.name]) {
            this.form[n.name] = n.options[0].conditionItemCode
          }
        }
      })
      return propList
    },
    getPropList() {
      if (this.stages.length < 1) return
      const { conditionList } = this.stages[this.curStage]
      if ((this.isEdit || this.autoFill) && conditionList && conditionList.length > 0) {
        if (!this.propInitMap[this.periodId]) {
          this.getPropListByProjectId()
          this.propInitMap[this.periodId] = true
        }
        return
      }
      if (this.propInitMap[this.periodId]) return
      this.loading = true
      periodCondition_queryByPeriodId({
        periodId: this.periodId
      }).then(({ result }) => {
        this.stages[this.curStage].propList = this.formatPropList(result, false)
        this.propInitMap[this.periodId] = true
        this.loading = false
      }).catch((e) => {
        console.log('getPropList error', e)
        this.loading = false
      })
    },
    getPropListByProjectId() {
      this.stages[this.curStage].propList = this.formatPropList(this.stages[this.curStage].conditionList, true)
    },
    getStagesValue() {
      // console.log('getStagesValue', this.stages)
      return this.stages.map(n => ({
        periodBase: {
          "nextPeriodId": n.nextPeriodId,
          "periodId": n.periodId,
          "projectId": this.projectId,
          id: n.id || 0
        },
        conditions: n.conditions,
        stepacts: n.flowData.nodeData.map(n => ({
          ...n,
          projectId: this.projectId,
          stepId: n.nodeId,
          startDept: n.startDept.join(','),
          acceptDept: n.acceptDept.join(','),
          coordinateDept: n.coordinateDept.join(','),
        }))
      }))
    },
    handleResetForm() {
      this.propList.forEach(n => {
        if (!n.disabled) {
          this.form[n.name] = ''
        }
      })
    },
    handleConfirmForm() { },
    handleCancel() {
      this.$router.go(-1)
    },
    handleLast() {
      this.curStage--
    },
    handleNext() {
      this.curStage++
    },
    validForm(action) {
      this.$emit('validate', action)
    },
    handleSave(isValidForm) {
      if (isValidForm) {
        return this.validForm('handleSave')
      }
      this.$emit('save', this.getStagesValue())
    },
    handleConfirm(isValidForm) {
      if (isValidForm) {
        return this.validForm('handleConfirm')
      }
      let invalid = this.stages.find(n => n.flowData.nodeData.length < 1)
      if (invalid) {
        return this.$message.warning(`请完成${invalid.periodName}阶段的条件筛选`)
      }
      this.$emit('confirm', this.getStagesValue())
    },
    resetFlow() {
      this.$refs.ProjectNodeFlow.reset()
    }
  }
};
</script>

<style lang="scss">
.ProjectStage {
  height: 100%;
  background: #F6F6F6;

  .el-header,
  .el-footer {
    background: #FFF;
    box-shadow: 0px 0px 16px rgba(20, 38, 82, 0.07);
  }

  &__main {
    display: flex;
    flex-direction: column;
    padding: 0;
  }

  .condition-wrap {
    border-bottom: 1px solid #EBE9F1;
    background: #FAFAFA;

    .el-form--inline .el-form-item {
      margin-bottom: 16px;
      margin-right: 10px !important;
    }
  }

  .node-set-title {
    background: #FAFAFA;
  }

  .ee-flowchart__tool {
    top: -42px;
  }

  .stage {
    &-item {
      min-width: 100px;
      max-width: 600px;
      height: 84px;
      border-radius: 8px;
      background: #F3F7FB;

      &__index {
        top: 12px;
        left: 0;
        padding: 0 9px;
        height: 15px;
        background: #0EB0ED;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        line-height: 15px;
        color: #fff;
      }

      &__name {
        color: #467190;
      }

      &__icon-bg {
        width: 50px;
        height: 50px;
        border-radius: 100%;
        background: #E7F3FA;
      }

      &__arrow {
        bottom: -15px;
        left: 50%;
        transform: translateX(-50%);
      }

      &.is-active {
        background: linear-gradient(to bottom, #3478A9, #86B3D3);

        .stage-item {

          &__name {
            color: #fff;
          }

          &__icon-bg {
            background: rgba(255, 255, 255, 0.10);
          }
        }
      }
    }
  }
}
</style>

