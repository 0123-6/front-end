<template>
  <div class="wrapper">
    <div class="content">
      <div class="crumbs">
        <div style="display: flex; align-items: center">
          <span>模型评估</span>
          <div class="flex" style="margin-left: 24px;">
            <InputWithSearch class="inline-search" :placeholder="'请输入任务名称'" @search="handleQuery" />
          </div>
        </div>
        <el-button class="blue-btn" @click="createTask">创建任务</el-button>
      </div>
      <div class="table-wrapper">
        <el-table
          ref="multipleTable"
          v-loading="loading"
          class="table"
          :data="taskList"
          :height="tableHeight"
          border
          @sort-change="sortChange"
          @mousedown.native="mouseDownHandler"
          @mouseup.native="mouseUpHandler"
          @mousemove.native="mouseMoveHandler"
        >
          <el-table-column label="序号" type="index" width="60" :index="indexMethod" />
          <el-table-column label="ID" prop="id" width="80" show-overflow-tooltip sortable="custom" />
          <el-table-column label="任务名称" prop="jobName" min-width="120" show-overflow-tooltip />
          <el-table-column label="数据集" prop="dataSet.name" min-width="100" show-overflow-tooltip />
          <el-table-column label="模型名称" prop="modelName" min-width="120" show-overflow-tooltip />
          <el-table-column label="版本" prop="version" width="80" show-overflow-tooltip />
          <el-table-column label="创建者" prop="createUser.nickName" width="100" show-overflow-tooltip />
          <el-table-column
            label="状态"
            width="90"
            show-overflow-tooltip
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
              <i v-if="scope.row.status === 'UNDER_EVALUATION'" class="el-icon-loading" />
              <i v-if="scope.row.status === 'EVALUATION_FAILED'" class="icon-stop" />
              <i v-if="scope.row.status === 'EVALUATION_COMPLETED'" class="icon-end" />
              {{ statusMap[scope.row.status] }}
            </template>
          </el-table-column>
          <el-table-column label="完成时间" prop="updateTime" width="160" show-overflow-tooltip sortable="custom" />
          <el-table-column label="操作" align="center" width="110" show-overflow-tooltip fixed="right" class-name="table-operation-container">
            <template v-slot="scope">
              <TableOperationTooltip icon-class="table-stop" tooltip-title="停止" style="margin-right: 8px;" :icon-disabled="scope.row.status !== 'UNDER_EVALUATION'" @tooltipClick="stopEvaluation(scope.row)" />
              <TableOperationTooltip icon-class="table-result" tooltip-title="结果" style="margin-right: 8px;" :icon-disabled="scope.row.status !== 'EVALUATION_COMPLETED'" @tooltipClick="goEvaluationResult(scope.row)" />
              <TableOperationTooltip icon-class="table-delete" tooltip-title="删除" @tooltipClick="deleteEvaluation(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="total > pageSize"
          class="pagination-container"
          background
          :current-page="pageNum"
          :total="total"
          :page-sizes="[10, 20, 50]"
          :page-size="100"
          layout="total, prev, pager, next, sizes, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <dialog-ok
      v-if="ShowStopEvaluationDialog"
      :title="dialogTitle"
      width="400px"
      :content="dialogContent"
      @ok="dialogOk"
      @cancel="dialogCancel"
    />
    <dialog-ok
      v-if="dialogShow"
      :title="dialogTitle"
      width="400px"
      :content="dialogContent"
      @ok="dialogDeleteOk"
      @cancel="dialogDeleteCancel"
    />
  </div>
</template>

<script>
import DialogOk from '@/components/DialogOk';
import { deleteTaskEvaluation, getTaskList, stopTaskEvaluation } from '@/api/model-evaluation';
import InputWithSearch from '@/components/InputWithSearch';
import TableFiltersPopover from '@/components/TableFiltersPopover';
import TableOperationTooltip from '@/components/TableOperationTooltip';
export default {
  name: 'Index',
  components: {
    DialogOk,
    InputWithSearch,
    TableFiltersPopover,
    TableOperationTooltip
  },
  props: {

  },
  data() {
    return {
      taskList: [],
      statusMap: {
        UNDER_EVALUATION: '评估中',
        EVALUATION_FAILED: '已失败',
        EVALUATION_COMPLETED: '已完成'
      },
      statusOptions: [
        { code: 'UNDER_EVALUATION', label: '评估中' },
        { code: 'EVALUATION_FAILED', label: '已失败' },
        { code: 'EVALUATION_COMPLETED', label: '已完成' }
      ],
      ShowStopEvaluationDialog: false,
      dialogShow: false,
      dialogTitle: '',
      dialogContent: '',
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      id: 1,
      jobName: null,
      listInterval: null,
      mouseFlag: false,
      mouseOffset: 0,
      statusList: [],
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
      this.getTaskList();
    },
    sortChange({ column, prop, order }) {
      this.sortColumn = prop;
      this.sortOrder = order;
      this.getTaskList();
    },
    getTaskList() {
      this.loading = true;
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        jobName: this.jobName,
        statusList: this.statusList,
        column: this.sortColumn,
        order: this.sortOrder
      };
      getTaskList(params).then(res => {
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
          const index = res.data.records.findIndex(item => { return item.status === 'UNDER_EVALUATION'; });
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
    handleQuery(value) {
      this.jobName = value;
      this.pageNum = 1;
      this.getTaskList();
    },
    stopEvaluation(data) {
      if (data.status !== 'UNDER_EVALUATION') return;
      this.id = data.id;
      this.ShowStopEvaluationDialog = true;
      this.dialogTitle = '停止评估';
      this.dialogContent = data.jobName;
    },
    deleteEvaluation(data) {
      this.id = data.id;
      this.dialogTitle = '删除评估';
      this.dialogContent = data.jobName;
      this.dialogShow = true;
    },
    reassess(id) {
      this.id = id;
    },
    dialogOk() {
      stopTaskEvaluation({ id: this.id }).then(() => {
        this.$message({
          type: 'success',
          message: '停止评估成功!'
        });
        this.dialogCancel();
        this.getTaskList();
      }).catch(() => {});
    },
    dialogCancel() {
      this.ShowStopEvaluationDialog = false;
    },
    dialogDeleteOk() {
      deleteTaskEvaluation({ id: this.id }).then(() => {
        this.$message({
          type: 'success',
          message: '删除评估成功!'
        });
        this.getTaskList();
        this.dialogDeleteCancel();
      }).catch(() => {});
    },
    dialogDeleteCancel() {
      this.dialogShow = false;
    },
    createTask() {
      this.$router.push('/model-manager/evaluation/create-task');
    },
    goEvaluationResult(data) {
      if (data.status !== 'EVALUATION_COMPLETED') return;
      this.id = data.id;
      // this.$router.push({
      //   name: 'EvaluationResult',
      //   query: { id: this.id, dataId: data.dataId, modelId: data.modelId }
      // });
      const routeData = this.$router.resolve({
        name: 'EvaluationResult',
        query: { id: this.id, dataId: data.dataId, modelId: data.modelId }
      });
      window.open(routeData.href, '_blank');
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.pageNum = 1;
      this.getTaskList();
    },

    handleCurrentChange(num) {
      this.pageNum = num;
      this.getTaskList();
    },

    filterChange(type, list) {
      this.currentPage = 1;
      this.statusList = list;
      this.getTaskList();
    },
    indexMethod(index) {
      return (this.pageNum - 1) * this.pageSize + index + 1;
    },
    // 设置表格高度，做表格滚动表头不动处理
    setTableHeight() {
      const bodyHeight = document.body.offsetHeight - 10;
      const navHeight = document.getElementById('AiHeader-container').offsetHeight;
      const topOperationHeight = document.getElementsByClassName('crumbs')[0].offsetHeight;
      const paginationHeight = document.getElementsByClassName('pagination-container')[0] ? document.getElementsByClassName('pagination-container')[0].offsetHeight : 0;
      this.tableHeight = bodyHeight - navHeight - topOperationHeight - paginationHeight - 32 - 16 - 4 - 24;
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
.wrapper{
  position: relative;
  width: 100%;
  background-color: #edf2f9;
  overflow: auto;
  .content{
    height: calc(100vh - var(--header-height));
    padding: 16px 16px 0 16px;
    .crumbs{
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      background-color: white;
      span{
        line-height: 34px;
        font-size: 16px;
        color: #646464;
        font-weight: 700;
      }
    }
    .table-wrapper{
      padding: 0 24px;
      background-color: white;
      overflow: auto;
      min-height: calc(100vh - 205px);
      .table{
      }
      .icon-stop {
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
      .pagination-container{
        display: flex;
        align-items: center;
        justify-content: center;
        height: 60px;
        margin-top: 10px;
      }
    }
  }
}
</style>

