<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-11-11 09:58:19
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-11-28 11:29:54
 * @FilePath: \company-template\src\views\system-manager\user-manager\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="user-manager-container">
    <div class="user-header">
      <label>用户管理</label>
      <TableOperationSearchInput :searchWord.sync="searchWord" @search="searchTable" placeholder="请输入账号/姓名/单位/手机号"/>
      <div class="buttons-container">
        <el-button class="primary" @click="openDetailDialog('create')">创建</el-button>
        <el-button class="primary plain">批量创建</el-button>
      </div>
    </div>
    <div class="user-main">
      <div class="table-container">
        <el-table
          v-loading="tableLoading"
          :data="tableData"
          stripe
          border
        >
          <template slot="empty">{{tableEmptyText}}</template>
          <el-table-column label="序号" type="index" width="50" min-width="50" :index="indexMethod" />
          <el-table-column label="ID" prop="id" width="50" show-overflow-tooltip />
          <el-table-column label="账号" prop="userName" min-width="90" show-overflow-tooltip/>
          <el-table-column label="手机号" prop="phonenumber" min-width="100" show-overflow-tooltip/>
          <el-table-column label="姓名" prop="nickName" min-width="70" show-overflow-tooltip/>
          <el-table-column label="单位" prop="company" min-width="150" show-overflow-tooltip/>
          <el-table-column label="创建时间" prop="createTime" width="170" show-overflow-tooltip/>
          <el-table-column label="角色" prop="roleId" width="100">
            <template slot-scope="scope">
              {{scope.row.roleId === 1? '超级管理员':'普通用户'}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template slot-scope="scope" >
              <TableOperationTooltip icon-class="table-watch" tooltip-title="查看" @tooltipClick="toUserDetail(scope.row)" />
              <TableOperationTooltip icon-class="table-delete" tooltip-title="删除" @tooltipClick="openDeleteDialog(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
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
    <DetailDialog
      v-if="detailDialogVisible"
      :state="detailDialogState"
      :detail-form.sync="editUserDetail"
      @save="saveDetail"
      @cancel="cancelDetail"
    />
  </div>
</template>

<script>
import MessageDialog from '@/components/MessageDialog';
import DetailDialog from '@/views/system-manager/user-manager/components/DetailDialog';
import TableOperationTooltip from '@/views/system-manager/components/TableOperationTooltip';
import TableOperationSearchInput from '@/views/system-manager/components/TableOperationSearchInput';
import { getUserListData, addUser, deleteUser } from '@/api/user-manage';

export default {
  name: 'user-manger',
  components: {
    MessageDialog,
    DetailDialog,
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
      selectRow: {},
      messageDialogVisible: false, // 信息提示框显隐
      messageType: '', // 信息提示框类型
      messageTitle: '', // 信息提示框标题
      messageContent: '', // 信息提示框内容
      detailDialogVisible: false, // 详情弹框显隐
      detailDialogState: 'create', // 详情弹框状态
      editUserDetail: {}, //  详情弹框数据
      tableLoading: false
    };
  },
  mounted() {
    this.tableLoading = true;
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
      const params = {
        keyword: this.searchWord,
        pageSize: this.pageSize,
        pageNum: this.currentPage
      };
      this.tableEmptyText = '';
      getUserListData(params).then((result) => {
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
    // 打开删除提示框
    openDeleteDialog(row) {
      this.messageType = 'delete';
      this.selectRow = row;
      this.messageDialogVisible = true;
      this.messageTitle = '提示';
      this.messageContent = `确定要删除账号<span class="label-color">&nbsp;&nbsp;${row.userName}&nbsp;&nbsp;</span>吗?`;
    },
    // 取消信息提示框
    cancelMessage() {
      this.messageDialogVisible = false;
    },
    // 保存信息提示框
    saveMessage() {
      deleteUser(this.selectRow).then((result) => {
        if (result.code === '000000') {
          this.$message({
            type: 'success',
            message: '删除成功'
          });
          this.cancelMessage();
          this.getTableData();
        }
      }).catch((err) => {
      });
    },
    // 打开详情弹框
    openDetailDialog(type) {
      this.detailDialogState = type;
      this.editUserDetail = {};
      this.detailDialogVisible = true;
    },
    // 取消详情弹框
    cancelDetail() {
      this.detailDialogVisible = false;
    },
    // 保存详情弹框
    saveDetail(params) {
      addUser(params).then((result) => {
        if (result.code === '000000') {
          this.$message({
            type: 'success',
            message: '新增成功'
          });
          this.cancelDetail();
          this.searchTable();
        }
      }).catch((err) => {
      });
    },
    // 查看详情
    toUserDetail(row) {
      this.$router.push(`/system/user-detail/${row.id}`);
    }
  }
};
</script>

<style lang="less" scoped>
@import '~@/styles/variables.less';
.user-manager-container {
  background-color: #FFFFFF;
  padding: 12px 24px;
  min-height: 100%;
  border-radius: 4px;
  box-shadow: 0 9px 15px 0 #E5ECF1;
  .user-header {
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
    .buttons-container {
      float: right;
    }
  }
  .user-main {
    text-align: center;
    height: calc(100% - 40px);
    .el-pagination {
      margin-top: 12px;
      margin-bottom: 48px;
    }
  }
}
</style>
