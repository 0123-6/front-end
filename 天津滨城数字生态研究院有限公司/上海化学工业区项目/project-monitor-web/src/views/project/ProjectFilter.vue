<template>
  <el-drawer class="ProjectFilter" v-model="visible" title="高级筛选" :size="968" :close-on-click-modal="false">
    <div class="flex-y-center full-h">
      <ee-conditions class="full-w" :data="conditions" label="已选" background :showReset="false"
        @close="handleCloseCondition" />
      <el-form class="y-auto flex-1" :model="form" label-width="140px" style="padding: 24px 24px 0;">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="项目阶段/环节:">
              <el-cascader ref="cascader" v-model="form.periodStepReps" :props="cascaderProps" :options="stageTree"
                placeholder="请选择" clearable collapse-tags style="width: 100%;">
              </el-cascader>
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="项目投资金额(万元):">
              <div class="d-flex ai-center flex-1">
                <el-input class="flex-1" v-model="form.minInvestAmount" type="number" placeholder="最低金额" min="0">
                </el-input>
                <span class="ml8 mr8">~</span>
                <el-input class="flex-1" v-model="form.maxInvestAmount" type="number" placeholder="最高金额" min="0"
                  max="99999999999999999999">
                </el-input>
              </div>
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="项目处理进度:">
              <el-select v-model="form.projectHandleCode" placeholder="请选择" clearable style="width: 100%;">
                <el-option v-for="item in project_handle_schedule_distribution" :key="item.itemCode"
                  :label="item.itemName" :value="item.itemCode" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="阶段预计开始时间:">
              <el-date-picker v-model="form.stageBeginDate" type="daterange" :disabled="!hasSingleStage" unlink-panels
                range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" :shortcuts="getDateShotcuts()"
                clearable value-format="YYYY-MM-DD" format="YYYY-MM-DD" />
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="阶段预计结束时间:">
              <el-date-picker v-model="form.stageEndDate" type="daterange" :disabled="!hasSingleStage" unlink-panels
                range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" :shortcuts="getDateShotcuts()"
                clearable value-format="YYYY-MM-DD" format="YYYY-MM-DD" />
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="环节预计开始时间:">
              <el-date-picker v-model="form.nodeBeginDate" type="daterange" :disabled="!hasSingleNode" unlink-panels
                range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" :shortcuts="getDateShotcuts()"
                clearable value-format="YYYY-MM-DD" format="YYYY-MM-DD" />
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="环节预计结束时间:">
              <el-date-picker v-model="form.nodeEndDate" type="daterange" :disabled="!hasSingleNode" unlink-panels
                range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" :shortcuts="getDateShotcuts()"
                clearable value-format="YYYY-MM-DD" format="YYYY-MM-DD" />
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="预计开工时间:">
              <el-date-picker v-model="form.beginDate" type="daterange" unlink-panels range-separator="~"
                start-placeholder="开始日期" end-placeholder="结束日期" :shortcuts="getDateShotcuts()" clearable
                value-format="YYYY-MM-DD" format="YYYY-MM-DD">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预计竣工时间:">
              <el-date-picker v-model="form.endDate" type="daterange" unlink-panels range-separator="~"
                start-placeholder="开始日期" end-placeholder="结束日期" :shortcuts="getDateShotcuts()" clearable
                value-format="YYYY-MM-DD" format="YYYY-MM-DD">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目开始时间:">
              <el-date-picker v-model="form.startDate" type="daterange" unlink-panels range-separator="~"
                start-placeholder="开始日期" end-placeholder="结束日期" :shortcuts="getDateShotcuts()" clearable
                value-format="YYYY-MM-DD" format="YYYY-MM-DD">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目创建时间:">
              <el-date-picker v-model="form.createTime" type="daterange" unlink-panels range-separator="~"
                start-placeholder="开始日期" end-placeholder="结束日期" :shortcuts="getDateShotcuts()" clearable
                value-format="YYYY-MM-DD" format="YYYY-MM-DD">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="mt8 f14 f500">条件筛选</div>
        <el-row class="mt24" :gutter="0">
          <el-col v-for="n in extraProps" :key="n.label" :span="8">
            <el-form-item :label="n.label + ':'" label-width="130px">
              <el-select v-model="form[n.prop]" placeholder="请选择" clearable :multiple="n.multiple" collapse-tags
                style="width: 100%;">
                <el-option v-for="item in n.options" :key="item.conditionItemCode" :label="item.conditionItemName"
                  :value="item.conditionItemCode" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="d-flex ai-center jc-end full-w mt12 ">
        <el-button @click="handleReset">重置</el-button>
        <el-button class="mr24" type="primary" @click="handleSearch">搜索</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { isArray } from '@/utils/validate.js'
import { getDateShotcuts } from '@/utils/index.js'
import { conditionItem_getAll } from '@/api/pm/conditionItem.js'
import { stepBaseinfo_getAll } from '@/api/pm/stepBaseinfo.js'
import EeConditions from '@/components/EeConditions.vue'
import EeChecker from '@/components/EeChecker.vue'
import useDictStore from '@/store/modules/dict'

const dateProps = {
  stageBeginDate: ['阶段预计开始时间', 'periodEstStart'],
  stageEndDate: ['阶段预计结束时间', 'periodEstEnd'],
  nodeBeginDate: ['环节预计开始时间', 'stepEstStart'],
  nodeEndDate: ['环节预计结束时间', 'stepEstEnd'],
  beginDate: ['预计开工时间', 'projectEstStart'],
  endDate: ['预计竣工时间', 'projectEstEnd'],
  startDate: ['项目开始时间', 'projectStart'],
  createTime: ['项目创建时间', 'createTime'],
}

export default {
  name: 'ProjectFilter',
  components: { EeConditions, EeChecker },
  props: {
    show: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      ...useDictStore().getDicts(['project_handle_schedule_distribution']),
      visible: false,
      cascaderProps: {
        multiple: true,
        value: 'id',
        label: 'name',
        emitPath: true,
        checkStrictly: false
      },
      form: {
        periodStepReps: []
      },
      extraProps: [],
      stageTree: [],
      flatStageNodes: []
    }
  },
  computed: {
    conditions() {
      const list = []
      const { periodStepReps, minInvestAmount, maxInvestAmount, projectHandleCode } = this.form
      // console.log('periodStepReps', periodStepReps)
      if (periodStepReps && periodStepReps.length > 0) {
        const stages = Array.from(new Set(periodStepReps.map(n => n[0])))
        const texts = []
        const periodStepList = []
        stages.forEach(n => {
          let stext = this.flatStageNodes.find(s => s.id == n).name
          let nodes = periodStepReps.filter(s => s[0] == n).map(s => s[1]).filter(s => s)
          if (nodes.length > 0) {
            stext += `：${nodes.map(c => this.flatStageNodes.find(s => s.id == c).name).join('、')}`
          }
          texts.push(stext)
          periodStepList.push({
            periodId: n,
            stepIds: nodes
          })
        })
        list.push({
          label: '项目阶段/环节',
          value: [],
          prop: 'periodStepReps',
          text: texts.join('；'),
        })
        this.periodStepReps = periodStepList
      }
      if (minInvestAmount || maxInvestAmount) {
        let text = `${minInvestAmount} ~ ${maxInvestAmount}`
        if ((typeof minInvestAmount === 'undefined' || minInvestAmount === '') && maxInvestAmount) {
          text = `<= ${maxInvestAmount}`
        }
        if ((typeof maxInvestAmount === 'undefined' || maxInvestAmount === '') && minInvestAmount) {
          text = `>= ${minInvestAmount}`
        }
        list.push({
          label: '项目投资金额(万元)',
          value: '',
          prop: 'minInvestAmount,maxInvestAmount',
          text
        })
      }
      if (projectHandleCode) {
        list.push({
          label: '项目处理进度',
          value: '',
          prop: 'projectHandleCode',
          text: this.getDictName(this.project_handle_schedule_distribution, projectHandleCode)
        })
      }
      Object.keys(dateProps).forEach(n => {
        if (this.form[n] && this.form[n].length > 0) {
          list.push({
            label: dateProps[n][0],
            value: '',
            prop: `${dateProps[n][1]}BeginTime,${dateProps[n][1]}EndTime`,
            text: this.form[n].join(' ~ ')
          })
        }
      })
      this.extraProps.forEach(n => {
        if (this.form[n.prop]) {
          list.push({
            label: n.label,
            value: this.form[n.prop],
            prop: n.prop,
            text: n.options.find(o => o.conditionItemCode == this.form[n.prop]).conditionItemName
          })
        }
      })
      return list
    },
    hasSingleStage() {
      // console.log('periodStepReps', this.form.periodStepReps)
      return this.form.periodStepReps.filter(n => n.length === 1).length === 1
    },
    hasSingleNode() {
      return this.form.periodStepReps.filter(n => n.length === 2).length === 1
    },
  },
  watch: {
    show() {
      this.visible = true
    }
  },
  created() {
    this.periodStepReps = []
    this.getConditions()
    this.getStageTree()
  },
  methods: {
    getDateShotcuts,
    getFlatStageAndNodes(tree) {
      let list = tree
      tree.forEach((n) => {
        list = list.concat(n.children)
      })
      this.flatStageNodes = list
    },
    getStageTree() {
      stepBaseinfo_getAll().then(({ result }) => {
        this.stageTree = result
        this.getFlatStageAndNodes(result)
      })
    },
    getConditions() {
      conditionItem_getAll().then(({ result }) => {
        this.extraProps = result.map(n => ({
          label: n.conditionName,
          labelWidth: '',
          prop: n.conditionCode,
          options: n.itemCodeList,
          multiple: false
        }))
        this.$emit('got-props', this.extraProps)
      })
    },
    handleCloseCondition(props) {
      this.resetProps(props.split(','))
    },
    handleSearch() {
      const { minInvestAmount, maxInvestAmount, projectHandleCode } = this.form
      const projectConditionReqs = []
      const params = {
        periodStepReps: this.periodStepReps,
        minInvestAmount,
        maxInvestAmount,
        projectConditionReqs,
        projectHandleCode
      }
      Object.keys(dateProps).forEach(n => {
        if (this.form[n] && this.form[n].length > 0) {
          // params[`${dateProps[n][1]}BeginTime`] = this.form[n][0] + ' 00:00:00'
          // params[`${dateProps[n][1]}EndTime`] = this.form[n][1] + ' 23:59:59'
          params[`${dateProps[n][1]}BeginTime`] = this.form[n][0]
          params[`${dateProps[n][1]}EndTime`] = this.form[n][1]
        }
      })
      this.extraProps.forEach(n => {
        if (this.form[n.prop]) {
          projectConditionReqs.push({
            conditionCode: n.prop,
            conditionValue: this.form[n.prop]
          })
        }
      })
      this.$emit('confirm', {
        params,
        conditions: JSON.parse(JSON.stringify(this.conditions))
      })
      this.visible = false
    },
    handleReset() {
      this.resetProps(Object.keys(this.form))
    },
    resetProps(list) {
      list.forEach(n => {
        if (isArray(this.form[n])) {
          this.form[n] = []
        } else {
          this.form[n] = ''
        }
      })
    }
  }
};
</script>

<style lang="scss">
.ProjectFilter {
  .el-drawer__header {
    border-bottom: none !important;
  }

}
</style>

