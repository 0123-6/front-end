<template>
  <el-dialog class="ProjectExport" v-model="dialogVisible" title="自定义导出" width="1000px" :draggable="true"
    :close-on-click-modal="false" align-center>
    <div class="d-flex ai-center jc-between">
      <span class="f14">请勾选要导出的字段<span class="f-l3">（长按拖动调整顺序）</span></span>
      <el-checkbox class="ml12" v-model="checkAll" :label="true" @change="changeCheckAll">全选</el-checkbox>
    </div>
    <el-checkbox-group v-model="checkedProps">
      <VueDraggable ref="el" v-model="allPropList" :animation="150" class="d-flex flex-wrap">
        <div v-for="n in allPropList" :key="n.name" :span="6" class="mt12 mr12">
          <el-checkbox-button :label="n" :disabled="n.disabled">{{ n.label }}</el-checkbox-button>
        </div>
      </VueDraggable>
    </el-checkbox-group>
    <div class="mt16">
      <span class="f14">自定义列表预览</span>
    </div>
    <div style="height: 100px;">
      <el-table v-if="showTable" class="mt12" empty-text="列表数据" style="width: 100%;">
        <el-table-column v-for="n in finalProps" :key="n.name" :label="n.label" :min-width="n.width || '80'" />
      </el-table>
    </div>
    <div class="d-flex ai-center jc-end mt20">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSave">导出</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { VueDraggable } from 'vue-draggable-plus'
const baseProps = [
  { name: 'projectCode', label: '项目代码', disabled: true },
  { name: 'projectName', label: '项目名称', disabled: true },
  { name: 'projectOrg', label: '项目单位', disabled: true },
]
export default {
  name: 'ProjectExport',
  components: {
    VueDraggable
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    },
  },
  data() {
    return {
      dialogVisible: false,
      checkAll: false,
      checkedProps: [].concat(baseProps),
      allPropList: baseProps.concat([
        { name: 'projectType', label: '工程性质' },
        { name: 'projectStatus', label: '项目状态' },
        { name: 'landSupplyType', label: '供地方式' },
        { name: 'projectAmount', label: '项目金额' },
        { name: 'startTime', label: '开始时间' },
        { name: 'estBuildStartDate', label: '预计开工日期', width: '110' },
        { name: 'buildStartDate', label: '实际开工日期', width: '110' },
        { name: 'estBuildEndDate', label: '预计竣工日期', width: '110' },
        { name: 'currentPeriod', label: '当前阶段' },
        { name: 'nextPeriod', label: '下一阶段' },
        { name: 'currentStep', label: '当前环节' },
        { name: 'currentStepStatus', label: '环节状态' },
        { name: 'previousStep', label: '上一环节' },
        { name: 'nextStep', label: '下一环节' },
        { name: 'untilNextStepDayTime', label: '距下个环节开始时间(天)', width: '180' },
        { name: 'untilNextPeriodDayTime', label: '距下个阶段开始时间(天)', width: '180' },
        { name: 'latestRemark', label: '最新备注' },
      ]),
      finalProps: [].concat(baseProps),
      showTable: true
    }
  },
  computed: {

  },
  watch: {
    show() {
      this.dialogVisible = true
    },
    checkedProps(val) {
      // console.log('checkedProps', val)
      this.getSortedProps()
    },
    allPropList(val) {
      // console.log('allPropList', val)
      this.getSortedProps()
    }
  },
  created() {
    this.dialogVisible = this.show
  },
  methods: {
    getSortedProps() {
      let list = [].concat(baseProps)
      this.allPropList.forEach(n => {
        if (baseProps.findIndex(c => c.name === n.name) < 0 && this.checkedProps.findIndex(c => c.name === n.name) > -1) {
          list.push(n)
        }
      })
      this.finalProps = list
      // console.log('finalProps', list)
      this.showTable = false
      this.$nextTick(() => {
        this.showTable = true
      })
    },
    changeCheckAll(val) {
      this.checkedProps = val ? [].concat(this.allPropList) : baseProps
    },
    handleSave() {
      console.log('ProjectExport', this.checkedProps)
      this.$emit('confirm', this.checkedProps)
    },
  }
};
</script>

<style lang="scss">
.ProjectExport {
  .el-dialog__body {
    padding-top: 16px;
  }
}
</style>

