<template>
  <el-container class="CheckList full-vh">
    <el-header class="ee-header FlowDetail__header is-shadow d-flex ai-center pl-l" height="58px">
      <el-button class="is-single" size="small" @click="$router.go(-1)">
        <el-icon><arrow-left-bold /></el-icon>
      </el-button>
      <div class="d-flex ai-center f14 f-l3 ml12">
        <svg-icon icon-class="home-bread" width="24px" height="24px" />当前位置：
      </div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/check' }">绩效管理</el-breadcrumb-item>
        <el-breadcrumb-item>绩效统计表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-main class="pl-l pr-l flex-y" style="padding-top: 0;">
      <ee-title class="mt16" title="绩效统计表">
        <el-button type="primary">
          <svg-icon class="el-icon--left" icon-class="export" width="16px" height="16px" />
          导出报表
        </el-button>
      </ee-title>
      <div class="ee-card ee-card--shadow ee-card--pd mt16 pdt20 flex-1 flex-y" style="min-height: 0;">
        <el-form class="d-flex ai-center jc-between" inline :model="form">
          <div class="d-flex ai-center">
            <el-form-item label="项目类型:">
              <el-select v-model="form.projectType" placeholder="全部" clearable multiple collapse-tags>
                <el-option v-for="item in project_type" :key="item.itemCode" :label="item.itemName"
                  :value="item.itemCode" />
              </el-select>
            </el-form-item>
            <el-form-item label="项目开始时间:">
              <el-date-picker v-model="form.startDate" type="daterange" unlink-panels range-separator="~"
                start-placeholder="开始日期" end-placeholder="结束日期" :shortcuts="getDateShotcuts()" clearable />
            </el-form-item>
            <el-form-item>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
            </el-form-item>
          </div>
          <div class="d-flex ai-center jc-end">
            <el-icon color="#E85050">
              <WarningFilled />
            </el-icon>
            <span class="ml4 f12">超过法定时限</span>
            <el-icon class="ml20" color="#68CD44">
              <SuccessFilled />
            </el-icon>
            <span class="ml4 f12">低于法定时限</span>
          </div>
        </el-form>
        <el-table ref="elTable" class="flex-1 full-w" :class="{ 'is-empty': tableData.length < 1 }" :data="tableData"
          border :span-method="arraySpanMethod">
          <el-table-column prop="categoryName" label="项目类型" min-width="80" show-overflow-tooltip />
          <el-table-column prop="stageName" label="项目阶段" min-width="80" show-overflow-tooltip />
          <el-table-column prop="stepName" label="环节" min-width="150" show-overflow-tooltip />
          <el-table-column prop="stepTypeName" label="环节属性" min-width="80" show-overflow-tooltip />
          <el-table-column prop="stepDurationFd" label="法定时限" min-width="100" show-overflow-tooltip>
            <template v-slot="sc">
              {{ sc.row.stepDurationFd }}（{{ sc.row.durationTypeName }}）
            </template>
          </el-table-column>
          <el-table-column prop="stepDuration" label="承诺时限" min-width="100" show-overflow-tooltip>
            <template v-slot="sc">
              {{ sc.row.stepDuration }}（{{ sc.row.durationTypeName }}）
            </template>
          </el-table-column>
          <el-table-column prop="averageTime" label="环节平均时长" min-width="130" show-overflow-tooltip>
            <template v-slot="sc">
              <div class="d-flex ai-center" :class="sc.row.averageTime > sc.row.stepDuration ? 'f-danger' : 'f-success'">
                <div style="min-width:20px;">{{ sc.row.averageTime }}</div>
                <span class="mr4">（{{ sc.row.durationTypeName }}）</span>
                <el-icon v-if="sc.row.averageTime > sc.row.stepDuration" color="#E85050">
                  <WarningFilled />
                </el-icon>
                <el-icon v-else color="#68CD44">
                  <SuccessFilled />
                </el-icon>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="leagalTime" label="环节最长时间" min-width="110" show-overflow-tooltip>
            <template v-slot="sc">
              {{ sc.row.stepDuration }}（{{ sc.row.durationTypeName }}）
            </template>
          </el-table-column>
          <el-table-column prop="leagalTime" label="环节最低时间" min-width="110" show-overflow-tooltip>
            <template v-slot="sc">
              1（{{ sc.row.durationTypeName }}）
            </template>
          </el-table-column>
          <el-table-column prop="delayTime" label="办理次数" min-width="80" show-overflow-tooltip>
            <template v-slot="sc">
              10
            </template>
          </el-table-column>
          <el-table-column prop="delayTime" label="环节延期次数" min-width="110" show-overflow-tooltip>
            <template v-slot="sc">
              1
            </template>
          </el-table-column>
          <el-table-column prop="leagalTime" label="环节总延期时长" width="150" show-overflow-tooltip>
            <template v-slot="sc">
              1
            </template>
          </el-table-column>
          <template #empty>
            <el-empty description="暂无搜索结果">
              <template #image>
                <svg-icon icon-class="empty" width="174px" height="160px" />
              </template>
            </el-empty>
          </template>
        </el-table>
        <!-- <el-pagination v-show="total > 10" v-model:current-page="pageNum" v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]" background layout="total, sizes, prev, pager, next, jumper" :total="total"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" /> -->
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { getDateShotcuts } from '@/utils/index.js'
import useDictStore from '@/store/modules/dict'
import { stepBaseinfo_getByPeriodId } from '@/api/pm/stepBaseinfo.js'

export default {
  name: 'CheckList',
  components: {},
  data() {
    return {
      ...useDictStore().getDicts(['project_type', 'step_type', 'duration_type']),
      form: {},
      tableData: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      rowspanList: []
    }
  },
  created() {
    this.handleSearch()
  },
  methods: {
    getDateShotcuts,
    arraySpanMethod({
      row,
      column,
      rowIndex,
      columnIndex,
    }) {
      if (columnIndex === 0) {
        return rowIndex === 0 ? [this.total, 1] : [0, 1]
      } else if (columnIndex === 1) {
        let rowspanObj = this.rowspanList.find(n => n[0] === rowIndex)
        if (rowspanObj) return [rowspanObj[1], 1]
        return [0, 1]
      }
    },
    handleExport(val) {

    },
    getDataList(periodId = 10001) {
      if (periodId > 10006) return
      stepBaseinfo_getByPeriodId({
        periodId
      }).then(({ result }) => {
        let rlist = result.map((n, i) => {
          return {
            ...n,
            stepTypeName: this.getDictName(this.step_type, n.stepTypeCode),
            durationTypeName: this.getDictName(this.duration_type, n.durationTypeCode),
            averageTime: 5,
            categoryName: '产业类',
            stageName: ['项目准入', '土地储备', '土地供应', '前期审批', '项目建设', '绩效监管'][periodId - 10001],
          }
        })
        if (periodId === 10001) {
          this.rowspanList = [[0, rlist.length]]
          this.tableData = rlist
        } else {
          this.rowspanList.push([this.tableData.length, rlist.length])
          this.tableData = this.tableData.concat(rlist)
        }
        this.total = this.tableData.length
        this.getDataList(periodId + 1)
      })
    },
    handleSearch() {
      this.pageNum = 1
      this.getDataList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.handleSearch()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getDataList()
    },
    selectionChange(val) {
      this.selectionValue = val
    },
    handleReset() { },
    rowClassName({ row }) {
      return row.status == 0 ? 'is-visited' : ''
    }
  }
};
</script>
