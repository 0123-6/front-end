<template>
  <el-drawer v-model="visible" size="1100px" :close-on-click-modal="false">
    <template #header="{ close, titleId, titleClass }">
      <div class="d-flex ai-center jc-between flex-1">
        <div class="f500">环节时间表</div>
      </div>
    </template>
    <div class="pdl20 pdr20 pdt20">
      <el-table ref="elTable" class="flex-1 full-w" :data="tableData" :span-method="arraySpanMethod"
        height="calc(100vh - 158px)" border>
        <el-table-column prop="periodName" label="阶段名称" width="85" show-overflow-tooltip />
        <el-table-column prop="stepId" label="环节编号" width="85" show-overflow-tooltip />
        <el-table-column prop="stepName" label="环节名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="stepDurationFd" label="法定时限" width="85" show-overflow-tooltip />
        <el-table-column prop="stepDuration" label="承诺时限" width="85" show-overflow-tooltip />
        <el-table-column prop="durationTypeName" label="时长类型" width="85" show-overflow-tooltip />
        <el-table-column prop="statusCode" label="状态" width="90" show-overflow-tooltip>
          <template v-slot="sc">
            {{ getDictName(this.step_status, sc.row.statusCode) }}
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="实际开始时间" width="150" show-overflow-tooltip>
          <template v-slot="sc">

          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="实际结束时间" width="150" show-overflow-tooltip>
          <template v-slot="sc">
            <!-- <el-date-picker v-if="editRowId == sc.row.stepId" :ref="`endPicker${sc.row.stepId}`" v-model="sc.row.endTime" type="date" placeholder="请选择"
              format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width:100%"></el-date-picker> -->
            <el-input v-if="editInputId == `endInput${sc.row.stepId}`" :ref="`endInput${sc.row.stepId}`"
              v-model="sc.row.endTime" type="text" maxlength="10"></el-input>
            <div v-else class="pointer" @click="focusInput(`endInput${sc.row.stepId}`)">{{ sc.row.endTime }}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="text-right mt16">
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import useDictStore from '@/store/modules/dict'
import { ruPeriodAct_getPeriodFLow } from '@/api/pm/ruPeriodAct.js'
import { ruStepAct_getStepFlowDetail } from '@/api/pm/ruStepAct.js'
export default {
  name: 'ProjectNodeTimeGrid',
  props: {
    show: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      ...useDictStore().getDicts(['step_status', 'duration_type']),
      tableData: [],
      rowspanList: [],
      visible: false,
      editInputId: ''
    }
  },
  watch: {
    show() {
      this.visible = true
    }
  },
  created() {
    this.projectId = this.$route.params.id
    this.getStageList()
  },
  methods: {
    focusInput(id) {
      this.editInputId = id
      this.$nextTick(() => {
        this.$refs[id].focus()
      })
    },
    handleConfirm() {

    },
    arraySpanMethod({
      row,
      column,
      rowIndex,
      columnIndex,
    }) {
      if (columnIndex === 0) {
        let rowspanObj = this.rowspanList.find(n => n[0] === rowIndex)
        if (rowspanObj) return [rowspanObj[1], 1]
        return [0, 1]
      }
    },
    getStageList() {
      ruPeriodAct_getPeriodFLow({
        projectId: this.projectId
      }).then(({ result }) => {
        this.stageList = result || []
        this.getNodeList(0)
      }).catch(e => {
        console.log(e)
      })
    },
    getNodeList(periodIndex = 0) {
      ruStepAct_getStepFlowDetail({
        projectId: this.projectId,
        periodId: this.stageList[periodIndex].periodId
      }).then(({ result }) => {
        let rlist = result.map((n, i) => {
          return {
            ...n,
            durationTypeName: this.getDictName(this.duration_type, n.durationTypeCode),
            ...this.stageList[periodIndex]
          }
        })
        if (periodIndex === 0) {
          this.rowspanList = [[0, rlist.length]]
          this.tableData = rlist
        } else {
          this.rowspanList.push([this.tableData.length, rlist.length])
          this.tableData = this.tableData.concat(rlist)
        }
        if (periodIndex < this.stageList.length - 1) {
          this.getNodeList(periodIndex + 1)
        }
      }).catch((e) => {
        console.log(e)
        if (periodIndex < this.stageList.length - 1) {
          this.getNodeList(periodIndex + 1)
        }
      })
    },
    handleBack() {
      this.$router.go(-1)
    }
  }
};
</script>

<style lang="scss">
.ProjectNodeTimeList {
  &__main {
    padding: 16px 20px 20px;
  }
}
</style>