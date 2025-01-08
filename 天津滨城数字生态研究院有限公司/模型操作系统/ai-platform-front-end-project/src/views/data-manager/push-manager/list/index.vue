<template>
  <div class="push-list">
    <div style="height: 100%;">
      <el-row type="flex" class="status-panel">
        <div>全部({{ dataStatus.online + dataStatus.offline || 0 }})</div>
        <div style="color: #00AB5A">已上线({{ dataStatus.online || 0 }})</div>
        <div style="color: #0164FF">已下线({{ dataStatus.offline || 0 }})</div>
      </el-row>
      <div class="operation-panel">
        <div class="search-div">
          <InputWithSearch class="inline-search" :placeholder="'请输入数据集名称'" @search="handleQuery" />
        </div>
        <el-row type="flex" class="line-btn">
          <div>已选 <span style="color: #0164FF">{{ selectedList.length }}</span> 项</div>
          <el-button :disabled="onlineSelected" plain type="success" size="small" @click="batchOnline">批量上线</el-button>
          <el-button :disabled="offlineSelected" plain type="warning" size="small" @click="batchOffline">批量下线</el-button>
          <el-button :disabled="turnSelected" plain type="danger" size="small" @click="batchDelete">批量删除</el-button>
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
          <el-table-column label="ID" prop="id" width="80" sortable="custom" />
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
          <el-table-column label="创建者" prop="applyName" min-width="100" show-overflow-tooltip />
          <el-table-column label="样本数" prop="taskNumber" width="90" show-overflow-tooltip sortable="custom" />
          <el-table-column label="标注样本数" prop="labeledNum" width="120" show-overflow-tooltip sortable="custom" />
          <el-table-column
            label="状态"
            prop="isOnline"
            width="120"
          >
            <template slot="header">
              <TableFiltersPopover
                :table-label="{
                  'type': 'isOnline',
                  'label': '状态'
                }"
                :selection-list="statusOptions"
                :popover-width="'140'"
                @filter="filterChange"
              />
            </template>
            <template slot-scope="scope">
              <el-link v-if="scope.row.isOnline === 1" type="info" :underline="false">
                <i class="icon-offline icon" />已下线
              </el-link>
              <el-link v-if="scope.row.isOnline === 0" type="info" :underline="false">
                <i class="icon-online icon" />已上线
              </el-link>
              <el-link v-if="scope.row.isOnline === 2" type="info" :underline="false">
                <i class="icon-ondeal icon" />处理中
              </el-link>
              <el-link v-if="scope.row.isOnline === 3" type="info" :underline="false">
                <i class="icon-onerror icon" />已失败
              </el-link>
            </template>
          </el-table-column>
          <el-table-column label="发布时间" prop="releaseTime" width="160" show-overflow-tooltip sortable="custom" />
          <el-table-column label="审核者" prop="judgeUserName" min-width="100" show-overflow-tooltip />
          <el-table-column
            label="操作"
            align="center"
            class-name="fixed-width table-operation-container"
            width="170"
            fixed="right"
          >
            <template v-slot="scope" class="flex">
              <TableOperationTooltip icon-class="table-see" tooltip-title="查看" :icon-disabled="scope.row.isOnline === 2" style="margin-right: 8px;" @tooltipClick="handleView(scope.row)" />
              <TableOperationTooltip icon-class="table-edit" tooltip-title="编辑" :icon-disabled="scope.row.isOnline === 2" style="margin-right: 8px;" @tooltipClick="handleEdit(scope.row)" />
              <TableOperationTooltip icon-class="table-goonline" tooltip-title="上线" :icon-disabled="scope.row.isOnline !== 1 && scope.row.isOnline !== 3" style="margin-right: 8px;" @tooltipClick="handleOnline(scope.row)" />
              <TableOperationTooltip icon-class="table-offline" tooltip-title="下线" :icon-disabled="scope.row.isOnline !== 0" style="margin-right: 8px;" @tooltipClick="handleOffline(scope.row)" />
              <TableOperationTooltip icon-class="table-delete" tooltip-title="删除" :icon-disabled="scope.row.isOnline === 0 || scope.row.isOnline === 2" @tooltipClick="handleDelete(scope.row)" />
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
    <line-dialog
      v-if="showLineDialog"
      :title="dialogTitle"
      :width="'400px'"
      @ok="lineOk"
      @cancel="lineDialogCancel"
    />
    <DetailDialog
      v-if="isShowDetailDialog"
      ref="detailDialogEL"
      :state="detailDialogState"
      :detail-form.sync="dataSetDetail"
      @save="saveDataSet"
      @cancel="cancelSave"
    />
  </div>
</template>

<script>
import _debounce from 'lodash/debounce';
import InputWithSearch from '@/components/InputWithSearch';
import DetailDialog from '@/views/data-manager/dataSet/components/DetailDialog';
import TableFiltersPopover from '@/components/TableFiltersPopover';
import TableOperationTooltip from '@/components/TableOperationTooltip';
import {
  batchDelete,
  batchOffline,
  batchOnline, dataSetDelete,
  dataSetOffline, dataSetOnline, dataSetUpdate,
  getDataPushList,
  getDataPushStatistics
} from '@/api/data-push';
import lineDialog from '@/views/data-manager/components/line-dialog';
import dialogOk from '@/components/DialogOk';

export default {
  name: 'Index',
  components: {
    lineDialog,
    dialogOk,
    InputWithSearch,
    DetailDialog,
    TableFiltersPopover,
    TableOperationTooltip
  },
  data() {
    return {
      dataStatus: {},
      currentPage: 1,
      searchName: '',
      loading: false,
      dataList: [], // 数据上线列表
      total: 0,
      ShowDialogOk: false,
      showLineDialog: false,
      dialogTitle: '',
      dialogContent: '',
      pageSize: 10,
      selectedList: [], // 多选列表
      selectedDataId: -1, // 查看，上线，下线对应的数据id
      status: '',
      turnSelected: true,
      onlineSelected: true,
      offlineSelected: true,
      isShowDetailDialog: false, // 详情弹框显隐
      dataSetDetail: {
        id: '',
        name: '',
        type: '',
        description: ''
      }, //  详情弹数据
      detailDialogState: 'edit', // 详情弹框状态
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
        { code: '0', label: '已上线' },
        { code: '1', label: '已下线' },
        { code: '2', label: '处理中' },
        { code: '3', label: '已失败' }
      ],
      mouseFlag: false,
      mouseOffset: 0,
      statusList: [],
      typeList: [],
      sortColumn: '', // 排序的列名
      sortOrder: '', // 排序方式
      tableHeight: 0,
      listInterval: null
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
    clearInterval(this.listInterval);
    this.listInterval = null;
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
      this.getDataPushStatistics();
      this.getDataPushList();
      this.handleSelectionChange([]);
      this.$refs.multipleTable?.clearSelection();
    },
    getDataPushStatistics() {
      getDataPushStatistics().then(res => {
        this.dataStatus = res.data;
      });
    },
    /** 搜索按钮操作 */
    handleQuery(value) {
      this.currentPage = 1;
      this.searchName = value;
      this.getDataPushList();
    },
    sortChange({ column, prop, order }) {
      this.sortColumn = prop;
      this.sortOrder = order;
      this.$refs.multipleTable.clearSelection();
      this.getDataPushList();
    },
    getDataPushList() {
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
      getDataPushList(params).then(res => {
        if (res.code === '000000') {
          this.dataList = res.data.records;
          this.total = res.data.total;
          this.loading = false;
          this.$nextTick(() => {
            this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
            this.setTableHeight();
          });
          const index = res.data.records.findIndex(item => { return item.isOnline === 2; });
          if (index >= 0) {
            if (this.listInterval) return;
            this.listInterval = setInterval(() => {
              this.getDataPushList();
            }, 5000);
          } else {
            clearInterval(this.listInterval);
            this.listInterval = null;
          }
        } else {
          this.dataList = [];
          this.loading = false;
          clearInterval(this.listInterval);
          this.listInterval = null;
        }
      }).catch(() => {
        this.loading = false;
        clearInterval(this.listInterval);
        this.listInterval = null;
      });
    },
    batchOnline() {
      this.dialogTitle = '批量上线';
      this.dialogContent = '';
      this.showLineDialog = true;
    },
    batchOffline() {
      this.dialogTitle = '批量下线';
      this.dialogContent = '';
      this.showLineDialog = true;
    },
    batchDelete() {
      this.dialogTitle = '批量删除';
      this.dialogContent = '';
      this.showLineDialog = true;
    },

    handleEdit(data) {
      if (data.isOnline === 2) return;
      const { id, name, type, description } = data;
      this.dataSetDetail = { id, name, type, description };
      this.isShowDetailDialog = true;
      this.detailDialogState = 'edit';
    },
    handleOnline(data) {
      if (data.isOnline !== 1 && data.isOnline !== 3) return;
      this.selectedDataId = data.id;
      this.dialogTitle = '上线数据集';
      this.dialogContent = data.name;
      this.ShowDialogOk = true;
    },
    handleOffline(data) {
      if (data.isOnline !== 0) return;
      this.selectedDataId = data.id;
      this.dialogTitle = '下线数据集';
      this.dialogContent = data.name;
      this.ShowDialogOk = true;
    },
    handleDelete(data) {
      if (data.isOnline === 0 || data.isOnline === 2) return;
      this.selectedDataId = data.id;
      this.dialogTitle = '删除数据集';
      this.dialogContent = data.name;
      this.ShowDialogOk = true;
    },
    dialogOk: _debounce(function(val) {
      const _this = this;
      const params = {
        applyId: this.selectedDataId,
        remark: val || ''
      };
      if (this.dialogTitle === '上线数据集') {
        dataSetOnline(params).then(res => {
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
      } else if (this.dialogTitle === '下线数据集') {
        dataSetOffline(params).then(res => {
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
        dataSetDelete(this.selectedDataId).then(res => {
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
    }),
    handleView(data) {
      if (data.isOnline === 2) return;
      this.$router.push({ path: `/data-manager/push/al-type-list/${data.id}/push` });
    },
    lineOk: _debounce(function() {
      const _this = this;
      const params = {
        ids: []
      };
      for (let i = 0; i < this.selectedList.length; i++) {
        params.ids.push(this.selectedList[i].id);
      }
      if (this.dialogTitle === '批量删除') {
        batchDelete(params).then(res => {
          if (res.code === '000000') {
            _this.$message({
              message: _this.dialogTitle + '成功!',
              type: 'success'
            });
            _this.lineDialogCancel();
            _this.init();
          } else {
            _this.$message({
              message: _this.dialogTitle + '失败!',
              type: 'error'
            });
            _this.lineDialogCancel();
          }
        });
      } else if (this.dialogTitle === '批量上线') {
        batchOnline(params).then(res => {
          if (res.code === '000000') {
            _this.$message({
              message: _this.dialogTitle + '成功!',
              type: 'success'
            });
            _this.lineDialogCancel();
            _this.init();
          } else {
            _this.$message({
              message: _this.dialogTitle + '失败!',
              type: 'error'
            });
            _this.lineDialogCancel();
          }
        });
      } else if (this.dialogTitle === '批量下线') {
        batchOffline(params).then(res => {
          if (res.code === '000000') {
            _this.$message({
              message: _this.dialogTitle + '成功!',
              type: 'success'
            });
            _this.lineDialogCancel();
            _this.init();
          } else {
            _this.$message({
              message: _this.dialogTitle + '失败!',
              type: 'error'
            });
            _this.lineDialogCancel();
          }
        });
      }
    }, 300),
    dialogCancel() {
      this.ShowDialogOk = false;
    },
    lineDialogCancel() {
      this.showLineDialog = false;
    },
    // 保存数据集
    saveDataSet(value) {
      const _this = this;
      if (this.detailDialogState === 'edit') {
        const params = {
          'id': value.id,
          'name': value.name,
          'status': value.type,
          'description': value.description
        };
        dataSetUpdate(params).then(res => {
          this.isShowDetailDialog = false;
          if (res.code === '000000') {
            _this.$message({
              message: _this.dialogTitle + '成功!',
              type: 'success'
            });
            _this.cancelSave();
            _this.init();
          } else {
            _this.$message({
              message: _this.dialogTitle + '失败!',
              type: 'error'
            });
            _this.cancelSave();
          }
        });
      } else {
        // 编辑
        this.isShowDetailDialog = false;
      }
    },
    // 取消保存
    cancelSave() {
      this.isShowDetailDialog = false;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getDataPushList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDataPushList();
    },
    handleSelectionChange(val) {
      this.selectedList = val;
      if (val.length !== 0) {
        this.offlineSelected = !val.every(item => item.isOnline === 0);
        this.onlineSelected = !val.every(item => item.isOnline === 1);
        this.turnSelected = !val.every(item => item.isOnline === 1);
      } else {
        this.offlineSelected = this.onlineSelected = this.turnSelected = true;
      }
    },
    // 保存选中的数据id,row-key就是要指定一个key标识这一行的数据
    getRowKey(row) {
      return row.id;
    },
    filterChange(type, list) {
      if (type === 'type') {
        this.typeList = list;
      } else if (type === 'isOnline') {
        this.statusList = list;
      }
      this.currentPage = 1;
      this.$refs.multipleTable?.clearSelection();
      this.getDataPushList();
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
  padding: 24px;
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
    .icon-offline{
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: #8C8C8C;
      display: inline-block;
    }
    .icon-online{
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: #00AB5A;
      display: inline-block;
    }
    .icon-ondeal {
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: #E56E0D;
      display: inline-block;
    }
    .icon-onerror {
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: #FD5E3A;
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
</style>
