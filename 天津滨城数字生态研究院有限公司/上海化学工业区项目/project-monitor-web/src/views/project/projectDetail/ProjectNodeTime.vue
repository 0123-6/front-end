<template>
  <el-drawer v-model="visible" size="50%" :close-on-click-modal="false" style="min-width:900px;">
    <template #header="{ close, titleId, titleClass }">
      <div class="d-flex ai-center jc-between flex-1">
        <div class="f500">环节列表</div>
      </div>
    </template>
    <div v-loading="loading">
      <div class="d-flex ai-center jc-between mr24 mt12">
        <el-form class="ml24" :inline="true" :model="form" label-width="80px">
          <el-form-item label="环节状态:" style="margin-bottom: 0;">
            <el-select v-model="form.stepStatusList" placeholder="全部" clearable multiple collapse-tags
              @change="getDataList">
              <el-option v-for="item in step_status" :key="item.itemCode" :label="item.itemName" :value="item.itemCode" />
            </el-select>
          </el-form-item>
          <el-form-item label="环节属性:" style="margin-bottom: 0;">
            <el-select v-model="form.stepType" placeholder="全部" clearable @change="getDataList">
              <el-option v-for="item in step_type" :key="item.itemCode" :label="item.itemName" :value="item.itemCode" />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="d-flex ai-center">
          <el-icon color="#E85050">
            <WarningFilled />
          </el-icon>
          <span class="ml4 f12">超过法定时限</span>
          <el-icon class="ml20" color="#68CD44">
            <SuccessFilled />
          </el-icon>
          <span class="ml4 f12">低于法定时限</span>
        </div>
      </div>
      <div class="pdl24 pdr24">
        <el-table class="mt12" :data="tableData" height="calc(100vh - 150px)">
          <el-table-column prop="stepName" label="环节" min-width="100" fixed="left" show-overflow-tooltip />
          <el-table-column prop="statusCode" label="状态" width="100">
            <template v-slot="sc">
              <ee-tag :type="nodeStatusStyles[sc.row.statusCode]" shape="dot">{{ sc.row.statusCodeName
              }}</ee-tag>
            </template>
          </el-table-column>
          <el-table-column prop="stepType" label="环节属性" width="90" show-overflow-tooltip />
          <el-table-column prop="stepDurationFd" label="法定时限" width="120" show-overflow-tooltip>
            <template v-slot="sc">
              <span v-if="sc.row.stepDurationFd !== null">{{ sc.row.stepDurationFd }}（{{ sc.row.durationTypeName
              }}）</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="stepDuration" label="承诺时限" width="120" show-overflow-tooltip>
            <template v-slot="sc">
              <span v-if="sc.row.stepDuration !== null">{{ sc.row.stepDuration }}（{{ sc.row.durationTypeName }}）</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="useDays" label="实际消耗时长" width="120" show-overflow-tooltip>
            <template v-slot="sc">
              <div v-if="sc.row.useDays !== null" class="d-flex ai-center"
                :class="sc.row.totalDelayDays > 0 ? 'f-danger' : 'f-success'">
                <div style="min-width:20px;">{{ sc.row.useDays }}</div>
                <span class="mr4">（{{ sc.row.durationTypeName }}）</span>
                <el-icon v-if="sc.row.useDays > sc.row.stepDuration" color="#E85050">
                  <WarningFilled />
                </el-icon>
                <el-icon v-else color="#68CD44">
                  <SuccessFilled />
                </el-icon>
              </div>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="totalDelayDays" label="总延期时长" width="120" show-overflow-tooltip>
            <template v-slot="sc">{{ sc.row.totalDelayDays || '-' }}</template>
          </el-table-column>
          <template #empty>
            <el-empty class="ee-empty-data" description="暂无环节信息">
              <template #image>
                <svg-icon icon-class="empty-data" />
              </template>
            </el-empty>
          </template>
        </el-table>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { nodeStatusStyles } from '@/utils/constant.js'
import { ruProjectBaseinfo_completionStatusList } from '@/api/pm/ruProjectBaseinfo.js'
import useDictStore from '@/store/modules/dict'

export default {
  name: 'ProjectNodeTime',
  components: {},
  props: {
    show: {
      type: Boolean,
      default: false
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
      ...useDictStore().getDicts(['step_status', 'step_type', 'duration_type']),
      nodeStatusStyles,
      visible: false,
      tableData: [],
      form: {},
      loading: false
    }
  },
  watch: {
    params(val) {
      const { stepType = '', stepStatusList = '' } = val
      this.form.stepType = stepType
      this.form.stepStatusList = stepStatusList
    },
    show() {
      this.visible = true
      this.getDataList()
    }
  },
  methods: {
    getDataList() {
      this.loading = true
      ruProjectBaseinfo_completionStatusList({
        projectId: this.$route.params.id,
        ...this.form
      }).then(({ result }) => {
        this.tableData = result.map(n => ({
          ...n,
          durationTypeName: this.getDictName(this.duration_type, n.durationTypeCode)
        }))
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
  }
};
</script>