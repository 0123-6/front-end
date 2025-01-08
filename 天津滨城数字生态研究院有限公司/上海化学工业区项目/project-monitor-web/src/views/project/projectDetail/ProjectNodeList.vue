<template>
  <div class="ProjectNodeList">
    <el-table :data="data" style="width: 100%;">
      <el-table-column prop="stepName" label="环节" min-width="160" fixed="left" show-overflow-tooltip>
        <template v-slot="sc">
          <div class="d-flex ai-center ell">
            <el-button class="is-silent ell" type="primary" link @click="$emit('detail', sc.row)">
              <span class="ell">{{ sc.row.stepName }}</span></el-button>
            <el-button v-if="sc.row.associatedKnowledge" type="primary" link @click="$emit('policy', sc.row)"
              style="margin-left: 4px;">
              <svg-icon icon="policy" width="18px" height="18px" />
            </el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="statusCode" label="状态" width="120">
        <template v-slot="sc">
          <el-dropdown v-if="sc.row.status != 3 && sc.row.status != 5"
            @command="e => { handleChangeNodeStatus(e, sc.row) }">
            <div class="d-flex ai-center">
              <ee-tag class="flex-1" :type="nodeStatusStyles[sc.row.statusCode]" shape="dot">{{
                getDictName(step_status, sc.row.statusCode) }}</ee-tag>
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="n in getStepStatusOptions(sc.row.status)" :command="n.itemCode.toString()">
                  {{ n.itemName }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <ee-tag v-else class="flex-1" :type="nodeStatusStyles[sc.row.statusCode]" shape="dot">{{
            getDictName(step_status, sc.row.statusCode) }}</ee-tag>
        </template>
      </el-table-column>
      <el-table-column prop="stepDurationFd" label="法定时限" min-width="80" show-overflow-tooltip>
        <template v-slot="sc">
          {{ sc.row.stepDurationFd }}（{{ getDictName(duration_type, sc.row.durationTypeCode) }}）
        </template>
      </el-table-column>
      <el-table-column prop="stepDuration" label="承诺时限" min-width="80" show-overflow-tooltip>
        <template v-slot="sc">
          {{ sc.row.stepDuration }}（{{ getDictName(duration_type, sc.row.durationTypeCode) }}）
        </template>
      </el-table-column>
      <el-table-column prop="startDeptName" label="发起部门" min-width="100" show-overflow-tooltip>
        <template v-slot="sc">{{ sc.row.startDeptName || '-' }}</template>
      </el-table-column>
      <el-table-column prop="acceptDeptName" label="受理/经办部门" min-width="120" show-overflow-tooltip>
        <template v-slot="sc">{{ sc.row.acceptDeptName || '-' }}</template>
      </el-table-column>
      <el-table-column prop="coordinateDeptName" label="协调部门" min-width="100" show-overflow-tooltip>
        <template v-slot="sc">{{ sc.row.coordinateDeptName || '-' }}</template>
      </el-table-column>
      <el-table-column prop="stepContactName" label="联系人" min-width="70" show-overflow-tooltip>
        <template v-slot="sc">{{ sc.row.stepContactName || '-' }}</template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间" width="120" show-overflow-tooltip>
        <template v-slot="sc">
          <div class="d-flex ai-center">
            <ee-tag type="primary" shape="round-rect" single>预</ee-tag>
            <span v-if="sc.row.estStartTime" class="ml4 ddin-n f16">{{ sc.row.estStartTime || '-' }}</span>
            <span v-else class="ml4">-</span>
          </div>
          <div class="d-flex ai-center mt4">
            <ee-tag type="success" shape="round-rect" single>实</ee-tag>
            <span v-if="sc.row.startTime" class="ml4 ddin-n f16">{{ sc.row.startTime || '-' }}</span>
            <span v-else class="ml4">-</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="begin" label="结束时间" width="120" show-overflow-tooltip>
        <template v-slot="sc">
          <div class="d-flex ai-center">
            <ee-tag type="primary" shape="round-rect" single>预</ee-tag>
            <span v-if="sc.row.estEndTime" class="ml4 ddin-n f16">{{ sc.row.estEndTime || '-' }}</span>
            <span v-else class="ml4">-</span>
          </div>
          <div class="d-flex ai-center mt4">
            <ee-tag type="success" shape="round-rect" single>实</ee-tag>
            <span v-if="sc.row.endTime" class="ml4 ddin-n f16">{{ sc.row.endTime || '-' }}</span>
            <span v-else class="ml4">-</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="195" fixed="right">
        <template v-slot="sc">
          <el-button class="btn-shift" type="primary" link @click="$emit('shift', sc.row)">
            <svg-icon class="el-icon--left" icon-class="shift" width="14px" height="14px" />
            调度转办
          </el-button>
          <el-button type="primary" link @click="$emit('remark', sc.row)">
            <svg-icon class="el-icon--left" icon-class="edit" width="14px" height="14px" />添加备注
          </el-button>
        </template>
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
</template>

<script>
import { nodeStatusStyles, getNodeStatusOptions } from '@/utils/constant.js'
import useDictStore from '@/store/modules/dict'
export default {
  name: 'ProjectNodeList',
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      nodeStatusStyles,
      ...useDictStore().getDicts(['step_status', 'duration_type']),
    }
  },
  methods: {
    getStepStatusOptions(status) {
      return getNodeStatusOptions(status, this.step_status)
    },
    handleChangeNodeStatus(val, row) {
      this.$emit('change-status', {
        id: row.nodeId,
        status: val,
      })
    }
  }
};
</script>