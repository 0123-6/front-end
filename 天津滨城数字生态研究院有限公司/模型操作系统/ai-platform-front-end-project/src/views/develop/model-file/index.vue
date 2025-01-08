<template>
  <!--最外层-->
  <div class="flex flex-direction" style="width: 100%;">
    <!--主体-->
    <div class="flex flex-direction bgc-main padding-left-16 padding-right-16" style="width: 100%;">
      <!--主体-->
      <div class="flex flex-direction bgc-white padding-left-24 padding-right-24 margin-top-16" style="width: 100%;min-height: calc(100vh - 142px);">
        <!--上-->
        <div class="flex justify-between align-center margin-top-16 operation-panel" style="width: 100%;">
          <!--左-->
          <div class="flex align-center">
            <div class="flex font-size-16 color-content font-weight">
              模型文件
            </div>
            <div style="margin-left: 24px;">
              <input-with-search placeholder="请输入文件名称" class="notebook-search-container" @search="search" />
            </div>
          </div>
          <!--右-->
          <div class="flex align-center">
            <!--上传按钮-->
            <el-button
              type="primary"
              icon="el-icon-plus"
              style="width: 96px;box-shadow: 0 2px 6px 1px rgba(183,217,255,0.47);border-radius: 4px;font-size: 12px;"
              @click="handleAdd"
            >上传
            </el-button>
          </div>
        </div>
        <!--表格-->
        <div class="margin-top-12">
          <el-table
            ref="table"
            v-loading="loading"
            border
            :data="modelFileList"
            :height="tableHeight"
            @selection-change="handleSelectionChange"
            @mousedown.native="mouseDownHandler"
            @mouseup.native="mouseUpHandler"
            @mousemove.native="mouseMoveHandler"
            @sort-change="sortChange"
          >
            <el-table-column
              label="ID"
              align="left"
              prop="id"
              width="60"
              show-overflow-tooltip
              sortable="custom"
            />
            <el-table-column
              label="模型文件"
              align="left"
              prop="modelFileName"
              min-width="290"
              show-overflow-tooltip
            />
            <el-table-column
              label="文件名称"
              align="left"
              prop="userDefinedFileName"
              min-width="270"
              show-overflow-tooltip
            />
            <el-table-column label="模型格式" min-width="130" align="left" prop="modelFileType" show-overflow-tooltip>
              <template slot="header">
                <TableFiltersPopover
                  :table-label="{
                    'type': 'modelFileType',
                    'label': '模型格式'
                  }"
                  :selection-list="runFrameOptions"
                  :popover-width="'160'"
                  :key-props="{
                    'code': 'value',
                    'label': 'label'
                  }"
                  @filter="filterChange"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="上传时间"
              width="160"
              align="left"
              prop="createTime"
              sortable="custom"
              show-overflow-tooltip
            />
            <el-table-column label="操作" width="85" align="center" class-name="table-operation-container" fixed="right">
              <template slot-scope="scope">
                <TableOperationTooltip icon-class="table-establish" tooltip-title="创建模型" style="margin-right: 8px;" @tooltipClick="handleCreate(scope.row)" />
                <TableOperationTooltip icon-class="table-delete" tooltip-title="删除" @tooltipClick="handleDelete(scope.row)" />
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--分页-->
        <div v-if="pageItemTotal > pageSize" class="flex justify-center align-center file-pagination-container" style="width: 100%;height: 60px;min-height: 60px;">
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
    </div>
    <!--新增、修改弹窗-->
    <el-dialog
      v-if="showDialog"
      v-dialogDrag
      :title="title"
      visible
      width="480px"
      :close-on-click-modal="false"
      append-to-body
      :custom-class="'detail-dialog'"
      :before-close="() => { showDialog = false }"
    >
      <upload-model-file ref="uploadModelFile" :show-dialog.sync="showDialog" @refreshDataList="getList" />
      <div v-if="flag !== 2" slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="$refs['uploadModelFile'].submitForm()">确 定</el-button>
      </div>
    </el-dialog>
    <MessageDialog
      v-if="isShowMessageDialog"
      :title="'删除'"
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
import { modelFilePage, delModelFile } from '@/api/model.js';
import uploadModelFile from '@/views/develop/components/upload-model-file.vue';
import InputWithSearch from '@/components/InputWithSearch';
import _ from 'lodash';
import MessageDialog from '@/views/data-manager/dataSet/components/MessageDialog';
import TableFiltersPopover from '@/components/TableFiltersPopover';
import TableOperationTooltip from '@/components/TableOperationTooltip';
export default {
  name: 'ModelFile',
  components: {
    uploadModelFile,
    InputWithSearch,
    MessageDialog,
    TableFiltersPopover,
    TableOperationTooltip
  },
  data() {
    return {
      keyword: '', // 搜索模型关键字
      pageSize: 10,
      currentPage: 1,
      pageItemTotal: 0,
      sortColumn: '', // 排序的列
      sortOrder: '', // 排序的顺序

      flag: 0,
      showDialog: false,
      title: '',
      dateArray: [], // 上传时间范围
      loading: false, // 页面加载
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      modelFileList: [], // 模型文件列表
      multiple: true, // 非多个禁用
      ids: [],
      showSearch: true, // 显示隐藏搜索条件
      selectRunFrameList: [],
      runFrameOptions: [
        { value: 0, label: 'SKLEARN' },
        { value: 1, label: 'XGBOOST' },
        { value: 2, label: 'LIGHTGBM' },
        { value: 3, label: 'TENSORFLOW' },
        { value: 4, label: 'PYTORCH' }
      ],
      total: 0, // 总记录数
      runFrame: '', // 运行框架
      beginTime: '', // 上传开始时间
      endTime: '', // 上传结束时间
      mouseFlag: false,
      mouseOffset: 0,
      isShowMessageDialog: false, // 信息提示框显隐
      currentDeleteId: '',
      messageContent: '', // 信息提示框内容
      tableHeight: 0
    };
  },
  mounted() {
    this.getList();
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
      if (!this.$refs.table) return;
      const divData = this.$refs.table.bodyWrapper;
      if (this.mouseFlag) {
        // 设置水平方向的元素的位置
        divData.scrollLeft -= (-this.mouseOffset + (this.mouseOffset = e.clientX));
      }
    },
    // 表格鼠标按下滚动 结束
    goHome() {
      this.$router.push('/');
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    filterChange(type, list) {
      this.selectRunFrameList = list;
      this.currentPage = 1;
      this.getList();
    },
    getList() {
      this.loading = true;
      const params = {
        runFrame: this.runFrame, //  运行框架
        beginTime: this.beginTime, // 上传开始时间
        endTime: this.endTime, // 上传结束时间
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        modelFileName: '',
        userDefinedFileName: this.keyword,
        column: this.sortColumn,
        order: this.sortOrder,
        modelFileTypeList: this.selectRunFrameList
      };
      modelFilePage(params).then(res => {
        if (res.code === '000000') {
          this.modelFileList = res.data.records;
          this.pageItemTotal = res.data.total;
          this.$nextTick(() => {
            this.$refs.table.bodyWrapper.scrollTop = 0;
            this.setTableHeight();
          });
        }
        this.loading = false;
      });
    },
    /** 选择日期 **/
    handleTime(val) {
      if (val && val.length > 0) {
        this.queryParams.beginTime = val[0];
        this.queryParams.endTime = val[1];
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.multiple = !selection.length;
    },
    /** 搜索按钮操作 */
    search: _.debounce(function(val) {
      this.keyword = val;
      this.currentPage = 1;
      this.getList();
    }, 200),
    /** 上传模型按钮操作 */
    handleAdd() {
      this.flag = 0;
      this.title = '上传模型文件';
      this.showDialog = true;
    },
    /** 创建模型按钮操作 */
    handleCreate(row) {
      this.$router.push('/model/create-model/create/1/' + row.id);
    },
    /** 查看按钮操作 **/
    // handleView(id) {
    //   this.flag = 2
    //   this.title = '查看模型文件'
    //   this.showDialog = true
    //   this.$nextTick(() => {
    //     this.$refs.uploadModelFile.getInfo(id, 2)
    //   })
    // },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.isShowMessageDialog = true;
      this.currentDeleteId = row.id || this.ids;
      this.messageContent = `确定要删除<span class="label-color">&nbsp;&nbsp;${row.userDefinedFileName}&nbsp;&nbsp;</span>的模型文件信息吗?`;
    },
    saveMessage() {
      delModelFile(this.currentDeleteId.toString()).then(res => {
        if (res.code === '000000') {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 500,
            onClose: () => {
              // 如果当前页码>1 而且 modelFileList只有1个，删除后需要页码-1
              if (this.currentPage > 1 && this.modelFileList.length === 1) {
                this.currentPage -= 1;
              }
              this.getList();
            }
          });
        }
      });
      this.isShowMessageDialog = false;
    },
    // 取消信息提示框
    cancelMessage() {
      this.isShowMessageDialog = false;
    },
    // 排序
    sortChange({ column, prop, order }) {
      this.sortColumn = prop;
      this.sortOrder = order;
      this.getList();
    },
    // 设置表格高度，做表格滚动表头不动处理
    setTableHeight() {
      const bodyHeight = document.body.offsetHeight;
      const navHeight = document.getElementById('AiHeader-container').offsetHeight;
      const topOperationHeight = document.getElementsByClassName('operation-panel')[0].offsetHeight;
      const paginationHeight = document.getElementsByClassName('file-pagination-container')[0] ? document.getElementsByClassName('file-pagination-container')[0].offsetHeight : 0;
      this.tableHeight = bodyHeight - navHeight - topOperationHeight - paginationHeight - 64 - 16 - 16;
      const realTableHeight = this.modelFileList.length * 45 + 45;
      if (this.modelFileList.length === 0) {
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
  .detail-dialog {
    .el-dialog__header {
      height: 40px;
      line-height: 40px;
      padding: 0 24px;
      border-bottom: 1px solid rgba(242, 242, 242, 1);
      .el-dialog__title {
        font-size: 14px;
        color: #262626;
        font-weight: 700;
      }
    }
  }
  .content-container {
    .label-color {
      color: #0164FF;
    }
  }
}
</style>
