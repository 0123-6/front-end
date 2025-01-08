<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-11-11 09:53:43
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-11-28 15:57:16
 * @FilePath: \company-template\src\views\system-manager\model-manager\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="model-manager-container">
    <div class="model-header">
      <label>模型管理</label>
      <TableOperationSearchInput :searchWord.sync="searchWord" @search="searchTable" placeholder="请输入模型名称"/>
    </div>
    <div class="model-main">
      <div class="table-container">
        <el-table
          v-loading="tableLoading"
          :data="tableData"
          stripe
          border
        >
          <template slot="empty">{{tableEmptyText}}</template>
          <el-table-column label="序号" type="index" width="50" min-width="50" :index="indexMethod" />
          <el-table-column label="ID" prop="id" show-overflow-tooltip width="50" />
          <el-table-column label="模型名称" prop="modelNameCh" show-overflow-tooltip min-width="170">
            <template slot-scope="scope">
              <span class="hover:cursor-pointer hover:text-blue" @click="toModelDetail(scope.row)">{{scope.row.modelNameCh}}</span>
            </template>
          </el-table-column>
          <el-table-column label="模型类型" prop="modelTypeName" show-overflow-tooltip width="130" />
          <el-table-column label="服务开始时间" prop="sysUserModelData.expiryTimeStart" show-overflow-tooltip width="170" />
          <el-table-column label="服务结束时间" prop="sysUserModelData.expiryTimeEnd" show-overflow-tooltip width="170" />
          <el-table-column label="状态" prop="expire" show-overflow-tooltip width="100">
            <template slot-scope="scope">
              <span :class="[scope.row.expire === 2?'online':'offline', 'dot']"></span>
              {{scope.row.expire === 2? '服务中':'已过期'}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template slot-scope="scope">
              <TableOperationTooltip
                icon-class="table-apply"
                tooltip-title="应用"
                :iconDisabled="scope.row.expire === 1"
                @tooltipClick="openApplyDialog(scope.row, 'create')"
              />
              <TableOperationTooltip
                icon-class="table-cancel-apply"
                tooltip-title="取消应用"
                @tooltipClick="openApplyDialog(scope.row, 'edit')"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        class="pb-4"
        v-show="tableListTotal > 10"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :total="tableListTotal"
        @size-change="changeSize"
        @current-change="changePage">
      </el-pagination>
    </div>
    <MessageDialog
      v-if="messageDialogVisible"
      :title="messageTitle"
      @save="saveMessage"
      @cancel="cancelMessage"
    >
      <template slot="content">
        <div class="content-container" v-html="messageContent" />
      </template>
    </MessageDialog>
    <ApplyDialog
      v-if="applyDialogVisible"
      :detail="applyDialogDetail"
      :state="applyDialogState"
      @cancel="cancelApply"
      @save="saveApply"
    ></ApplyDialog>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import ApplyDialog from '@/views/system-manager/model-manager/components/ApplyDialog.vue';
import MessageDialog from '@/components/MessageDialog';
import TableOperationTooltip from '@/views/system-manager/components/TableOperationTooltip';
import TableOperationSearchInput from '@/views/system-manager/components/TableOperationSearchInput';
import { getModelListData, addModelDevice, cancelModelDevice } from '@/api/model-manage';

export default {
  name: 'model-manger',
  components: {
    ApplyDialog,
    MessageDialog,
    TableOperationTooltip,
    TableOperationSearchInput
  },
  data() {
    return {
      searchWord: '',
      tableEmptyText: '',
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      tableListTotal: 0,
      messageDialogVisible: false, // 信息提示框显隐
      messageTitle: '', // 信息提示框标题
      messageContent: '', // 信息提示框内容
      applyDialogVisible: false,
      applyDialogState: 'create',
      applyDialogDetail: {},
      selectedDeviceIds: [],
      tableLoading: false
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    // 序号排序
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    // 每页选择
    changeSize(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getTableData();
    },
    // 分页
    changePage(val) {
      this.currentPage = val;
      this.getTableData();
    },
    // 搜索
    searchTable() {
      this.changePage(1);
    },
    // 获取表格数据
    getTableData() {
      this.tableLoading = true;
      const params = {
        keyword: this.searchWord,
        pageSize: this.pageSize,
        pageNum: this.currentPage
      };
      this.tableEmptyText = '';
      getModelListData(params).then((result) => {
        if (result.code === '000000') {
          this.tableData = result.data.records;
          this.tableListTotal = result.data.total;
          if (
            this.tableListTotal > 0 && result.data.records.length === 0 && this.currentPage > 1
          ) {
            this.currentPage -= 1;
            this.getTableData();
          }
          if (this.tableData.length === 0) this.tableEmptyText = '暂无数据';
          this.tableLoading = false;
        } else {
          this.tableLoading = false;
        }
      }).catch((err) => {
        this.tableLoading = false;
      });
    },
    // 显示应用弹框
    openApplyDialog(row, type) {
      this.applyDialogState = type;
      this.applyDialogDetail = { id: row.id, name: row.modelNameCh };
      this.selectedDeviceIds = [];
      if (type === 'create') {
        if (row.expire !== 2) {
          this.applyDialogVisible = false;
        } else if (dayjs(row.sysUserModelData.expiryTimeEnd).format() <= dayjs().add(1, 'day').format()) {
          this.messageDialogVisible = true;
          this.messageTitle = '提示';
          this.messageContent = '模型即将到期,不可应用于监控点!';
        } else {
          this.applyDialogVisible = true;
        }
      } else {
        this.applyDialogVisible = true;
      }
    },
    // 取消应用
    cancelApply() {
      this.applyDialogVisible = false;
    },
    // 保存应用
    saveApply(selectedData) {
      this.selectedDeviceIds = selectedData.map((item) => item.id);
      if (this.applyDialogState === 'create') {
        const params = {
          deviceIds: this.selectedDeviceIds,
          modelIds: [this.applyDialogDetail.id]
        };
        addModelDevice(params).then((result) => {
          if (result.code === '000000') {
            this.$message({
              type: 'success',
              message: '模型应用成功，生效时间稍有延长，请耐心等待'
            });
            this.cancelApply();
          }
        }).catch((err) => {
        });
      } else {
        this.openDeleteDialog();
      }
    },
    // 打开取消应用信息提示框
    openDeleteDialog() {
      this.messageDialogVisible = true;
      this.messageTitle = '提示';
      this.messageContent = `确定要取消应用${this.selectedDeviceIds.length}个监控点吗?`;
    },
    // 取消信息提示框
    cancelMessage() {
      this.messageDialogVisible = false;
      this.cancelApply();
    },
    // 保存信息提示框
    saveMessage() {
      if (this.applyDialogState === 'edit') {
        const params = {
          deviceIds: this.selectedDeviceIds,
          modelIds: [this.applyDialogDetail.id]
        };
        cancelModelDevice(params).then((result) => {
          if (result.code === '000000') {
            this.$message({
              type: 'success',
              message: '模型成功取消应用'
            });
            this.cancelMessage();
          }
        }).catch((err) => {
        });
      } else {
        this.cancelMessage();
      }
    },
    // 点击模型名称
    toModelDetail(row) {
      const params = {
        buttonVisible: true,
        expire: row.expire,
        expiryTimeEnd: row.sysUserModelData.expiryTimeEnd
      };
      sessionStorage.setItem('modelApplyButtonParams', JSON.stringify(params));
      const routeData = this.$router.resolve({
        path: `/library/detail/${row.id}`
      });
      window.open(routeData.href, '_blank');
    }
  }
};
</script>

<style lang="less" scoped>
@import '~@/styles/variables.less';

.model-manager-container {
  background-color: #FFFFFF;
  padding: 12px 24px;
  min-height: 100%;
  border-radius: 4px;
  box-shadow: 0 9px 15px 0 #E5ECF1;
  .model-header {
    height: 40px;
    line-height: 40px;
    margin-bottom: 12px;
    label {
      font-size: 16px;
      color: @text-primary-dark;
      font-weight: 600;
    }
    ::v-deep .search-input {
      margin-left: 100px;
    }
  }
  .model-main {
    text-align: center;
    height: calc(100% - 40px);
    .table-container {
      overflow: auto;
    }
    .dot {
      height: 12px;
      width: 12px;
      display: inline-block;
      border-radius: 12px;
      position: relative;
      top: 1px;
      &.online {
        background-color: #00AB5A;
      }
      &.offline {
        background-color: #C0C4C2;
      }
    }
    .el-pagination {
      margin-top: 12px;
      margin-bottom: 48px;
    }
  }
}
</style>
