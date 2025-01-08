<template>
  <!--最外层-->
  <div class="flex flex-direction model-comparison-list-container bgc-main">
    <div class="flex flex-direction flex-1 model-comparison-list-container">
      <el-row>
        <div class="model-comparison-title-container">
          模型对比
        </div>
        <InputWithSearch class="inline-search" :placeholder="'请输入任务名称'" @search="searchList" />
        <el-button class="blue-btn create-button" @click="createTask">创建任务</el-button>
      </el-row>
      <div class="model-comparison-table-container">
        <div class="model-comparison-table-detail-container">
          <el-table
            ref="multipleTable"
            v-loading="loading"
            :data="taskList"
            :height="tableHeight"
            border
            @sort-change="sortChange"
            @mousedown.native="mouseDownHandler"
            @mouseup.native="mouseUpHandler"
            @mousemove.native="mouseMoveHandler"
          >
            <el-table-column label="序号" type="index" show-overflow-tooltip width="80" :index="indexMethod" />
            <el-table-column label="ID" prop="id" show-overflow-tooltip width="80" sortable="custom" />
            <el-table-column
              label="任务名称"
              prop="jobName"
              show-overflow-tooltip
              min-width="120"
            >
              <template slot-scope="scope">
                <span class="detail-button" @click="goEvaluationResult(scope.row)">{{ scope.row.jobName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建者" prop="createUser.nickName" show-overflow-tooltip width="150" />
            <el-table-column label="状态" prop="status" show-overflow-tooltip width="150">
              <template slot="header">
                <TableFiltersPopover
                  :table-label="{
                    'type': 'status',
                    'label': '状态'
                  }"
                  :selection-list="statusList"
                  :popover-width="'140'"
                  @filter="filterChange"
                />
              </template>
              <template slot-scope="scope">
                <i v-if="scope.row.status === 'COMPARING'" style="color: #0164FF" class="el-icon-loading" />
                <i v-else-if="scope.row.status === 'STOPED'" class="icon-stop" />
                <i v-else-if="scope.row.status === 'COMPLETED'" class="icon-end" />
                <i v-else-if="scope.row.status === 'FAILED'" class="icon-fail" />
                {{ scope.row.status | filter_status(statusList) }}
              </template>
            </el-table-column>
            <el-table-column label="耗时" prop="costTime" show-overflow-tooltip width="120">
              <template slot-scope="scope">{{ scope.row.costTime?scope.row.costTime : '-' }}
              </template>
            </el-table-column>
            <el-table-column label="完成时间" prop="updateTime" show-overflow-tooltip sortable="custom" width="180" />
            <el-table-column label="操作" align="center" width="140" fixed="right" class-name="table-operation-container">
              <template slot-scope="scope">
                <TableOperationTooltip icon-class="table-stop" tooltip-title="停止" style="margin-right: 8px;" :icon-disabled="scope.row.status !== 'COMPARING'" @tooltipClick="stopEvaluation(scope.row)" />
                <TableOperationTooltip icon-class="table-restart" tooltip-title="开始" style="margin-right: 8px;" :icon-disabled="scope.row.status !== 'STOPED'" @tooltipClick="startEvaluation(scope.row)" />
                <TableOperationTooltip icon-class="table-result" tooltip-title="结果" style="margin-right: 8px;" :icon-disabled="scope.row.status !== 'COMPLETED'" @tooltipClick="goEvaluationResult(scope.row)" />
                <TableOperationTooltip icon-class="table-delete" tooltip-title="删除" :icon-disabled="scope.row.status === 'COMPARING'" @tooltipClick="deleteDetail(scope.row)" />
              </template>
            </el-table-column>
          </el-table>
          <div v-show="total > 10" class="flex justify-center align-center"
               style="width: 100%;height: 60px;">
            <el-pagination
              background
              :page-size="pageSize"
              layout="total,prev, pager, next,sizes,jumper"
              :page-sizes="[10, 20, 50]"
              :current-page="currentPage"
              :total="total"
              @size-change="changePageSize"
              @current-change="changeCurrentPage"
            />
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      v-if="isShowStopEvaluationDialog"
      v-dialogDrag
      visible
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="400px"
      title="提示"
      :custom-class="'stop-dialog'"
      append-to-body
      :before-close="dialogCancel"
    >
      <div>是否停止对比</div>
      <div slot="footer" class="dialog-footer">
        <el-button class="white-btn" @click="dialogCancel">取 消</el-button>
        <el-button class="blue-btn" @click="dialogOk">确 定</el-button>
      </div>
    </el-dialog>
    <MessageDialog
      v-if="isShowMessageDialog"
      :title="messageTitle"
      @save="saveMessage"
      @cancel="cancelMessage"
    >
      <template slot="content">
        <div class="content-container" v-html="messageContent" />
      </template>
    </MessageDialog>
  </div>
</template>

<script>
import { getTaskList, startTask, stopTask, deleteTask } from '@/api/model-comparison';
import InputWithSearch from '@/components/InputWithSearch';
import MessageDialog from '@/views/data-manager/dataSet/components/MessageDialog';
import TableFiltersPopover from '@/components/TableFiltersPopover';
import TableOperationTooltip from '@/components/TableOperationTooltip';

export default {
  filters: {
    filter_status(value, list) {
      const typeArr = list.find((item) => item.code === value);
      return typeArr ? typeArr.label : '';
    }
  },
  components: {
    InputWithSearch,
    MessageDialog,
    TableFiltersPopover,
    TableOperationTooltip
  },
  data() {
    return {
      taskList: [],
      loading: false,
      isShowStopEvaluationDialog: false,
      stopTask: null,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      statusList: [
        { code: 'COMPARING', label: '进行中' },
        { code: 'STOPED', label: '已停止' },
        { code: 'FAILED', label: '失败' },
        { code: 'COMPLETED', label: '已完成' }
      ],
      listInterval: null,
      searchWord: '',
      mouseFlag: false,
      mouseOffset: 0,
      isShowMessageDialog: false, // 信息提示框显隐
      messageTitle: '', // 信息提示框标题
      messageContent: '', // 信息提示框内容
      currentRow: null,
      selectStatusList: [],
      sortColumn: '', // 排序的列名
      sortOrder: '', // 排序方式
      tableHeight: 0
    };
  },
  mounted() {
    this.loading = true;
    window.addEventListener('resize', this.setTableHeight);
    this.getTaskList();
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
    // 打开停止对比提示弹框
    stopEvaluation(item) {
      if (item.status !== 'COMPARING') return;
      this.isShowStopEvaluationDialog = true;
      this.stopTask = item;
    },
    // 停止对比提示弹框-确定
    dialogOk() {
      stopTask(this.stopTask).then(res => {
        this.$message({
          type: 'success',
          message: '停止评估成功!'
        });
        this.dialogCancel();
        this.getTaskList();
      });
    },
    // 停止对比提示弹框-取消
    dialogCancel() {
      this.isShowStopEvaluationDialog = false;
    },
    // 开始对比
    startEvaluation(item) {
      if (item.status !== 'STOPED') return;
      startTask(item).then(res => {
        this.$message({
          type: 'success',
          message: '开始评估成功!'
        });
        this.getTaskList();
      });
    },
    // 创建任务
    createTask() {
      this.$router.push('/model-manager/comparison/create');
    },
    // 点击名称
    goEvaluationResult(row) {
      if (row.status !== 'COMPLETED') return;
      window.open(`/model-manager/comparison/result/${row.id}`, '_blank');
      // this.$router.push(`/model-manager/comparison/result/${row.id}`);
      // else {
      //   this.$message.info('尚未得到对比结果，请勿重复点击');
      // }
    },
    searchList(value) {
      this.searchWord = value;
      this.changeCurrentPage(1);
    },
    sortChange({ column, prop, order }) {
      this.sortColumn = prop;
      this.sortOrder = order;
      this.getTaskList();
    },
    // 获取任务列表
    getTaskList() {
      const pageParams = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        jobName: this.searchWord,
        statusList: this.selectStatusList,
        column: this.sortColumn,
        order: this.sortOrder
      };
      this.loading = true
      getTaskList(pageParams).then(res => {
        if (res.code === '000000') {
          this.total = res.data.total;
          this.$nextTick(() => {
            this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
            this.setTableHeight();
          });
          if (
            this.total > 0 &&
            res.data.records.length === 0 &&
            this.currentPage > 1
          ) {
            this.currentPage--;
            this.getTaskList();
          }
          this.taskList = res.data.records;
          this.loading = false;
          const index = res.data.records.findIndex(item => { return item.status === 'COMPARING'; });
          if (index >= 0) {
            if (this.listInterval) return;
            this.listInterval = setInterval(() => {
              this.getTaskList();
            }, 5000);
          } else {
            clearInterval(this.listInterval);
            this.listInterval = null;
          }
        } else {
          this.taskList = [];
          this.loading = false;
          clearInterval(this.listInterval);
          this.listInterval = null;
        }
      }).catch(() => {
        this.taskList = [];
        this.loading = false;
        clearInterval(this.listInterval);
        this.listInterval = null;
      });
    },
    // 每页选择
    changePageSize(value) {
      this.pageSize = value;
      this.currentPage = 1;
      this.getTaskList();
    },
    // 分页
    changeCurrentPage(value) {
      this.currentPage = value;
      this.getTaskList();
    },
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    // 删除
    deleteDetail(row) {
      if (row.status === 'COMPARING') return;
      this.isShowMessageDialog = true;
      this.messageTitle = '删除 ';
      this.currentRow = row;
      this.messageContent = `确定删除模型对比任务<span class="label-color">&nbsp;&nbsp;${row.jobName}&nbsp;&nbsp;</span>吗?`;
    },
    saveMessage() {
      deleteTask(this.currentRow).then(res => {
        if (res.code === '000000') {
          this.$message.success('删除成功');
          this.isShowMessageDialog = false;
          this.getTaskList();
        }
      });
    },
    cancelMessage() {
      this.isShowMessageDialog = false;
    },
    filterChange(type, list) {
      this.selectStatusList = list;
      this.currentPage = 1;
      this.getTaskList();
    },
    // 设置表格高度，做表格滚动表头不动处理
    setTableHeight() {
      const bodyHeight = document.body.offsetHeight - 50 - 32;
      const navHeight = document.getElementById('AiHeader-container').offsetHeight;
      const topOperationHeight = document.getElementsByClassName('model-comparison-title-container')[0].offsetHeight;
      const paginationHeight = document.getElementsByClassName('model-comparison-pagination-container')[0] ? document.getElementsByClassName('model-comparison-pagination-container')[0].offsetHeight : 0;
      this.tableHeight = bodyHeight - navHeight - topOperationHeight - paginationHeight - 32 - 16 - 12 - 24;
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
.model-comparison-list-container {
  width: 100%;
  height: 100%;
  padding: 16px 16px 0 16px;
  .model-comparison-list-container {
    width: 100%;
    padding: 16px 24px 0;
    background: #ffffff;
    height: calc(100vh - var(--header-height) - 32px);
    .model-comparison-title-container {
      line-height: 34px;
      font-size: 16px;
      color: #646464;
      font-weight: 700;
      display: inline-block;
    }
    .inline-search {
      margin-left: 24px;
      display: inline-block;
    }
    .create-button {
      float: right;
    }
    .model-comparison-table-container {
      width: 100%;
      margin-top: 12px;
      .model-comparison-table-detail-container {
        overflow: auto;
        .el-table {
          ::v-deep .el-table__header-wrapper {
            // border-radius: 4px 4px 0 0;
            .el-table__header {
              th {
                background: rgba(235, 236, 240, 0.65);
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
      //.model-comparison-pagination-container {
      //  width: 100%;
      //  height: 60px;
      //  margin-top: 16px;
      //}
    }
    .icon-stop {
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: #FD5E3A;
      display: inline-block;
    }
    .icon-fail {
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: #eb240a;
      display: inline-block;
    }
    .icon-end {
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
}
::v-deep .stop-dialog{
  margin-top: 30vh !important;
  .el-dialog__header {
    border-bottom: 1px solid #f2f2f2;
    padding: 12px 24px;
    .el-dialog__title {
      font-size: 14px;
      color: #262626;
      letter-spacing: 0;
      line-height: 16px;
      font-weight: 700;
    }
  }
  .el-dialog__body {
    color: #646464;
    letter-spacing: 0;
    font-weight: 400;
    text-align: center;
    padding: 24px;
  }
}
::v-deep {
  .label-color {
    color: #0164FF;
  }
}
</style>
