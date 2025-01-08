<template>
  <el-container class="ProjectDraft full-vh">
    <el-header class="ee-header ProjectDraft__header is-shadow d-flex ai-center pdl20" height="58px">
      <el-button class="is-single" size="small" @click="$router.go(-1)">
        <el-icon><arrow-left-bold /></el-icon>
      </el-button>
      <div class="d-flex ai-center f14 f-l3 ml12">
        <svg-icon icon-class="home-bread" width="24px" height="24px" />当前位置：
      </div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/project' }">项目管理</el-breadcrumb-item>
        <el-breadcrumb-item>草稿箱</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-main class="ProjectDraft__main flex-y" style="padding:16px 20px 20px;">
      <div class="full-w">
        <ee-title title="草稿列表">
          <div class="d-flex ai-center">
            <el-button :disabled="selectionValue.length < 1" @click="handleCommand('handleDel')">
              <el-icon class="el-icon--left">
                <Delete />
              </el-icon>删除
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
        </ee-title>
      </div>
      <div v-loading="loading" class="ee-card ee-card--shadow mt16 pd20 flex-1 flex-y">
        <ee-checker :value="selectionValue.length" @cancel="$refs.elTable.clearSelection()" />
        <el-table ref="elTable" class="full-w mt12 flex-1" :class="{ 'is-empty': tableData.length < 1 }" :data="tableData"
          :row-class-name="rowClassName" @selection-change="selectionChange">
          <el-table-column type="selection" width="48" align="center" />
          <el-table-column prop="projectName" label="项目信息" min-width="200" show-overflow-tooltip />
          <el-table-column prop="projectOrg" label="项目单位" min-width="200" show-overflow-tooltip />
          <el-table-column prop="projectType" label="工程性质" min-width="80" />
          <el-table-column prop="landSupplType" label="供地方式" min-width="80" />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column label="操作" width="80">
            <template v-slot="sc">
              <el-button type="primary" link @click="handleEdit(sc.row)">
                <svg-icon class="el-icon--left" icon-class="edit" width="16px" height="16px" />编辑
              </el-button>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="ee-empty-data" description="暂无草稿">
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
  </el-container>
</template>

<script>
import { ruProjectBaseinfo_projectDraft, ruProjectBaseinfo_deleteDraftBatch } from '@/api/pm/ruProjectBaseinfo'
import useDictStore from '@/store/modules/dict'
import EeChecker from '@/components/EeChecker.vue'
const actionConfig = {
  handleDel: {
    api: ruProjectBaseinfo_deleteDraftBatch,
    message: '是否确定要删除选中的项目？',
    tip: '删除'
  }
}
export default {
  name: 'ProjectDraft',
  components: {
    EeChecker
  },
  data() {
    return {
      ...useDictStore().getDicts(['project_type', 'land_supply_type']),
      loading: false,
      tableData: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      selectionValue: [],
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    handleAdd(val) {
      this.$router.push(`/project/form/0/${val}`)
    },
    rowClassName({ row }) {
      return this.selectionValue.findIndex(n => row.projectId === n.projectId) > -1 ? 'is-checked' : ''
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
          config.api({ ids: this.selectionValue.map(n => n.projectId).join(',') }).then(({ success }) => {
            if (success) {
              this.$message({
                type: 'success',
                message: config.tip + '成功',
              })
              this.handleSearch()
            }
          })

        })
        .catch(() => { })
    },
    handleCommand(val) {
      const config = actionConfig[val]
      if (config) {
        this.handleAction(config)
      } else {
        this[val]()
      }
    },
    getDataList() {
      const params = {
        current: this.pageNum,
        size: this.pageSize,
      }
      this.loading = true
      ruProjectBaseinfo_projectDraft(params).then(({ result = [] }) => {
        this.tableData = result
        this.total = result.length
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
    }
  }
}

</script>
<style lang='scss'>
.ProjectDraft {}
</style>