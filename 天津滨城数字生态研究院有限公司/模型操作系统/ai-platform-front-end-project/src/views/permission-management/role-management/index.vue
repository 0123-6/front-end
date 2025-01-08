<template>
  <!-- 最外层 -->
  <div class="flex flex-direction role-management-list-container bgc-main">
    <div class="flex flex-direction flex-1 role-management-list-container">
      <!-- 顶部 -->
      <el-row class="flex top-operation-container" style="width: 100%;">
        <div class="flex role-management-title-container">
          角色管理
        </div>
        <InputWithSearch class="flex inline-search" :placeholder="'请输入角色'" @search="search" />
        <el-button class="flex blue-btn create-button" @click="create">创建</el-button>
      </el-row>
      <!-- 主体 -->
      <div v-loading="loading" class="role-management-table-container">
        <div class="role-management-table-detail-container">
          <!-- 表格 -->
          <el-table
            ref="multipleTable"
            :data="taskList"
            :height="tableHeight"
            border
            @sort-change="sortChange"
            @mousedown.native="mouseDownHandler"
            @mouseup.native="mouseUpHandler"
            @mousemove.native="mouseMoveHandler"
          >
            <el-table-column
              label="序号"
              prop="number"
              type="index"
              show-overflow-tooltip
              width="80"
              :index="indexMethod"
            />
            <el-table-column
              label="ID"
              align="left"
              prop="roleId"
              show-overflow-tooltip
              width="80"
              sortable="custom"
            />
            <el-table-column label="角色" align="left" prop="roleName" show-overflow-tooltip min-width="80px" />
            <el-table-column label="角色描述" align="left" prop="remark" show-overflow-tooltip min-width="260px" />
            <el-table-column
              label="创建时间"
              align="left"
              prop="createTime"
              show-overflow-tooltip
              sortable="custom"
              width="180"
            />
            <el-table-column label="操作" align="center" width="90" fixed="right" class-name="table-operation-container">
              <template slot-scope="scope" class="flex">
                <!-- 三个按钮 -->
                <TableOperationTooltip icon-class="table-see" tooltip-title="查看" style="margin-right: 8px;" @tooltipClick="lookOver(scope.row)" />
                <TableOperationTooltip icon-class="table-edit" tooltip-title="编辑" @tooltipClick="edit(scope.row,scope.$index)" />
                <TableOperationTooltip v-if="false" icon-class="table-delete" tooltip-title="删除" @tooltipClick="deleteDetail(scope.row,scope.$index)" />
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页器 -->
          <el-pagination
            v-show="total > pageSize"
            class="pagination-container"
            background
            :current-page="currentPage"
            :total="total"
            :page-sizes="[10, 20, 50]"
            :page-size="pageSize"
            layout="total, prev, pager, next, sizes, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />

        </div>
      </div>
    </div>
    <!-- 查看弹窗 -->
    <normal-dialog
      v-if="showDialogCheck"
      :person="person"
      type="查看"
      @ok="CheckOk"
      @cancel="CheckCancel"
    />
    <!-- 创建弹窗 -->
    <normal-dialog
      v-if="showDialog"
      :person="{}"
      type="创建"
      @ok="createOk(arguments)"
      @cancel="cancel"
    />
    <!-- 编辑弹窗 -->
    <normal-dialog
      v-if="showDialogEdit"
      :person="person"
      type="编辑"
      @ok="EditOk(arguments)"
      @cancel="EditCancel"
    />
    <!-- 删除弹窗 -->
    <delete-dialog
      v-if="showDialogDelete"
      :person="person.roleName"
      @ok="DeleteOk"
      @cancel="DeleteCancel"
    />

  </div>
</template>

<script>
import { getRoleManagementList, addRoleList, deleteRoleOne, updateRoleList } from '@/api/role-management';
import InputWithSearch from '@/components/InputWithSearch';
import TableOperationTooltip from '@/components/TableOperationTooltip';
import DeleteDialog from './dialog/delete.vue';
import NormalDialog from './dialog/normal.vue';
import qs from 'qs';
export default {
  filters: {
    filter_status(value, list) {
      const typeArr = list.find((item) => item.code === value);
      return typeArr ? typeArr.label : '';
    }
  },
  components: {
    InputWithSearch,
    DeleteDialog,
    NormalDialog,
    TableOperationTooltip
  },
  data() {
    return {
      showDialog: false, // 创建弹窗
      showDialogDelete: false, // 删除弹窗
      showDialogCheck: false, // 查看弹窗
      showDialogEdit: false, // 编辑弹窗
      taskList: [], // 表格数据
      person: {}, // 当前点击的行的角色
      index: '', // 当前点击行的索引
      total: 0, // 多少条数据
      currentPage: 1, // 当前页
      pageSize: 10, // 每页多少条
      searchWord: '', // 搜索的关键字
      loading: false,
      pageNum: 1,
      mouseFlag: false,
      mouseOffset: 0,
      sortColumn: '', // 排序的列名
      sortOrder: '', // 排序方式
      tableHeight: 0
    };
  },
  mounted() {
    this.getTaskList();
    window.addEventListener('resize', this.setTableHeight);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setTableHeight);
  },
  methods: {
    // 获取任务列表
    getTaskList() {
      this.loading = true;
      const pageParmas = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        roleName: this.searchWord,
        column: this.sortColumn,
        order: this.sortOrder
      };
      getRoleManagementList(qs.stringify(pageParmas)).then(res => {
        this.total = res.data.total;
        this.taskList = res.data.data;
        this.loading = false;
        this.$nextTick(() => {
          this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
          this.setTableHeight();
        });
      }).catch(() => {
      });
    },
    search(val) {
      this.searchWord = val;
      this.getTaskList();
    },
    sortChange({ column, prop, order }) {
      this.sortColumn = prop;
      this.sortOrder = order;
      this.getTaskList();
    },
    // 添加数据方法
    createOk(val) {
      addRoleList(val[0], val[1]).then(res => {
        this.getTaskList();
      }).catch(() => {
      });
      this.cancel();
    },
    // 编辑数据方法
    EditOk(val) {
      if ((val[1].length) !== 0) {
        updateRoleList(val[0], (val[1])).then(res => {
          this.getTaskList();
        }).catch(() => {
        });
      } else {
        updateRoleList(val[0], []).then(res => {
          this.getTaskList();
        }).catch(() => {
        });
      }
      this.showDialogEdit = false;
    },
    create() {
      this.showDialog = true;
      this.person = {};
    },

    lookOver(val) {
      this.person = val;
      this.type = '查看';
      this.showDialogCheck = true;
    },
    edit(val, index) {
      this.person = val;
      this.index = index;
      this.showDialogEdit = true;
      this.type = '编辑';
    },
    cancel() {
      this.showDialog = false;
    },
    // 删除
    deleteDetail(val, index) {
      this.index = index;
      this.person = val;
      this.showDialogDelete = true;
    },
    DeleteOk() {
      const x = parseInt(this.person.roleId);
      deleteRoleOne(x).then(res => {
        // 删除最后一页的唯一项会时当前页偏移
        if ((this.currentPage - 1) * this.pageSize === (this.total - 1)) {
          this.currentPage = this.currentPage - 1;
        }
        this.getTaskList();
      }).catch(() => {
      });
      this.showDialogDelete = false;
    },
    DeleteCancel() {
      this.showDialogDelete = false;
    },
    CheckOk() {
      this.CheckCancel();
    },
    CheckCancel() {
      this.showDialogCheck = false;
    },
    EditCancel(val) {
      this.showDialogEdit = false;
    },
    // 表格鼠标按下滚动 开始
    // 按下鼠标记录鼠标位置
    mouseDownHandler(e) {
      this.mouseOffset = e.clientX;
      this.mouseFlag = true;
    },
    mouseUpHandler(e) {
      this.mouseFlag = false;
    },
    mouseMoveHandler(e) {
      // 这里面需要注意，通过ref需要那个包含table元素的父元素
      if (!this.$refs.multipleTable) return;
      const divData = this.$refs.multipleTable.bodyWrapper;
      if (this.mouseFlag) {
        // 设置水平方向的元素的位置
        divData.scrollLeft -= (-this.mouseOffset + (this.mouseOffset = e.clientX));
      }
    },

    handleSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1;
      this.loading = true;
      this.getTaskList();
    },

    handleCurrentChange(num) {
      this.currentPage = num;
      this.loading = true;
      this.getTaskList();
    },
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    // 设置表格高度，做表格滚动表头不动处理
    setTableHeight() {
      const bodyHeight = document.body.offsetHeight - 50;
      const navHeight = document.getElementById('AiHeader-container').offsetHeight;
      const topOperationHeight = document.getElementsByClassName('top-operation-container')[0].offsetHeight;
      const paginationHeight = document.getElementsByClassName('pagination-container')[0] ? document.getElementsByClassName('pagination-container')[0].offsetHeight : 0;
      this.tableHeight = bodyHeight - navHeight - topOperationHeight - paginationHeight - 32 - 32 - 32 - 4;
      const realTableHeight = this.taskList.length * 45 + 45;
      if (this.taskList.length === 0) {
        this.tableHeight = 60 + 45;
      } else {
        this.tableHeight > realTableHeight ? this.tableHeight = realTableHeight : '';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.role-management-list-container {
  //background: #E4EDF8;
  width: 100%;
  height: auto;
  padding: 16px;
  .role-management-list-container {
    width: 100%;
    padding: 16px 24px;
    background: #ffffff;
    min-height: calc(100vh - var(--header-height) - 32px);
    .role-management-title-container {
      height: 34px;
      line-height: 34px;
      font-size: 16px;
      color: #646464;
      font-weight: 700;
      display: inline-block;
    }
    .inline-search {
      margin-left: 24px;
      display: inline-block;
      width: 300px;
    }
    .create-button {
      margin-left: auto;
      width: 100px;
      height: 34px;
    }
    .role-management-table-container {
      width: 100%;
      margin-top: 8px;
      .role-management-table-detail-container {
        overflow: auto;
        .el-table {
          ::v-deep .el-table__header-wrapper {
            border-radius: 4px 4px 0 0;
            .el-table__header {
              th {
                padding: 6px;
              }
            }
          }
          ::v-deep .el-table__body-wrapper {
            tr > td {
              height: 45px;
              line-height: 45px;
              padding: 4px 8px;
              word-break: break-all;
            }
          }
        }
      }
      .role-management-pagination-container {
        width: 100%;
        height: 60px;
        margin-top: 16px;
      }
    }
  }
}
.pagination-container{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  margin-top: 10px;
}
</style>
