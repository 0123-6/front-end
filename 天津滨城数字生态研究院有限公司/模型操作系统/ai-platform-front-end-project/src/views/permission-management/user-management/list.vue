<template>
  <!--最外层-->
  <!--  min-height: 100%;-->
  <div class="flex flex-direction bgc-main id222 padding-left-16 padding-right-16" style="width: 100%;">
    <!--内容-->
    <div
      class="flex flex-direction margin-top-16 margin-bottom-16 bgc-white box-shadow-1 padding-bottom-24 padding-left-24 padding-right-24"
      style="width: 100%;min-height: calc(100vh - 142px);"
    >
      <!--标签行-->
      <div class="flex align-center margin-top-16 status-panel" style="width: 100%;">
        <!--标签内容-->
        <div class="flex font-size-14 color-title" style="margin-right: 50px;">
          全部({{ status && status.total }})
        </div>
        <div class="flex font-size-14 color-blue" style="margin-right: 50px;">
          超级管理员({{ status && status.data[0].count }})
        </div>
        <div class="flex font-size-14 color-orange" style="margin-right: 50px;">
          模型开发者({{ status && status.data[1].count }})
        </div>
        <div class="flex font-size-14 color-red" style="margin-right: 50px;">
          应用开发者({{ status && status.data[2].count }})
        </div>
        <div class="flex font-size-14 color-green" style="margin-right: 50px;">
          平台运营({{ status && status.data[3].count }})
        </div>
        <div class="flex font-size-14 color-cyan" style="margin-right: 50px;">
          平台运维({{ status && status.data[4].count }})
        </div>
      </div>
      <!--搜索和按钮-->
      <div class="flex justify-between align-center margin-top-8 operation-panel" style="width: 100%;">
        <!--左-->
        <div class="flex">
          <input-with-search
            placeholder="请输入账号/姓名/单位/手机号"
            style="width: 310px;"
            class="search-container"
            @search="search"
          />
        </div>
        <!--右-->
        <div class="flex align-center">
          <el-button type="primary" style="border-radius: 4px;width: 96px;font-size: 12px;" @click="showCreateDialog = true">创建</el-button>
          <el-button
            style="border-radius: 4px;width: 96px;height: 34px;font-size: 12px;"
            class="operation-primary-button"
            @click="showBatchCreateDialog = true"
          >批量创建
          </el-button>
          <el-button
            style="border-radius: 4px;width: 96px;height: 34px;font-size: 12px;"
            class="operation-primary-button"
            :disabled="selectedItemList.length===0"
            @click="openSetTimeDialog"
          >设置期限
          </el-button>
        </div>
      </div>
      <!--表格-->
      <div
        class="margin-top-8"
        style="width: 100%;"
      >
        <el-table
          ref="filterTable"
          v-loading="loading"
          style="width: 100%;border-radius: 2px;"
          :row-class-name="tableRowClassName"
          border
          :data="tableList"
          :height="tableHeight"
          :row-key="getRowKey"
          @selection-change="handleSelectionChange"
          @sort-change="sortChange"
          @mousedown.native="mouseDownHandler"
          @mouseup.native="mouseUpHandler"
          @mousemove.native="mouseMoveHandler"
        >
          <el-table-column align="center" type="selection" width="60" :reserve-selection="true" />
          <el-table-column type="index" label="序号" width="60" :index="indexMethod" />
          <el-table-column
            label="ID"
            align="left"
            prop="userId"
            show-overflow-tooltip
            width="80"
            sortable="custom"
          />
          <el-table-column label="账号" align="left" prop="userName" show-overflow-tooltip width="120" />
          <el-table-column label="手机号" align="left" prop="phonenumber" show-overflow-tooltip width="120" />
          <el-table-column
            label="姓名"
            align="left"
            prop="nickName"
            show-overflow-tooltip
            min-width="100"
          />
          <el-table-column
            label="单位"
            align="left"
            prop="company"
            show-overflow-tooltip
            min-width="170"
          />
          <el-table-column
            label="创建时间"
            align="left"
            sortable="custom"
            prop="createTime"
            show-overflow-tooltip
            width="120"
          >
            <template slot-scope="scope" class="flex align-center" style="width: 100%;">
              <div class="flex align-center" style="width: 100%;">
                <span v-if="scope.row.createTime">{{ scope.row.createTime && scope.row.createTime.split(' ')[0] }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="角色" align="left" prop="roleName" show-overflow-tooltip width="120">
            <template slot="header">
              <TableFiltersPopover
                :table-label="{
                  'type': 'roleName',
                  'label': '角色'
                }"
                :selection-list="roleList"
                :popover-width="'140'"
                :key-props="{
                  'code': 'value',
                  'label': 'text'
                }"
                @filter="filterChange"
              />
            </template>
            <template slot-scope="scope" class="flex align-center" style="width: 100%;">
              <div class="flex align-center" style="width: 100%;">
                <span v-if="scope.row.roleName==='超级管理员'" class="color-blue">超级管理员</span>
                <span v-else-if="scope.row.roleName==='模型开发者'" class="color-orange">模型开发者</span>
                <span v-else-if="scope.row.roleName==='应用开发者'" class="color-red">应用开发者</span>
                <span v-else-if="scope.row.roleName==='平台运营'" class="color-green">平台运营</span>
                <span v-else-if="scope.row.roleName==='平台运维'" class="color-cyan">平台运维</span>
                <span v-else class="color-content">{{ scope.row.roleName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="到期时间"
            align="left"
            prop="endDate"
            sortable="custom"
            show-overflow-tooltip
            width="120"
            sort-by="endDate"
          >
            <template slot-scope="scope" class="flex align-center" style="width: 100%;">
              <div class="flex align-center" style="width: 100%;">
                <span v-if="scope.row.endDate">{{ scope.row.endDate && scope.row.endDate.split(' ')[0] }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="left" prop="expired" show-overflow-tooltip width="80">
            <template slot="header">
              <TableFiltersPopover
                :table-label="{
                  'type': 'expired',
                  'label': '状态'
                }"
                :selection-list="expiredList"
                :popover-width="'140'"
                :key-props="{
                  'code': 'value',
                  'label': 'text'
                }"
                @filter="filterChange"
              />
            </template>
            <template slot-scope="scope" class="flex align-center" style="width: 100%;">
              <div class="flex align-center" style="width: 100%;">
                <div v-if="scope.row.expired == '0'" class="flex align-center">
                  <span class="bgc-green round" style="width: 11px;height: 11px;" />
                  <span style="margin-left: 4px;">正常</span>
                </div>
                <div v-else class="flex align-center">
                  <span class="round" style="width: 11px;height: 11px;background-color:#8c8c8c;" />
                  <span style="margin-left: 4px;">过期</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            prop="操作"
            show-overflow-tooltip
            width="140"
            fixed="right"
            class-name="table-operation-container"
          >
            <template slot-scope="scope" class="flex">
              <TableOperationTooltip icon-class="table-see" tooltip-title="查看" style="margin-right: 8px;" :icon-disabled="new Date().getTime() > new Date(scope.row.endDate)" @tooltipClick="showItem(scope.row)" />
              <TableOperationTooltip
                icon-class="table-shouquan"
                tooltip-title="授权"
                style="margin-right: 8px;"
                :icon-disabled="scope.row.roleName=='超级管理员' || new Date().getTime() > new Date(scope.row.endDate)"
                @tooltipClick="authorize(scope.row)"
              />
              <TableOperationTooltip
                icon-class="table-quxiaoshouquan"
                tooltip-title="取消授权"
                style="margin-right: 8px;"
                :icon-disabled="scope.row.roleName=='超级管理员' || new Date().getTime() > new Date(scope.row.endDate)"
                @tooltipClick="cancelAuthorize(scope.row)"
              />
              <TableOperationTooltip
                icon-class="table-delete"
                tooltip-title="删除"
                :icon-disabled="!(scope.row.roleName!='超级管理员' && new Date().getTime() > new Date(scope.row.endDate))"
                @tooltipClick="del(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--分页-->
      <div
        v-if="pageItemTotal > 10"
        class="flex justify-center align-center user-pagination-container"
        style="width: 100%;height: 60px;"
      >
        <el-pagination
          background
          :page-size="pageSize"
          layout="total,prev, pager, next,sizes,jumper"
          :page-sizes="[10,20,30,40]"
          :current-page="currentPage"
          :total="pageItemTotal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <!--设置期限弹窗框-->
    <set-time-dialog
      v-if="showSetTimeDialog"
      :begin-date="selectedOne ? selectedOne.expiryTimeStart : null"
      :end-date="selectedOne ? selectedOne.expiryTimeEnd : null"
      @ok="setTimeDialogOk"
      @cancel="setTimeDialogCancel"
    />
    <!--创建用户弹框-->
    <create-user
      v-if="showCreateDialog"
      :role-list="roleList"
      @ok="createDialogOk"
      @cancel="createDialogCancel"
    />
    <!--批量创建弹框-->
    <batch-create-user
      v-if="showBatchCreateDialog"
      :role-list="roleList"
      @ok="batchCreateDialogOk"
      @cancel="batchCreateDialogCancel"
    />
    <!--删除弹框-->
    <delete-dialog
      v-if="showDeleteDialog"
      :item="selectedItem"
      @ok="deleteDialogOk"
      @cancel="deleteDialogCancel"
    />
    <!--授权弹框-->
    <authorize-dialog
      v-if="showAuthorizeDialog"
      active-tab="模型"
      :dialog-type="dialogType"
      :user-id="selectedItem.userId+''"
      :filter-model-type-list-all="modelTypeFilters"
      :filter-model-status-list-all="filterModelStatusListAll"
      :filter-data-set-type-list-all="filterDataSetTypeListAll"
      :filter-data-set-status-list-all="filterDataSetStatusListAll"
      @ok="authorizeDialogOk"
      @cancel="authorizeDialogCancel"
    />
  </div>
</template>

<script>
import { batchSetUserTime, createUser, deleteUser, getRoleList, getUserList, userRoleNumList } from '@/api/user';
import InputWithSearch from '@/components/InputWithSearch';
import _ from 'lodash';
import CreateUser from '@/views/permission-management/user-management/components/CreateUser';
import BatchCreateUser from '@/views/permission-management/user-management/components/BatchCreateUser';
import DeleteDialog from '@/views/permission-management/user-management/components/DeleteDialog';
import SetTimeDialog from '@/views/permission-management/user-management/components/SetTimeDialog';
import AuthorizeDialog from '@/views/permission-management/user-management/components/AuthorizeDialog';
import TableFiltersPopover from '@/components/TableFiltersPopover';
import TableOperationTooltip from '@/components/TableOperationTooltip';
import qs from 'qs';
import { getModelClassification } from '@/api/model';

export default {
  name: 'Index',
  components: {
    SetTimeDialog,
    DeleteDialog,
    BatchCreateUser,
    InputWithSearch,
    CreateUser,
    AuthorizeDialog,
    TableFiltersPopover,
    TableOperationTooltip
  },
  data() {
    return {
      loading: false, // 加载中
      keyword: '', // 搜索框
      pageItemTotal: 0, // 列表总数
      pageSize: 10, // 每页条数
      currentPage: 1, // 当前页码
      sortColumn: '', // 排序的列名
      sortOrder: '', // 排序方式
      selectedRoleKeyList: [], // 角色列表

      tableList: [], // 主要内容
      roleList: [], // 角色列表
      status: null,
      selectedItem: null, // 选中项
      dialogType: 'authorize',
      selectedItemList: [],
      modelTypeFilters: [],
      // 弹窗状态
      showDialog: false,
      dialogTitle: '提示',
      dialogContent: '',
      showSetTimeDialog: false, // 设置期限弹框

      showCreateDialog: false,
      showBatchCreateDialog: false,
      showDeleteDialog: false,
      showAuthorizeDialog: false,

      // 定时器
      timer: null,
      mouseFlag: false,
      mouseOffset: 0,
      selectedOne: {},
      filterDataSetTypeListAll: [
        { text: '图像', value: 'PICTURE' },
        { text: '音频', value: 'VOICE' },
        { text: '文本', value: 'TEXT' },
        { text: '表格', value: 'TABLE' },
        { text: '视频', value: 'VIDEO' }
      ], // 数据集类型筛选全部

      filterModelStatusListAll: [
        { text: '已下线', value: 'OFF_LINE' },
        { text: '已上线', value: 'ON_LINE' },
        { text: '已过期', value: 'EXPIRED' }
      ], // 模型状态全部
      filterDataSetStatusListAll: [
        { text: '已下线', value: '0' },
        { text: '已上线', value: '1' }
      ], // 模型状态全部
      expiredList: [
        { text: '正常', value: '0' },
        { text: '过期', value: '1' }
      ],
      selectedExpiredList: [], // 角色列表
      tableHeight: 0
    };
  },
  created() {
    this.init();
  },
  mounted() {
    window.addEventListener('resize', this.setTableHeight);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setTableHeight);
  },
  methods: {
    init() {
      this.loading = true;
      this.getList();
      this.getRoleList();
      this.getModelClassification();
    },
    // 获取角色列表
    getRoleList() {
      getRoleList().then(res => {
        this.roleList = res.data;
        for (let i = 0; i < this.roleList.length; i++) {
          this.roleList[i].text = this.roleList[i].roleName;
          this.roleList[i].value = this.roleList[i].roleKey;
        }
      });
    },
    // 保存选中的数据id,row-key就是要指定一个key标识这一行的数据
    getRowKey(row) {
      return row.userId;
    },
    handleSelectionChange(selectedList) {
      this.selectedItemList = selectedList;
    },
    getList: _.debounce(function() {
      const params = {
        keyword: this.keyword,
        roleKey: this.selectedRoleKeyList.join(','),
        expired: this.selectedExpiredList.join(','),
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        column: this.sortColumn,
        order: this.sortOrder
      };
      getUserList(qs.stringify(params)).then(res => {
        this.pageItemTotal = res.data.total;
        this.tableList = res.data.data;
        this.$nextTick(() => {
          this.$refs.filterTable.bodyWrapper.scrollTop = 0;
          this.setTableHeight();
        });
        this.loading = false;
      });
      this.getUserRoleNumList();
    }, 200),
    // 获取用户角色统计信息
    getUserRoleNumList() {
      const params = {
        fileId: ''
      };
      userRoleNumList(qs.stringify(params)).then(res => {
        this.status = res.data;
      });
    },
    // 搜索函数
    search: _.debounce(function(val) {
      this.keyword = val;
      this.currentPage = 1;
      this.getList();
    }, 200),
    showItem(item) {
      if (new Date().getTime() > new Date(item.endDate)) return;
      this.selectedItem = item;
      this.$router.push({
        name: 'UserManagementDetail',
        params: {
          id: this.selectedItem.userId
        }
      });
    },
    authorize(item) {
      if (item.roleName === '超级管理员' || new Date().getTime() > new Date(item.endDate)) return;
      this.selectedItem = item;
      this.dialogType = 'authorization';
      this.showAuthorizeDialog = true;
    },
    cancelAuthorize(item) {
      if (item.roleName === '超级管理员' || new Date().getTime() > new Date(item.endDate)) return;
      this.selectedItem = item;
      this.dialogType = 'cancelAuthorization';
      this.showAuthorizeDialog = true;
    },
    del(item) {
      if (!(item.roleName !== '超级管理员' && new Date().getTime() > new Date(item.endDate))) return;
      this.selectedItem = item;
      this.showDeleteDialog = true;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.loading = true;
      this.getList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.loading = true;
      this.getList();
    },
    async setTimeDialogOk(object) {
      const params = {
        limit: {}
      };
      const limit = Object.assign({}, object);
      limit.userIds = [];
      for (let i = 0; i < this.selectedItemList.length; i++) {
        limit.userIds.push(this.selectedItemList[i].userId);
      }
      params.limit = limit;
      await batchSetUserTime(params.limit).then(res => {
        if (res.data) {
          this.$message({
            type: 'success',
            message: '批量为' + this.selectedItemList.length + '个用户设置期限成功'
          });
        } else {
          this.$message({
            type: 'error',
            message: '批量为' + this.selectedItemList.length + '个用户设置期限失败'
          });
        }
      });
      this.$refs.filterTable?.clearSelection();
      this.setTimeDialogCancel();
      this.getList();
    },
    sortChange({ column, prop, order }) {
      this.sortColumn = prop;
      this.sortOrder = order;
      this.$refs.filterTable.clearSelection();
      this.getList();
    },
    setTimeDialogCancel() {
      this.showSetTimeDialog = false;
      this.selectedItem = null;
    },
    createDialogOk(params) {
      createUser(params).then(res => {
        if (res.data) {
          this.$message({
            type: 'success',
            message: '账号创建成功'
          });
        } else {
          this.$message({
            type: 'error',
            message: '账号创建失败'
          });
        }
        this.getList();
      });
      this.$refs.filterTable?.clearSelection();
      this.createDialogCancel();
    },
    createDialogCancel() {
      this.showCreateDialog = false;
      this.selectedItem = null;
    },
    batchCreateDialogOk() {
      this.batchCreateDialogCancel();
      this.loading = true;
      this.getList();
    },
    batchCreateDialogCancel() {
      this.showBatchCreateDialog = false;
      this.selectedItem = null;
    },
    async deleteDialogOk() {
      const params = {
        userId: this.selectedItem.userId
      };
      await deleteUser(qs.stringify(params)).then(res => {
        if (res.code === '000000') {
          this.$message({
            type: 'success',
            message: this.selectedItem.userName + '用户删除成功'
          });
        }
      });
      this.deleteDialogCancel();
      this.getList();
    },
    deleteDialogCancel() {
      this.showDeleteDialog = false;
      this.selectedItem = null;
    },
    authorizeDialogOk() {
      this.$refs.filterTable?.clearSelection();
      this.authorizeDialogCancel();
    },
    authorizeDialogCancel() {
      this.showAuthorizeDialog = false;
      this.selectedItem = null;
    },
    tableRowClassName({ row, rowIndex }) {
      if (this.selectedItem != null && row.userId === this.selectedItem.userId) {
        return 'selected-row';
      }
      return '';
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
      if (!this.$refs.filterTable) return;
      const divData = this.$refs.filterTable.bodyWrapper;
      if (this.mouseFlag) {
        // 设置水平方向的元素的位置
        divData.scrollLeft -= (-this.mouseOffset + (this.mouseOffset = e.clientX));
      }
    },
    // 模型类型列表
    getModelClassification() {
      getModelClassification().then(res => {
        const data = res.data;
        for (let i = 0; i < data.length; i++) {
          const obj = data[i];
          obj.text = obj.typeName;
          obj.value = obj.id;
          // typeCode
          this.modelTypeFilters.push(obj);
        }
      });
    },
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    openSetTimeDialog() {
      if (this.selectedItemList.length === 1) {
        this.selectedOne.expiryTimeStart = this.selectedItemList[0].beginDate;
        this.selectedOne.expiryTimeEnd = this.selectedItemList[0].endDate;
      } else {
        this.selectedOne = {};
      }
      this.showSetTimeDialog = true;
    },
    // 过滤角色
    filterChange(type, list) {
      if (type === 'expired') {
        this.selectedExpiredList = list;
      } else if (type === 'roleName') {
        this.selectedRoleKeyList = list;
      }
      this.currentPage = 1;
      this.$refs.filterTable?.clearSelection();
      this.getList();
    },
    // 设置表格高度，做表格滚动表头不动处理
    setTableHeight() {
      const bodyHeight = document.body.offsetHeight - 50;
      const navHeight = document.getElementById('AiHeader-container').offsetHeight;
      const topStatusHeight = document.getElementsByClassName('status-panel')[0].offsetHeight;
      const topOperationHeight = document.getElementsByClassName('operation-panel')[0].offsetHeight;
      const paginationHeight = document.getElementsByClassName('user-pagination-container')[0] ? document.getElementsByClassName('user-pagination-container')[0].offsetHeight : 0;
      this.tableHeight = bodyHeight - navHeight - topStatusHeight - topOperationHeight - paginationHeight - 64 - 16 - 16;
      const realTableHeight = this.tableList.length * 45 + 45;
      if (this.tableList.length === 0) {
        this.tableHeight = 60 + 45;
      } else {
        this.tableHeight > realTableHeight ? this.tableHeight = realTableHeight : '';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep {
  .id222 {
    .el-table .selected-row {
      background: #E4EDF8;
    }
    label{
      font-weight: 400;
    }
  }
}
</style>
