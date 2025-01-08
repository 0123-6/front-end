<template>
  <el-container class="ProjectList full-vh">
    <el-header class="ee-header d-flex ai-center jc-between pl-l pr-l" height="67px">
      <ee-title title="项目管理列表" />
      <div class="d-flex ai-center">
        <el-button type="primary" plain @click="$router.push('/project/draft')">
          <svg-icon class="mr4" icon-class="draft" width="16px" height="16px" />草稿箱
        </el-button>
        <el-dropdown @command="handleAdd">
          <el-button class="ml12" type="primary">
            创建项目<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="0">空白项目</el-dropdown-item>
              <el-dropdown-item v-for="n in project_type" :key="n.itemCode" :command="n.itemCode">
                {{ n.itemName }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    <el-main class="pl-l pr-l relative" style="padding-top: 0;">
      <div id="ProjectListCard" class="ee-card ee-card--shadow ee-card--pd full-h flex-y y-auto">
        <div v-loading="loading" element-loading-background="transparent" element-loading-spinner="none">
          <el-radio-group class="ee-radio-group" v-model="projectType" @change="handleSearch">
            <el-radio-button label="0">全部项目({{ countData.all || 0 }})</el-radio-button>
            <el-radio-button v-for="n in project_type" :label="n.itemCode" :key="n.itemName">
              {{ n.itemName }}({{ countData[n.itemCode] || 0 }})
            </el-radio-button>
          </el-radio-group>
          <div class="flex align-middle jc-between mt16">
            <el-form :inline="true" :model="form" label-width="80px">
              <el-form-item>
                <el-input v-model="form.keyword" type="text" placeholder="请输入项目代码、项目名称、项目单位、项目联系人" clearable
                  @keyup.enter="handleSearch" @clear="handleSearch" style="width:360px;"></el-input>
              </el-form-item>
              <el-form-item v-show="projectType === '0'" label="工程性质:">
                <el-select v-model="form.projectTypeCodeList" placeholder="请选择" clearable multiple collapse-tags
                  style="width:180px;" @change="handleSearch">
                  <el-option v-for="item in project_type" :key="item.itemCode" :label="item.itemName"
                    :value="item.itemCode" />
                </el-select>
              </el-form-item>
              <el-form-item label="项目状态:">
                <el-select v-model="form.projectStatusList" placeholder="请选择" clearable multiple collapse-tags
                  style="width:180px;" @change="handleSearch">
                  <el-option v-for="item in project_status" :key="item.itemCode" :label="item.itemName"
                    :value="item.itemCode" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button @click="handleReset()">重置</el-button>
                <el-button type="primary" @click="handleSearch">搜索</el-button>
              </el-form-item>
            </el-form>
            <div class="flex align-middle">
              <el-dropdown @command="handleCommand">
                <el-button class="is-light" type="primary">
                  批量操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="handleEnd" :disabled="disabledEnd">项目终止</el-dropdown-item>
                    <el-dropdown-item command="handleContinue" :disabled="disabledContinue">正常推进</el-dropdown-item>
                    <el-dropdown-item command="handleDel" :disabled="disabledDel">删除</el-dropdown-item>
                    <el-dropdown-item command="handleRemark" :disabled="selectionValue.length < 1">添加备注</el-dropdown-item>
                    <el-dropdown-item command="handleExport">导出当前列表</el-dropdown-item>
                    <el-dropdown-item command="handleCustomExport">自定义导出</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-button class="ml12" type="primary" @click="showFilter = !showFilter">
                <svg-icon icon-class="filter" width="16px" height="16px" />
              </el-button>
            </div>
          </div>
          <ee-conditions v-show="conditions.length > 0" :data="conditions" @close="handleCloseCondition"
            @reset="handleResetCondition()" />
          <ee-checker :class="conditions.length > 0 ? 'mt12' : ''" :value="selectionValue.length"
            @cancel="$refs.elTable.clearSelection()" />
        </div>
        <el-table v-loading="loading" ref="elTable" :class="{ 'is-empty': tableData.length < 1 }"
          class="mt16 full-w flex-1" :data="tableData" :row-class-name="rowClassName" @selection-change="selectionChange">
          <el-table-column type="selection" width="48" align="center" fixed="left" />
          <el-table-column prop="name" label="项目信息" min-width="300" fixed="left" show-overflow-tooltip>
            <template v-slot="sc">
              <div class="d-flex">
                <ee-tag class="mt2" :type="sc.row.projectStatusStyle" shape="arrow" single>{{ sc.row.projectStatusName
                }}</ee-tag>
                <div class="flex-1 ml8 ell">
                  <el-button class="is-silent ell" type="primary" link @click="handleDetail(sc.row)">
                    <span class="f16">{{ sc.row.projectName }}</span>
                  </el-button>
                  <div class="d-flex ai-center ell mt8">
                    <el-tag class="mr8" type="info">工程性质：<span class="el-tag__val">{{ sc.row.projectTypeName
                    }}</span></el-tag>
                    <el-tag v-if="sc.row.projectType === 'industry_project'" type="info">供地方式：<span class="el-tag__val">{{
                      sc.row.landSupplyTypeName }}</span></el-tag>
                    <el-tag v-else type="info">收储：<span class="el-tag__val">{{ sc.row.storageTypeName }}</span></el-tag>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="projectOrg" label="项目单位" min-width="160" show-overflow-tooltip />
          <!-- <el-table-column label="预计开工 / 竣工时间" width="160">
            <template v-slot="sc">
              <span v-if="sc.row.estStartTime || sc.row.estEndTime" class="ddin-n f16">{{ sc.row.estStartTime }} / {{
                sc.row.estEndTime }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="总体进度" min-width="80">
            <template v-slot="sc">
              <div class="ddin f-primary">{{ sc.row.overallProgress }}%</div>
              <el-progress class="mt4" :percentage="Number(sc.row.overallProgress)" :stroke-width="10"
                :show-text="false" />
            </template>
          </el-table-column> -->
          <el-table-column label="当前环节" min-width="180">
            <template v-slot="sc">
              <el-popover v-if="sc.row.currentSteps && sc.row.currentSteps.length > 0" popper-class="ee-popper"
                placement="bottom" :width="400" trigger="hover" effect="dark">
                <template #reference>
                  <div>
                    <div v-for="(n, i) in sc.row.currentSteps.filter((s, si) => si < 2)" class="d-flex ai-center ell"
                      :class="{ 'mt4': i > 0 }">
                      <ee-tag class="f500" :type="nodeStatusStyles[n.status]" shape="round-rect" size="small">
                        {{ getDictName(step_status, n.status) }}
                      </ee-tag>
                      <div class="ell">{{ n.name }}</div>
                    </div>
                    <ee-tag v-if="sc.row.currentSteps && sc.row.currentSteps.length > 2" class="mt4 f500" type="info"
                      shape="round-rect" size="mini">+{{
                        sc.row.currentSteps.length - 2 }}</ee-tag>
                  </div>
                </template>
                <div v-for="(n, i) in sc.row.currentSteps" class="d-flex ai-center " :class="{ 'mt8': i > 0 }">
                  <ee-tag class="f500" :type="nodeStatusStyles[n.status]" shape="round-rect" size="small">
                    {{ getDictName(step_status, n.status) }}
                  </ee-tag>
                  <div class="ml8">{{ n.name }}</div>
                </div>
              </el-popover>
              {{ sc.row.currentSteps && sc.row.currentSteps.length > 0 ? '' : '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="latestRemark" label="最新备注" min-width="100" show-overflow-tooltip>
            <template v-slot="sc">{{ sc.row.latestRemark || '-' }}</template>
          </el-table-column>
          <el-table-column label="操作" width="80" fixed="right">
            <template v-slot="sc">
              <el-tooltip :disabled="sc.row.createBy == info.id" effect="dark" content="您没有编辑权限，仅项目创建人才可编辑"
                placement="top">
                <el-button :disabled="sc.row.createBy != info.id" type="primary" link @click="handleEdit(sc.row)">
                  <svg-icon class="el-icon--left" icon-class="edit" width="16px" height="16px" />编辑
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="ee-empty-data" description="暂无搜索结果">
              <template #image>
                <svg-icon icon-class="empty-data" />
              </template>
            </el-empty>
          </template>
        </el-table>
        <el-pagination v-show="total > 10" v-model:current-page="pageNum" v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]" background layout="total, sizes, prev, pager, next, jumper" :total="total"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-main>
    <project-filter :show="showFilter" @got-props="gotFilterProps" @confirm="handleConfirmFilter" />
    <ProjectExport :show="showExport" @confirm="handleExportData" />
    <ProjectHandleForm :show="showProjectHandle" :mode="handleMode" :params="handleParams" @success="handleSearch" />
  </el-container>
</template>

<script>
import { isArray } from '@/utils/validate.js'
import { projectStatusStyles, nodeStatusStyles } from '@/utils/constant.js'
import { getDateShotcuts } from '@/utils/index.js'
import * as api from '@/api/pm/ruProjectBaseinfo'
import EeConditions from '@/components/EeConditions.vue'
import EeChecker from '@/components/EeChecker.vue'
import ProjectFilter from './ProjectFilter'
import ProjectExport from './ProjectExport'
import ProjectHandleForm from './projectDetail/ProjectHandleForm.vue'
import { mapState } from 'pinia'
import useProjectStore from '@/store/modules/project'
import useDictStore from '@/store/modules/dict'
import useUserStore from '@/store/modules/user'
import { download } from '@/utils/request.js'

const actionConfig = {
  handleContinue: {
    api: 'ruProjectBaseinfo_propel',
    message: '是否确认项目开始正常推进？',
    tip: '项目推进',
    paramProp: 'projectIds'
  },
  handleDel: {
    api: 'ruProjectBaseinfo_deleteBatch',
    message: '是否确定要删除选中的项目？',
    tip: '删除',
    paramProp: 'ids'
  }
}

const baseParamProps = ['keyword', 'projectTypeCodeList', 'projectStatusList']
const dateParamProps = {
  periodEstStart: '阶段预计开始时间',
  periodEstEnd: '阶段预计结束时间',
  stepEstStart: '环节预计开始时间',
  stepEstEnd: '环节预计结束时间',
  projectEstStart: '预计开工时间',
  projectEstEnd: '预计竣工时间',
  projectStart: '项目开始时间',
  createTime: '项目创建时间',
}

export default {
  name: 'ProjectList',
  components: { EeConditions, EeChecker, ProjectFilter, ProjectExport, ProjectHandleForm },
  data() {
    return {
      nodeStatusStyles,
      ...useDictStore().getDicts(['project_status', 'project_type', 'land_supply_type', 'step_status', 'project_handle_schedule_distribution', 'storage_type']),
      loading: false,
      projectType: '0',
      countData: {},
      form: {},
      tableData: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      selectionValue: [],
      showFilter: false,
      conditions: [],
      showExport: false,
      showProjectHandle: false,
      handleMode: 'projectRemark',
      handleParams: {},
    }
  },
  computed: {
    ...mapState(useProjectStore, ['refresh']),
    ...mapState(useUserStore, ['info']),
    disabledEnd() {
      return this.selectionValue.length < 1 || this.selectionValue.findIndex(n => n.projectStatus == 4) > -1
    },
    disabledContinue() {
      return this.selectionValue.length < 1 || this.selectionValue.findIndex(n => n.projectStatus != 4) > -1
    },
    disabledDel() {
      return this.selectionValue.length < 1 || this.selectionValue.findIndex(n => n.projectStatus != 4 || n.createBy != this.info.id) > -1
    }
  },
  watch: {
    refresh() {
      this.getDataList()
    }
  },
  activated() {
    const { params = {} } = history.state
    console.log('ProjectList state params', params)
    if (Object.keys(params).length > 0) {
      const conditions = []
      const filterParams = {}
      this.handleReset(false)
      this.handleResetCondition(false)
      Object.keys(params).forEach(n => {
        if (baseParamProps.indexOf(n) > -1) {
          this.form[n] = params[n]
        }
      })
      const { minInvestAmount, maxInvestAmount, periodStepReps, projectHandleCode } = params
      if (periodStepReps) {
        conditions.push({
          label: '项目阶段/环节',
          value: [],
          prop: 'periodStepReps',
          text: periodStepReps.map(n => `${n.periodName || ''}${n.stepNames && n.periodName ? '：' : ''}${n.stepNames || ''}`).join('；'),
        })
        filterParams.periodStepReps = periodStepReps
      }
      if (minInvestAmount || maxInvestAmount) {
        let text = `${minInvestAmount} ~ ${maxInvestAmount}`
        if ((typeof minInvestAmount === 'undefined' || minInvestAmount === '') && maxInvestAmount) {
          text = `<= ${maxInvestAmount}`
        }
        if ((typeof maxInvestAmount === 'undefined' || maxInvestAmount === '') && minInvestAmount) {
          text = `>= ${minInvestAmount}`
        }
        conditions.push({
          label: '项目投资金额(万元)',
          value: '',
          prop: 'minInvestAmount,maxInvestAmount',
          text
        })
        filterParams.minInvestAmount = minInvestAmount
        filterParams.maxInvestAmount = maxInvestAmount
      }
      if (projectHandleCode) {
        conditions.push({
          label: '项目处理进度',
          value: '',
          prop: 'projectHandleCode',
          text: this.getDictName(this.project_handle_schedule_distribution, projectHandleCode)
        })
        filterParams.projectHandleCode = projectHandleCode
      }
      Object.keys(dateParamProps).forEach(n => {
        if (params[n + 'BeginTime']) {
          conditions.push({
            label: dateParamProps[n],
            value: '',
            prop: `${n}BeginTime,${n}EndTime`,
            text: `${params[`${n}BeginTime`]} ~ ${params[`${n}EndTime`]}`
          })
          filterParams[`${n}BeginTime`] = params[`${n}BeginTime`]
          filterParams[`${n}EndTime`] = params[`${n}EndTime`]
        }
      })
      this.conditions = conditions
      this.filterParams = filterParams
      this.handleSearch()
      history.state.params = {}
    } else if (!this.isActivated) {
      this.handleSearch()
    }
    this.isActivated = true
  },
  methods: {
    getDateShotcuts,
    rowClassName({ row }) {
      return this.selectionValue.findIndex(n => row.projectId === n.projectId) > -1 ? 'is-checked' : ''
    },
    handleConfirmFilter({ params, conditions }) {
      this.filterParams = params
      this.conditions = conditions
      this.handleSearch()
    },
    handleCloseCondition(prop) {
      this.conditions = this.conditions.filter(n => n.prop != prop)
      if (this.filterProps.findIndex(n => n.prop === prop) > -1) {
        this.filterParams.projectConditionReqs = this.filterParams.projectConditionReqs.filter(n => n.conditionCode !== prop)
      } else {
        prop.split(',').forEach(n => {
          if (isArray(this.filterParams[n])) {
            this.filterParams[n] = []
          } else {
            this.filterParams[n] = ''
          }
        })
      }
      this.handleSearch()
    },
    handleResetCondition(isRefresh = true) {
      this.filterParams = {}
      this.conditions = []
      if (isRefresh) this.handleSearch()
    },
    gotFilterProps(val) {
      this.filterProps = val
    },
    handleDetail(val) {
      this.$router.push(`/project/detail/${val.projectId}`)
    },
    handleAdd(val) {
      this.$router.push(`/project/form/0/${val}`)
    },
    handleEdit(val) {
      this.$router.push(`/project/form/${val.projectId}/0`)
    },
    handleAction(config) {
      this.$confirm(
        config.message,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          const param = {}
          param[config.paramProp] = this.selectionValue.map(n => n.projectId).join(',')
          api[config.api](param).then(({ success }) => {
            if (success) {
              this.$message({
                type: 'success',
                message: config.tip + '成功',
              })
              this.handleSearch()
            }
          })

        })
        .catch(() => {

        })
    },
    handleEnd() {
      this.handleMode = 'projectEnd'
      this.handleParams = {
        projectIds: this.selectionValue.map(n => n.projectId).join(',')
      }
      this.showProjectHandle = !this.showProjectHandle
    },
    handleRemark() {
      this.handleMode = 'projectRemark'
      this.handleParams = {
        projectIds: this.selectionValue.map(n => n.projectId).join(',')
      }
      this.showProjectHandle = !this.showProjectHandle
    },
    getExcelName() {
      return `建设工程项目进展情况${this.$dayjs().format('YYYYMMDDHHmmss')}.xlsx`
    },
    handleExport() {
      download('/pm/ruProjectBaseinfo/export', this.getQueryParams(), this.getExcelName())
    },
    handleExportData(list) {
      download('/pm/ruProjectBaseinfo/exportCustom', {
        ...this.getQueryParams(),
        customExportFieldList: list.map((n, i) => ({
          code: n.name,
          name: n.label,
          order: i
        }))
      }, this.getExcelName())
    },
    handleCustomExport() {
      this.showExport = !this.showExport
    },
    handleCommand(val) {
      const config = actionConfig[val]
      if (config) {
        this.handleAction(config)
      } else {
        this[val]()
      }
    },
    getQueryParams() {
      return {
        ...this.form,
        projectTypeCodeList: this.projectType == '0' ? this.form.projectTypeCodeList : [this.projectType],
        ...this.filterParams,
      }
    },
    getDataList() {
      const params = {
        current: this.pageNum,
        size: this.pageSize,
        ...this.getQueryParams()
      }
      // console.log('ProjectList params', params)
      this.loading = true
      api.ruProjectBaseinfo_queryProjectManagePage(params).then(({ result }) => {
        const { dataList = [], dataListTotalNum, allProjectNum, bridgeProjectNum, facilityProjectNum, industryProjectNum, municipalProjectNum } = result
        this.tableData = (dataList || []).map(n => ({
          ...n,
          currentSteps: n.currentSteps || [],
          projectStatusStyle: projectStatusStyles[n.projectStatus],
          projectStatusName: this.getDictName(this.project_status, n.projectStatus),
          landSupplyTypeName: this.getDictName(this.land_supply_type, n.landSupplyTypeCode),
          storageTypeName: this.getDictName(this.storage_type, n.landSupplyTypeCode),
          projectTypeName: this.getDictName(this.project_type, n.projectType),
        }))
        this.total = dataListTotalNum
        this.countData = {
          all: allProjectNum,
          industry_project: industryProjectNum,
          municipal_project: municipalProjectNum,
          bridge_project: bridgeProjectNum,
          facility_project: facilityProjectNum,
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
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
    handleReset(isRefresh = true) {
      this.projectType = '0'
      this.form.keyword = ''
      this.form.projectTypeCodeList = []
      this.form.projectStatusList = []
      if (isRefresh) this.handleSearch()
    },
  }
};
</script>

<style lang="scss">
.ProjectList {
  tbody {
    // .el-table__cell {
    //   vertical-align: top;
    // }

    .el-tag--info {
      border: none;
      background: #F0F2F3;
      height: 21px;
    }
  }
}
</style>

