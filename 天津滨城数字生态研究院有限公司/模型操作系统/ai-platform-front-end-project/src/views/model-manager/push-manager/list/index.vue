<template>
  <div class="push-list">
    <div>
      <el-row type="flex" class="status-panel">
        <div class="flex align-center">
          <div>
            全部({{ modelStatus.all }})
          </div>
        </div>
        <div class="flex align-center color-green">
          <div>
            已上线({{ modelStatus.online }})
          </div>
        </div>
        <div class="flex align-center color-title-2">
          <div>
            已下线({{ modelStatus.offline }})
          </div>
        </div>
        <div class="flex align-center color-orange">
          <div>
            待审核({{ modelStatus.audit }})
          </div>
        </div>
        <div class="flex align-center color-red">
          <div>
            驳回({{ modelStatus.reject }})
          </div>
        </div>
      </el-row>
      <div class="operation-panel">
        <div class="search-div">
          <InputWithSearch class="inline-search" :placeholder="'请输入模型名称'" @search="handleQuery" />
        </div>
        <el-row type="flex" class="line-btn">
          <div class="flex align-center margin-left-16" style="font-size: 14px;color: #909399;">已选择<span style="color: #0164FF; padding: 0 3px">{{ selectedList.length }}</span>条</div>
          <el-button :disabled="turnSelected" plain type="warning" size="small" @click="batchRejection">批量驳回</el-button>
          <el-button :disabled="onlineSelected" plain type="success" size="small" @click="batchPushing">批量上线</el-button>
          <el-button :disabled="offlineSelected" plain type="danger" size="small" @click="batchLeaving">批量下线</el-button>
        </el-row>
      </div>
      <div class="table-wrapper">
        <el-table
          ref="multipleTable"
          v-loading="loading"
          border
          :data="modelList"
          :height="tableHeight"
          class="table"
          :row-key="getRowKey"
          @sort-change="sortChange"
          @selection-change="handleSelectionChange"
          @mousedown.native="mouseDownHandler"
          @mouseup.native="mouseUpHandler"
          @mousemove.native="mouseMoveHandler"
        >
          <el-table-column type="selection" width="60" align="center" :reserve-selection="true" />
          <el-table-column label="序号" type="index" width="60" :index="indexMethod" />
          <el-table-column label="ID" prop="id" width="70" sortable="custom" />
          <el-table-column label="模型名称" prop="modelNameCh" min-width="180" show-overflow-tooltip>
            <template v-slot="scope" class="flex justify-center align-center">
              <span class="detail-button" @click="handleView(scope.row)">{{ scope.row.modelNameCh }}</span>
            </template>
          </el-table-column>
          <el-table-column label="模型类型" prop="type.typeName" min-width="120" show-overflow-tooltip>
            <template slot="header">
              <TableFiltersPopover
                :table-label="{
                  'type': 'type',
                  'label': '模型类型'
                }"
                :selection-list="filterModelTypeListAll"
                :popover-width="'180'"
                :key-props="{
                  'code': 'id',
                  'label': 'typeName'
                }"
                @filter="filterChange"
              />
            </template>
          </el-table-column>
          <el-table-column label="提交时间" prop="createTime" width="160" show-overflow-tooltip sortable="custom" />
          <el-table-column label="申请资源" prop="configure" min-width="120" show-overflow-tooltip>
            <template v-slot="scope">
              CPU: {{ scope.row.configure.cpu }}
              GPU: {{ scope.row.configure.gpu }}
              Memory: {{ scope.row.configure.memory }}
              最小实例数: {{ scope.row.configure.minInstance }}
              最大实例数: {{ scope.row.configure.maxInstance }}
            </template>
          </el-table-column>
          <el-table-column label="创建者" prop="createUser.nickName" min-width="100" show-overflow-tooltip />
          <el-table-column
            label="服务状态"
            prop="status"
            width="120"
          >
            <template slot="header">
              <TableFiltersPopover
                :table-label="{
                  'type': 'status',
                  'label': '服务状态'
                }"
                :selection-list="filterModelStatusListAll"
                :popover-width="'140'"
                @filter="filterChange"
              />
            </template>
            <template slot-scope="scope">
              <!--              <el-link v-if="scope.row.status === 'WAIT_RELEASE'" type="info" :underline="false">未发布</el-link>-->
              <el-link v-if="scope.row.status === 'WAIT_FIRST_JUDGE'" type="info" :underline="false">
                <i v-if="scope.row.status === 'WAIT_FIRST_JUDGE'" class="icon-first icon" />待初审
              </el-link>
              <el-link v-if="scope.row.status === 'WAIT_FINAL_JUDGE'" type="info" :underline="false">
                <i v-if="scope.row.status === 'WAIT_FINAL_JUDGE'" class="icon-finally icon" />待终审
              </el-link>
              <el-link v-if="scope.row.status === 'REJECT'" type="info" :underline="false">
                <i v-if="scope.row.status === 'REJECT'" class="icon-stop icon" />驳回
              </el-link>
              <el-link v-if="scope.row.status === 'OFF_LINE'" type="info" :underline="false">
                <i v-if="scope.row.status === 'OFF_LINE'" class="icon-offline icon" />已下线
              </el-link>
              <el-link v-if="scope.row.status === 'DEVELOYMENT_FAIL'" type="info" :underline="false">
                <i v-if="scope.row.status === 'DEVELOYMENT_FAIL'" style="color: #FD5E3A" class="el-icon-warning-outline icon" />部署失败</el-link>
              <el-link v-if="scope.row.status === 'ON_LINE'" type="info" :underline="false">
                <i v-if="scope.row.status === 'ON_LINE'" class="icon-online icon" />已上线
              </el-link>
              <el-link v-if="scope.row.status === 'UNDER_DEVELOYMENT'" type="info" :underline="false">
                <i v-if="scope.row.status === 'UNDER_DEVELOYMENT'" style="color: #0164FF" class="el-icon-loading" />部署中
              </el-link>
            </template>
          </el-table-column>
          <el-table-column label="体验数据" prop="aiStudioLine.name" min-width="200" show-overflow-tooltip>
            <template v-slot="scope" class="flex justify-center align-center">
              <span class="detail-button" @click="handleDatasetView(scope.row)">{{ scope.row.aiStudioLine?scope.row.aiStudioLine.name : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="初审者" prop="firstJudgeUser.nickName" min-width="100" show-overflow-tooltip />
          <el-table-column label="终审者" prop="finalJudgeUser.nickName" min-width="100" show-overflow-tooltip />
          <el-table-column label="处理时间" prop="updateTime" width="160" show-overflow-tooltip sortable="custom" />
          <el-table-column label="备注" prop="remark" min-width="100" show-overflow-tooltip />
          <el-table-column label="操作" align="center" class-name="fixed-width table-operation-container" :width="operationCellWidth" fixed="right">
            <template v-slot="scope" class="flex">
              <TableOperationTooltip icon-class="table-see" tooltip-title="查看" style="margin-right: 8px;" @tooltipClick="handleView(scope.row)" />
              <TableOperationTooltip icon-class="table-edit" tooltip-title="编辑" style="margin-right: 8px;" :icon-disabled="scope.row.status !== 'OFF_LINE'" @tooltipClick="handleEdit(scope.row)" />
              <TableOperationTooltip
                v-if="operationPermissionsList.indexOf('firstJudge') >= 0"
                icon-class="table-onecareful"
                tooltip-title="初审"
                style="margin-right: 8px;"
                :icon-disabled="scope.row.status !== 'WAIT_FIRST_JUDGE'"
                @tooltipClick="firstCheck(scope.row)"
              />
              <TableOperationTooltip
                v-if="operationPermissionsList.indexOf('finalJudge') >= 0"
                icon-class="table-zhongcareful"
                tooltip-title="终审"
                style="margin-right: 8px;"
                :icon-disabled="scope.row.status !== 'WAIT_FINAL_JUDGE'"
                @tooltipClick="lastCheck(scope.row)"
              />
              <TableOperationTooltip
                icon-class="table-goonline"
                tooltip-title="上线"
                :icon-disabled="scope.row.status !== 'OFF_LINE' && scope.row.status !== 'DEVELOYMENT_FAIL'"
                style="margin-right: 8px;"
                @tooltipClick="modelLaunch(scope.row)"
              />
              <TableOperationTooltip
                icon-class="table-offline"
                tooltip-title="下线"
                style="margin-right: 8px;"
                :icon-disabled="scope.row.status !== 'ON_LINE'"
                @tooltipClick="modelOffline(scope.row)"
              />
              <TableOperationTooltip
                icon-class="table-guanlainshuju"
                :tooltip-title="scope.row.hasUnionDataSet === false ? '关联数据集' : '更新关联数据集'"
                style="margin-right: 8px;"
                :icon-disabled="scope.row.status !== 'ON_LINE'"
                @tooltipClick="dataSet(scope.row)"
              />
              <TableOperationTooltip
                icon-class="table-disassociate"
                tooltip-title="取消关联数据集"
                :icon-disabled="scope.row.hasUnionDataSet === false"
                @tooltipClick="cancelDataSet(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
        <div v-if="total > pageSize" class="flex justify-center align-center push-pagination-container" style="width: 100%;height: 60px;">
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
    <!--初审弹窗-->
    <first-check-ok
      v-if="ShowFirstCheckDialog"
      @ok="firstCheckOk"
      @reject="firstCheckReject"
      @cancel="firstCheckCancel"
    />
    <!--批量操作和上线模型，下线模型弹窗-->
    <dialog-ok
      v-if="ShowDialogOk"
      :title="dialogTitle"
      :content="dialogContent"
      :width="'400px'"
      @ok="dialogOk"
      @cancel="dialogCancel"
    />
    <!--终审操作弹窗-->
    <push-to-data
      v-if="showLastCheckDialog"
      :params="finalCheckData"
      @ok="lastCheckOk"
      @reject="lastCheckReject"
      @cancel="lastCheckCancel"
    />
    <data-set
      v-if="showDataSetDialog"
      :item-info="selectedItem"
      @cancel="dataSetCancel"
      @ok="dataSetOk"
    />
  </div>
</template>

<script>
import DialogOk from '@/components/DialogOk';
import FirstCheckOk from '@/views/model-manager/components/FirstCheckOk';
import {
  batchLeaving,
  batchPushing,
  batchRejection, finalJudgeOk, finalJudgeReject,
  firstJudgeOk, firstJudgeReject,
  getModelListV2,
  getModelStatusStatistics, modelLaunch, modelOffline, previewModel,
  getModelClassification, cancelDataSet
} from '@/api/model';
import PushToData from '@/views/model-manager/components/PushToData';
import _debounce from 'lodash/debounce';
import InputWithSearch from '@/components/InputWithSearch';
import TableFiltersPopover from '@/components/TableFiltersPopover';
import TableOperationTooltip from '@/components/TableOperationTooltip';
import DataSet from '@/views/model-manager/push-manager/components/dataSet';
import { mapGetters } from 'vuex';

export default {
  name: 'Index',
  components: {
    PushToData,
    InputWithSearch,
    FirstCheckOk,
    DialogOk,
    TableFiltersPopover,
    DataSet,
    TableOperationTooltip
  },
  data() {
    return {
      modelStatus: {},
      ShowFirstCheckDialog: false, // 初审
      currentPage: 1,
      showSearch: true,
      searchModelName: '',
      loading: false,
      modelList: [], // 供应商列表
      total: 0,
      ShowDialogOk: false,
      dialogTitle: '',
      dialogContent: '',
      showPushing: false, // 部署中
      pageSize: 10,
      selectedList: [], // 多选列表
      selectedModelId: -1, // 查看，初审，终审对应的模型id
      showLastCheckDialog: false, // 终审
      status: '',
      finalCheckData: null,
      turnSelected: true,
      onlineSelected: true,
      offlineSelected: true,
      mouseFlag: false,
      mouseOffset: 0,
      statusList: [],
      typeList: [],
      filterModelTypeListAll: [],
      filterModelStatusListAll: [
        { code: 'WAIT_FIRST_JUDGE', label: '待初审' },
        { code: 'WAIT_FINAL_JUDGE', label: '待终审' },
        { code: 'REJECT', label: '驳回' },
        { code: 'OFF_LINE', label: '已下线' },
        { code: 'DEVELOYMENT_FAIL', label: '部署失败' },
        { code: 'ON_LINE', label: '已上线' },
        { code: 'UNDER_DEVELOYMENT', label: '部署中' }
      ],
      operationCellWidth: 0,
      sortColumn: '', // 排序的列名
      sortOrder: '', // 排序方式
      listInterval: null,
      showDataSetDialog: false,
      selectedItem: null,
      tableHeight: 0
    };
  },
  computed: {
    ...mapGetters(['operationPermissionsList'])
  },
  created() {
    this.init();
    if (this.operationPermissionsList.indexOf('firstJudge') >= 0 && this.operationPermissionsList.indexOf('finalJudge') >= 0) {
      this.operationCellWidth = 260;
    } else {
      if (this.operationPermissionsList.indexOf('firstJudge') >= 0) {
        this.operationCellWidth = 240;
      } else if (this.operationPermissionsList.indexOf('finalJudge') >= 0) {
        this.operationCellWidth = 240;
      } else {
        this.operationCellWidth = 220;
      }
    }
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
    // get模型筛选列表
    getModelClassification() {
      getModelClassification().then(res => {
        this.filterModelTypeListAll = res.data;
      });
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
    // 表格鼠标按下滚动 结束
    init() {
      this.getModelStatusStatistics();
      this.getModelList();
      this.handleSelectionChange([]);
      this.getModelClassification();
      this.$refs.multipleTable?.clearSelection();
    },
    getModelStatusStatistics() {
      getModelStatusStatistics().then(res => {
        this.modelStatus = res.data;
      });
    },
    changeStatus(status) {
      this.status = this.status === status ? '' : status;
      this.getModelList();
    },
    sortChange({ column, prop, order }) {
      this.sortColumn = prop;
      this.sortOrder = order;
      this.$refs.multipleTable.clearSelection();
      this.getModelList();
    },
    getModelList() {
      this.loading = true;
      const params = {
        keywords: this.searchModelName,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        status: this.status !== '' ? this.status : null,
        pageType: 1,
        statusList: this.statusList,
        modelTypeIdList: this.typeList,
        column: this.sortColumn,
        order: this.sortOrder
      };
      getModelListV2(params).then(res => {
        if (res.code === '000000') {
          this.total = res.data.total;
          if (
            this.total > 0 &&
            res.data.records.length === 0 &&
            this.currentPage > 1
          ) {
            this.currentPage--;
            this.getModelList();
          }
          this.modelList = res.data.records;
          this.$nextTick(() => {
            this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
            this.setTableHeight();
          });
          this.loading = false;
          const index = res.data.records.findIndex(item => { return item.status === 'UNDER_DEVELOYMENT'; });
          if (index >= 0) {
            if (this.listInterval) return;
            this.listInterval = setInterval(() => {
              this.getModelList();
            }, 5000);
          } else {
            clearInterval(this.listInterval);
            this.listInterval = null;
          }
        } else {
          this.modelList = [];
          this.loading = false;
          clearInterval(this.listInterval);
          this.listInterval = null;
        }
      }).catch(() => {
        this.modelList = [];
        this.loading = false;
        clearInterval(this.listInterval);
        this.listInterval = null;
      });
    },
    batchRejection() {
      this.dialogTitle = '批量驳回';
      this.ShowDialogOk = true;
    },
    batchPushing() {
      this.dialogTitle = '批量上线';
      this.ShowDialogOk = true;
    },
    batchLeaving() {
      this.dialogTitle = '批量下线';
      this.ShowDialogOk = true;
    },
    firstCheck(row) {
      if (row.status !== 'WAIT_FIRST_JUDGE') return;
      this.selectedModelId = row.id;
      this.ShowFirstCheckDialog = true;
    },
    lastCheck(row) {
      if (row.status !== 'WAIT_FINAL_JUDGE') return;
      this.selectedModelId = row.id;
      this.finalCheckData = JSON.parse(JSON.stringify(row));
      // this.finalCheckData.remark = '';
      this.previewModel(row.id);
      this.showLastCheckDialog = true;
    },
    previewModel(id) {
      previewModel(id).then(res => {
        this.modelInfo = res.data;
        this.finalCheckData = JSON.parse(JSON.stringify(this.modelInfo));
        this.finalCheckData.remark = '';
      });
    },
    modelLaunch(data) {
      if (data.status !== 'OFF_LINE' && data.status !== 'DEVELOYMENT_FAIL') return;
      this.selectedModelId = data.id;
      this.dialogTitle = '申请上线模型';
      this.dialogContent = data.modelNameCh;
      this.ShowDialogOk = true;
    },
    modelOffline(data) {
      if (data.status !== 'ON_LINE') return;
      this.selectedModelId = data.id;
      this.dialogTitle = '下线模型';
      this.dialogContent = data.modelNameCh;
      this.ShowDialogOk = true;
    },
    dataSet(data) {
      if (data.status !== 'ON_LINE') return;
      this.selectedItem = data;
      this.showDataSetDialog = true;
    },
    cancelDataSet(data) {
      if (data.hasUnionDataSet === false) return;
      this.dialogTitle = '取消关联数据集';
      this.selectedModelId = data.id;
      this.ShowDialogOk = true;
    },
    /** 搜索按钮操作 */
    handleQuery(value) {
      this.searchModelName = value;
      this.currentPage = 1;
      this.getModelList();
    },

    handleView(data) {
      sessionStorage.setItem('modelStatus', data.status);
      sessionStorage.setItem('hasUnionDataSet', data.hasUnionDataSet);
      // this.$router.push({ path: '/model-manager/push/detail/' + data.id });
      const routeData = this.$router.resolve({
        path: '/model-manager/push/detail/' + data.id
      });
      window.open(routeData.href, '_blank');
    },
    handleDatasetView(data) {
      sessionStorage.setItem('isShowLabelView', true);
      sessionStorage.setItem('isShowForkButton', false);
      const routeData = this.$router.resolve({
        path: `/model-manager/push/common-detail/blank/${data.aiStudioLine.id}/common`
      });
      window.open(routeData.href, '_blank');
    },
    handleEdit(data) {
      sessionStorage.setItem('preRoute', 'modelPush');
      this.$router.push('/model-manager/push/create/2/' + data.id);
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
        batchRejection(params).then(res => {
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
      } else if (this.dialogTitle === '批量上线') {
        batchPushing(params).then(res => {
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
      } else if (this.dialogTitle === '批量下线') {
        batchLeaving(params).then(res => {
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
      } else if (this.dialogTitle === '申请上线模型') {
        const params = {
          id: this.selectedModelId
        };
        modelLaunch(params).then(res => {
          if (res.code === '000000') {
            _this.$message({
              message: _this.dialogTitle + '成功!',
              type: 'success'
            });
            _this.init();
          } else {
            _this.$message({
              message: _this.dialogTitle + '失败',
              type: 'error'
            });
          }
        });
        _this.dialogCancel();
      } else if (this.dialogTitle === '下线模型') {
        const params = {
          id: this.selectedModelId
        };
        modelOffline(params).then(res => {
          if (res.code === '000000') {
            _this.$message({
              message: _this.dialogTitle + '成功!',
              type: 'success'
            });
            _this.init();
          } else {
            _this.$message({
              message: _this.dialogTitle + '失败',
              type: 'error'
            });
          }
        });
        _this.dialogCancel();
      } else if (this.dialogTitle === '取消关联数据集') {
        cancelDataSet(this.selectedModelId).then(res => {
          if (res.code === '000000') {
            _this.$message({
              message: _this.dialogTitle + '成功!',
              type: 'success'
            });
            _this.init();
          } else {
            _this.$message({
              message: _this.dialogTitle + '失败',
              type: 'error'
            });
          }
        });
        _this.dialogCancel();
      }
    }, 300),
    dialogCancel() {
      this.ShowDialogOk = false;
    },
    ok() {
      this.cancel();
      this.$message({
        message: '部署成功!',
        type: 'success'
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getModelList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getModelList();
    },
    handleSelectionChange(val) {
      this.selectedList = val;
      if (val.length !== 0) {
        this.turnSelected = !val.every(item => item.status === 'WAIT_FIRST_JUDGE' || item.status === 'WAIT_FINAL_JUDGE');
        this.onlineSelected = !val.every(item => item.status === 'OFF_LINE' || item.status === 'DEVELOYMENT_FAIL');
        this.offlineSelected = !val.every(item => item.status === 'ON_LINE');
      } else {
        this.offlineSelected = this.onlineSelected = this.turnSelected = true;
      }
      // this.isSelected = !val.length
    },
    // 保存选中的数据id,row-key就是要指定一个key标识这一行的数据
    getRowKey(row) {
      return row.id;
    },
    firstCheckOk(text) {
      const params = {
        id: this.selectedModelId,
        remark: text
      };
      firstJudgeOk(params).then(res => {
        if (res.code === '000000') {
          this.$message({
            message: '初审已通过!',
            type: 'success'
          });
          this.init();
        } else {
          this.$message({
            message: '初审通过失败!',
            type: 'error'
          });
        }
      });
      this.firstCheckCancel();
    },
    firstCheckReject(text) {
      const params = {
        id: this.selectedModelId,
        remark: text
      };
      firstJudgeReject(params).then(res => {
        if (res.code === '000000') {
          this.$message({
            message: '初审已驳回!',
            type: 'success'
          });
          this.init();
        } else {
          this.$message({
            message: '初审驳回失败!',
            type: 'error'
          });
        }
      });
      this.firstCheckCancel();
    },
    firstCheckCancel() {
      this.ShowFirstCheckDialog = false;
    },
    lastCheckOk(params) {
      params.id = this.selectedModelId;
      finalJudgeOk(params).then(res => {
        if (res.code === '000000') {
          this.$message({
            message: '终审已通过!',
            type: 'success'
          });
          this.init();
        } else {
          this.$message({
            message: '终审通过失败!',
            type: 'error'
          });
        }
      });
      this.lastCheckCancel();
    },
    lastCheckReject(params) {
      params.id = this.selectedModelId;
      finalJudgeReject(params).then(res => {
        if (res.code === '000000') {
          this.$message({
            message: '终审已驳回!',
            type: 'success'
          });
          this.init();
        } else {
          this.$message({
            message: '终审驳回失败!',
            type: 'error'
          });
        }
      });
      this.lastCheckCancel();
    },
    lastCheckCancel() {
      this.showLastCheckDialog = false;
    },
    dataSetOk() {
      this.dataSetCancel();
      this.getModelList();
    },
    dataSetCancel() {
      this.showDataSetDialog = false;
    },
    filterChange(type, list) {
      if (type === 'type') {
        this.typeList = list;
      } else if (type === 'status') {
        this.statusList = list;
      }
      this.currentPage = 1;
      this.$refs.multipleTable?.clearSelection();
      this.getModelList();
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
      const realTableHeight = this.modelList.length * 45 + 45;
      if (this.modelList.length === 0) {
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
  .icon-first{
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: #00B1B2;
    display: inline-block;
  }
  .icon-finally{
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: #f66600;
    display: inline-block;
  }
  .icon-stop {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: #ff4e25;
    display: inline-block;
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
    .detail-button {
      cursor: pointer;
      font-weight: 400;
      &:hover {
        color: #0164FF;
      }
    }
  }
}
</style>
