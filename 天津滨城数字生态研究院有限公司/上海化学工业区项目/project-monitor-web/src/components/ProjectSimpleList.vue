<template>
  <div class="ProjectSimpleList flex-y">
    <ee-title class="full-w" title="项目列表" level="2">
      <el-button type="primary" link @click="handleView">
        查看全部<el-icon class="el-icon--right f-l3"><arrow-right /></el-icon>
      </el-button>
    </ee-title>
    <el-table v-loading="loading" ref="elTable" class="flex-1 full-w mt16" :data="data">
      <el-table-column prop="projectName" label="项目名称" min-width="160" show-overflow-tooltip>
        <template v-slot="sc">
          <div class="flex-1 ell">
            <el-button class="is-silent ell" type="primary" link @click="handleDetail(sc.row)">
              <span>{{ sc.row.projectName }}</span>
            </el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="estBuildEndTime" label="预计结束时间" min-width="80" show-overflow-tooltip>
        <template v-slot="sc">
          <span v-if="sc.row.estBuildEndTime" class="ddin-n f16">{{ sc.row.estBuildEndTime }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'ProjectSimpleList',
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
      loading: false
    }
  },
  methods: {
    handleView() {
      this.$emit('view')
    },
    handleDetail(val) {
      this.$router.push(`/project/detail/${val.projectId}`)
    },
  }
};
</script>

<style lang="scss">
.ProjectSimpleList {
  height: 331px;
}
</style>