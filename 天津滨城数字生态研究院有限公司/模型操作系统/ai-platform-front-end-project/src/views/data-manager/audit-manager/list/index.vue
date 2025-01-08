<template>
  <div class="push-list">
    <div style="height: 100%;">
      <el-row type="flex" class="status-panel">
        <div>全部({{ dataStatus.online + dataStatus.audit + dataStatus.reject || 0 }})</div>
        <div style="color: #E56E0D">待审核({{ dataStatus.audit || 0 }})</div>
        <div style="color: #FD5E3A ">已驳回({{ dataStatus.reject || 0 }})</div>
        <div style="color: #00AB5A  ">已通过({{ dataStatus.online || 0 }})</div>
      </el-row>
      <div class="operation-panel">
        <div class="search-div">
          <InputWithSearch class="inline-search" :placeholder="'请输入数据集名称/申请者'" @search="handleQuery" />
        </div>
        <el-row type="flex" class="line-btn">
          <div>已选 <span style="color: #0164FF">{{ selectedList.length }}</span> 项</div>
          <el-button :disabled="passSelected" plain type="success" size="small" @click="batchPass">批量通过</el-button>
          <el-button :disabled="turnSelected" plain type="warning" size="small" @click="batchRejection">批量驳回</el-button>
          <el-button :disabled="deleteSelected" plain type="danger" size="small" @click="batchDelete">批量删除</el-button>
        </el-row>
      </div>
      <div class="table-wrapper">
        <el-table
          ref="multipleTable"
          v-loading="loading"
          border
          :data="dataList"
          :height="tableHeight"
          class="table"
          :row-key="getRowKey"
          @selection-change="handleSelectionChange"
          @sort-change="sortChange"
          @mousedown.native="mouseDownHandler"
          @mouseup.native="mouseUpHandler"
          @mousemove.native="mouseMoveHandler"
        >
          <el-table-column type="selection" width="60" align="center" :reserve-selection="true" />
          <el-table-column label="序号" type="index" width="60" :index="indexMethod" />
          <el-table-column label="审核ID" prop="id" width="100" sortable="custom" />
          <el-table-column label="数据集名称" prop="name" min-width="180" show-overflow-tooltip>
            <template v-slot="scope" class="flex justify-center align-center">
              <span class="detail-button" @click="handleView(scope.row)">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="类型"
            prop="type"
            width="100"
            show-overflow-tooltip
          >
            <template slot="header">
              <TableFiltersPopover
                :table-label="{
                  'type': 'type',
                  'label': '类型'
                }"
                :selection-list="typeOptions"
                :popover-width="'140'"
                @filter="filterChange"
              />
            </template>
            <template slot-scope="scope">
              <span>{{ typeMap[scope.row.type] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="申请时间" prop="createTime" width="160" show-overflow-tooltip sortable="custom" />
          <el-table-column label="申请者" prop="createByName" min-width="100" show-overflow-tooltip />
          <el-table-column label="样本数" prop="taskNumber" width="90" show-overflow-tooltip sortable="custom" />
          <el-table-column label="标注样本数" prop="labeledNum" width="120" show-overflow-tooltip sortable="custom" />
          <el-table-column
            label="状态"
            prop="status"
            width="120"
          >
            <template slot="header">
              <TableFiltersPopover
                :table-label="{
                  'type': 'status',
                  'label': '状态'
                }"
                :selection-list="statusOptions"
                :popover-width="'140'"
                @filter="filterChange"
              />
            </template>
            <template slot-scope="scope">
              <el-link v-if="scope.row.status === 'WAIT_JUDGE'" type="info" :underline="false">
                <i class="icon-stop icon" />待审核
              </el-link>
              <el-link v-if="scope.row.status === 'REJECT'" type="info" :underline="false">
                <i class="icon-reject icon" />已驳回
              </el-link>
              <el-link v-if="scope.row.status === 'ON_LINE'" type="info" :underline="false">
                <i class="icon-online icon" />已通过
              </el-link>
            </template>
          </el-table-column>
          <el-table-column label="审核者" prop="judgeUserName" min-width="100" show-overflow-tooltip />
          <el-table-column label="审核意见" prop="remark" min-width="100" show-overflow-tooltip />
          <el-table-column
            label="操作"
            align="center"
            class-name="fixed-width table-operation-container"
            width="110"
            fixed="right"
          >
            <template v-slot="scope" class="flex">
              <TableOperationTooltip icon-class="table-see" tooltip-title="查看" style="margin-right: 8px;" @tooltipClick="handleView(scope.row)" />
              <TableOperationTooltip icon-class="table-zhongcareful" tooltip-title="审核" style="margin-right: 8px;" :icon-disabled="scope.row.status !== 'WAIT_JUDGE'" @tooltipClick="handleCheck(scope.row)" />
              <TableOperationTooltip icon-class="table-delete" tooltip-title="删除" :icon-disabled="scope.row.status !== 'ON_LINE' && scope.row.status !== 'REJECT'" @tooltipClick="handleDelete(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
        <div v-show="total > pageSize" class="flex justify-center align-center push-pagination-container" style="width: 100%;height: 60px;">
          <el-pagination
            background
            :page-size="pageSize"
            layout="total,prev, pager, next,sizes,jumper"
            :page-sizes="[10, 20, 50]"
            :current-page="currentPage"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <!--批量操作和上线模型，下线模型弹窗-->
    <dialog-ok
      v-if="ShowDialogOk"
      :title="dialogTitle"
      :content="dialogContent"
      :width="'400px'"
      @ok="dialogOk"
      @cancel="dialogCancel"
    />
    <audit-dialog
      v-if="showCheckDialog"
      @ok="auditOk"
      @reject="auditReject"
      @cancel="auditCancel"
    />
  </div>
</template>

<script>
import _debounce from 'lodash/debounce';
import DialogOk from '@/components/DialogOk';
import InputWithSearch from '@/components/InputWithSearch';
import TableFiltersPopover from '@/components/TableFiltersPopover';
import TableOperationTooltip from '@/components/TableOperationTooltip';
import {
  batchDelete,
  batchPass,
  batchReject,
  dataCheckDelete,
  dataCheckPass,
  dataCheckReject,
  getDataCheckList, getDataCheckStatistics
} from '@/api/data-check';
import AuditDialog from '@/views/data-manager/components/audit-dialog';

export default {
  name: 'Index',
  components: {
    DialogOk,
    InputWithSearch,
    AuditDialog,
    TableFiltersPopover,
    TableOperationTooltip
  },
  data() {
    return {
      isHasList: true,
      dataStatus: {},
      showCheckDialog: false, // 审核
      currentPage: 1,
      searchName: '',
      loading: false,
      dataList: [], // 审核列表
      total: 0,
      ShowDialogOk: false,
      dialogTitle: '',
      dialogContent: '',
      pageSize: 10,
      selectedList: [], // 多选列表
      selectedDataId: -1, // 查看，初审，终审对应的模型id
      status: '',
      turnSelected: true,
      passSelected: true,
      deleteSelected: true,
      typeMap: {
        PICTURE: '图像',
        TEXT: '文本',
        VIDEO: '视频',
        VOICE: '音频',
        TABLE: '表格'
      },
      typeOptions: [
        { code: 'PICTURE', label: '图像' },
        { code: 'TEXT', label: '文本' },
        { code: 'VIDEO', label: '视频' },
        { code: 'VOICE', label: '音频' },
        { code: 'TABLE', label: '表格' }
      ],
      statusOptions: [
        { code: 'WAIT_JUDGE', label: '待审核' },
        { code: 'REJECT', label: '已驳回' },
        { code: 'ON_LINE', label: '已通过' }
      ],
      mouseFlag: false,
      mouseOffset: 0,
      statusList: [],
      typeList: [],
      sortColumn: '', // 排序的列名
      sortOrder: '', // 排序方式
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
    // 表格鼠标按下滚动 结束
    init() {
      this.getDataStatusStatistics();
      this.getDataList();
      this.handleSelectionChange([]);
      this.$refs.multipleTable?.clearSelection();
    },
    getDataStatusStatistics() {
      getDataCheckStatistics().then(res => {
        this.dataStatus = res.data;
      });
    },

    /** 搜索按钮操作 */
    handleQuery(value) {
      this.currentPage = 1;
      this.searchName = value;
      this.getDataList();
    },
    sortChange({ column, prop, order }) {
      this.sortColumn = prop;
      this.sortOrder = order;
      this.$refs.multipleTable.clearSelection();
      this.getDataList();
    },
    getDataList() {
      this.loading = true;
      const params = {
        name: this.searchName,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        statusList: this.statusList,
        typeList: this.typeList,
        column: this.sortColumn,
        order: this.sortOrder
      };
      getDataCheckList(params).then(res => {
        this.dataList = res.data.records;
        this.total = res.data.total;
        this.loading = false;
        this.$nextTick(() => {
          this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
          this.setTableHeight();
        });
      }).catch(() => {
        this.loading = false;
      });
    },
    batchRejection() {
      this.dialogTitle = '批量驳回';
      this.dialogContent = '';
      this.ShowDialogOk = true;
    },
    batchPass() {
      this.dialogTitle = '批量通过';
      this.dialogContent = '';
      this.ShowDialogOk = true;
    },
    batchDelete() {
      this.dialogTitle = '批量删除';
      this.dialogContent = '';
      this.ShowDialogOk = true;
    },
    handleCheck(data) {
      if (data.status !== 'WAIT_JUDGE') return;
      this.selectedDataId = data.id;
      this.dialogTitle = '审核数据集';
      this.dialogContent = data.name;
      this.showCheckDialog = true;
    },
    handleDelete(data) {
      if (data.status !== 'ON_LINE' && data.status !== 'REJECT') return;
      this.selectedDataId = data.id;
      this.dialogTitle = '删除数据集';
      this.dialogContent = data.name;
      this.ShowDialogOk = true;
    },

    handleView(data) {
      this.$router.push({ path: `/data-manager/audit/al-type-list/${data.id}/audit` });
    },
    auditOk(val) {
      const _this = this;
      const params = {
        applyId: this.selectedDataId,
        remark: val || ''
      };
      dataCheckPass(params).then(res => {
        if (res.code === '000000') {
          _this.$message({
            message: _this.dialogTitle + '成功!',
            type: 'success'
          });
          _this.auditCancel();
          this.$router.push({ path: `/data-manager/audit/list` });
          _this.init();
        } else {
          _this.$message({
            message: _this.dialogTitle + '失败!',
            type: 'error'
          });
          this.auditCancel();
          _this.init();
        }
      });
    },
    auditReject(val) {
      const _this = this;
      const params = {
        applyId: this.selectedDataId,
        remark: val || ''
      };
      dataCheckReject(params).then(res => {
        if (res.code === '000000') {
          _this.$message({
            message: _this.dialogTitle + '成功!',
            type: 'success'
          });
          _this.auditCancel();
          _this.init();
        } else {
          _this.$message({
            message: _this.dialogTitle + '失败!',
            type: 'error'
          });
          this.auditCancel();
        }
      });
    },
    auditCancel() {
      this.showCheckDialog = false;
    },
    dialogOk: _debounce(function() {
      const _this = this;
      const params = {
        ids: []
      };
      for (let i = 0; i < this.selectedList.length; i++) {
        params.ids.push(this.selectedList[i].id);
      }
      if (this.dialogTitle === '批量驳回') {
        batchReject(params).then(res => {
          if (res.code === '000000') {
            _this.$message({
              message: _this.dialogTitle + '成功!',
              type: 'success'
            });
            _this.dialogCancel();
            _this.init();
          } else {
            _this.$message({
              message: _this.dialogTitle + '失败!',
              type: 'error'
            });
            _this.dialogCancel();
          }
        });
      } else if (this.dialogTitle === '批量通过') {
        batchPass(params).then(res => {
          if (res.code === '000000') {
            _this.$message({
              message: _this.dialogTitle + '成功!',
              type: 'success'
            });
            _this.dialogCancel();
            _this.init();
          } else {
            _this.$message({
              message: _this.dialogTitle + '失败!',
              type: 'error'
            });
            _this.dialogCancel();
          }
        });
      } else if (this.dialogTitle === '批量删除') {
        batchDelete(params).then(res => {
          if (res.code === '000000') {
            _this.$message({
              message: _this.dialogTitle + '成功!',
              type: 'success'
            });
            _this.dialogCancel();
            _this.init();
          } else {
            _this.$message({
              message: _this.dialogTitle + '失败!',
              type: 'error'
            });
            _this.dialogCancel();
          }
        });
      } else if (this.dialogTitle === '删除数据集') {
        dataCheckDelete(this.selectedDataId).then(res => {
          if (res.code === '000000') {
            _this.$message({
              message: _this.dialogTitle + '成功!',
              type: 'success'
            });
            _this.dialogCancel();
            _this.init();
          } else {
            _this.$message({
              message: _this.dialogTitle + '失败!',
              type: 'error'
            });
            _this.dialogCancel();
          }
        });
      }
    }, 300),
    dialogCancel() {
      this.ShowDialogOk = false;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getDataList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDataList();
    },
    handleSelectionChange(val) {
      this.selectedList = val;
      if (val.length !== 0) {
        this.turnSelected = !val.every(item => item.status === 'WAIT_JUDGE');
        this.passSelected = !val.every(item => item.status === 'WAIT_JUDGE');
        this.deleteSelected = !val.every(item => item.status === 'REJECT' || item.status === 'ON_LINE');
      } else {
        this.deleteSelected = this.passSelected = this.turnSelected = true;
      }
    },
    // 保存选中的数据id,row-key就是要指定一个key标识这一行的数据
    getRowKey(row) {
      return row.id;
    },
    filterChange(type, list) {
      if (type === 'type') {
        this.typeList = list;
      } else if (type === 'status') {
        this.statusList = list;
      }
      this.$refs.multipleTable?.clearSelection();
      this.currentPage = 1;
      this.getDataList();
    },
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    // 设置表格高度，做表格滚动表头不动处理
    setTableHeight() {
      const bodyHeight = document.body.offsetHeight - 50;
      const navHeight = document.getElementById('AiHeader-container').offsetHeight;
      const topStatusHeight = document.getElementsByClassName('status-panel')[0].offsetHeight;
      const topOperationHeight = document.getElementsByClassName('operation-panel')[0].offsetHeight;
      const paginationHeight = document.getElementsByClassName('push-pagination-container')[0] ? document.getElementsByClassName('push-pagination-container')[0].offsetHeight : 0;
      this.tableHeight = bodyHeight - navHeight - topStatusHeight - topOperationHeight - paginationHeight - 64 - 16 - 16;
      const realTableHeight = this.dataList.length * 45 + 45;
      if (this.dataList.length === 0) {
        this.tableHeight = 60 + 45;
      } else {
        this.tableHeight > realTableHeight ? this.tableHeight = realTableHeight : '';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.push-list{
  margin: 16px;
  padding: 24px 24px 0 24px;
  background: white;
  min-height: calc(100vh - 142px);
  .status-panel{
    font-size: 14px;
    >div{
      margin-right: 50px;
    }
  }
  .operation-panel{
    display: flex;
    justify-content: space-between;
    margin: 8px 0;
    ::v-deep{
      .line-btn{
        display: flex;
        align-items: center;
        .el-button--warning.is-plain,.el-button--success.is-plain, .el-button--danger.is-plain{
          background: white;
        }
        .el-button--warning.is-plain:hover{
          background: #e6a23c;
        }
        .el-button--warning.is-plain:focus{
          color: #e6a23c;
        }
        .el-button--success.is-plain:hover{
          background: #00AB5A;
        }
        .el-button--success.is-plain:focus{
          color: #00AB5A;
        }
        .el-button--danger.is-plain:hover{
          background: #FD5E3A;
        }
        .el-button--danger.is-plain:focus{
          color: #FD5E3A;
        }
        .el-button--warning.is-plain:active,
        .el-button--success.is-plain:active,
        .el-button--danger.is-plain:active{
          color: white;
        }
        .el-button--warning.is-plain.is-disabled,
        .el-button--success.is-plain.is-disabled,
        .el-button--danger.is-plain.is-disabled{
          background-color: white;
        }
        >div{
          margin: 0 24px;
          font-size: 14px;
          color: #909399;
        }
      }
    }
  }
  .table-wrapper{
    width: 100%;
    height: calc(100% - 60px);
    .icon{
      margin-right: 4px;
    }
    .icon-stop {
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: #E56E0D;
      display: inline-block;
    }
    .icon-offline{
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: #8C8C8C;
      display: inline-block;
    }
    .icon-reject{
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: #FD5E3A;
      display: inline-block;
    }
    .icon-online{
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: #00AB5A;
      display: inline-block;
    }
    .detail-button {
      cursor: pointer;
      font-weight: 400;
      &:hover {
        color: #0164FF;
      }
    }

  }
  .empty{
    margin-top: 20vh;
  }
}
.inline-search {
  width: 300px;
}
</style>
