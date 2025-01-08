<template>
  <el-container class="MessageList full-vh">
    <el-header class="ee-header d-flex ai-center pl-l pr-l" height="67px">
      <ee-title title="消息通知" />
    </el-header>
    <el-main class="pl-l pr-l" style="padding-top: 0;">
      <div class="ee-card ee-card--shadow ee-card--pd flex-y full-h">
        <div v-loading="loading" element-loading-background="transparent" element-loading-spinner="none">
          <el-radio-group class="ee-radio-group" v-model="messageType" @change="handleSearch">
            <el-radio-button label="0">全部({{ total }})</el-radio-button>
            <el-radio-button v-for="(n, i) in msg_type" :label="n.itemCode" :key="n.itemCode">{{ n.itemName
            }}({{ i === 3 ? total : 0 }})</el-radio-button>
          </el-radio-group>
          <div class="d-flex ai-center jc-between mt16">
            <el-form :inline="true" :model="form">
              <el-form-item style="margin-bottom: 0;">
                <el-input v-model="form.keyword" type="text" placeholder="请输入关键词搜索" clearable
                  style="width:300px;"></el-input>
              </el-form-item>
              <el-form-item style="margin-bottom: 0;">
                <el-button type="primary" @click="handleSearch">搜索</el-button>
              </el-form-item>
            </el-form>
            <div class="d-flex ai-center">
              <el-dropdown @command="handleCommand">
                <el-button class="is-light" type="primary">
                  批量操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="read">设为已读</el-dropdown-item>
                    <el-dropdown-item command="unread">设为未读</el-dropdown-item>
                    <el-dropdown-item command="del">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-button class="ml12" type="primary" @click="handleCommand('readAll')">
                <svg-icon class="el-icon--left" icon="read-all" width="16px" height="16px" />全部已读
              </el-button>
            </div>
          </div>
          <ee-checker class="mt12" :value="selectionValue.length" @cancel="$refs.elTable.clearSelection()" />
        </div>
        <el-table v-loading="loading" ref="elTable" class="mt12 flex-1" :class="{ 'is-empty': tableData.length < 1 }"
          :data="tableData" :row-class-name="rowClassName" @selection-change="selectionChange" style="width: 100%;">
          <el-table-column type="selection" width="48" align="center" fixed="left" />
          <el-table-column prop="statusName" label="状态" min-width="70">
            <template v-slot="sc">
              <ee-tag :type="sc.row.statusClass" shape="round-rect">{{ sc.row.statusName }}</ee-tag>
            </template>
          </el-table-column>
          <el-table-column prop="typeName" label="通知类型" min-width="100" />
          <el-table-column prop="projectName" label="关联项目" min-width="200" show-overflow-tooltip>
            <template v-slot="sc">
              <el-button class="is-silent ell" type="primary" link @click="goProject(sc.row)">{{ sc.row.projectName
              }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="content" label="提醒内容" min-width="300" show-overflow-tooltip />
          <el-table-column prop="createTime" label="创建时间" width="180">
            <template v-slot="sc">
              <span class="ddin-n f16">{{ sc.row.createTime }}</span>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="ee-empty-data" description="暂无消息通知">
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
import { messageTypeList } from '@/utils/constant.js'
import EeChecker from '@/components/EeChecker.vue'
import useDictStore from '@/store/modules/dict'
import { ruProjectBaseinfo_queryHomePage } from '@/api/pm/ruProjectBaseinfo'

const actionConfig = {
  readAll: {
    api: '',
    message: '是否确定要全部已读？',
    tip: '全部已读'
  },
  read: {
    api: '',
    message: '是否确定要将选中的消息设为已读？',
    tip: '设为已读'
  },
  unread: {
    api: '',
    message: '是否确定要将选中的消息设为未读？',
    tip: '设为未读'
  },
  del: {
    api: '',
    message: '是否确定要删除选中的项目？',
    tip: '删除'
  }
}

export default {
  name: 'MessageList',
  components: { EeChecker },
  data() {
    return {
      ...useDictStore().getDicts(['msg_type']),
      messageTypeList,
      messageType: '0',
      form: {},
      tableData: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      selectionValue: [],
      loading: false
    }
  },
  activated() {
    const { params = {} } = history.state
    if (Object.keys(params).length > 0) {
      this.form.keyword = params.keyword || ''
      this.messageType = params.messageType || ''
      this.handleSearch()
      history.state.params = {}
    } else if (!this.isActivated) {
      this.handleSearch()
    }
    this.isActivated = true
  },
  methods: {
    goProject(obj) {
      this.$router.push(`/project/detail/${obj.projectId || 0}`)
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
          this.$message({
            type: 'success',
            message: config.tip + '成功',
          })
        })
        .catch(() => {

        })
    },
    handleCommand(val) {
      const config = actionConfig[val]
      if (config) {
        this.handleAction(config)
      }
    },
    getDataList() {
      // const params = {
      //   current: this.pageNum,
      //   size: this.pageSize,
      //   messageType: this.messageType,
      //   ...this.form
      // }
      // this.loading = true
      // ruProjectBaseinfo_queryHomePage(params).then(({ result }) => {
      //   const { scrollingDataList = [] } = result
      //   this.tableData = (scrollingDataList || []).map((n, i) => ({
      //     ...n,
      //     statusClass: 'danger',
      //     statusName: '未读',
      //     status: 1,
      //     typeName: '延期提醒',
      //     type: 'delay_remind',
      //     content: `【${n.periodName}】${n.currentStepName}已延期，请尽快处理`,
      //     createTime: '2023-12-25',
      //   })).filter(n => this.messageType === '0' || this.messageType === n.type)
      //   if (this.tableData.length > 0)
      //     this.total = this.tableData.length
      //   this.loading = false
      // }).catch((e) => {
      //   console.log(e)
      //   this.loading = false
      // })
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
    handleReset() {
      this.messageType = '0'
      this.form.keyword = ''
      this.handleSearch()
    },
    rowClassName({ row }) {
      return row.status == 0 ? 'is-visited' : ''
    }
  }
};
</script>