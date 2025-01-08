<template>
  <generator-dialog :top="10" :width="900" :title="dialogType === 'authorization'?'授权':'取消授权'" @ok="ok" @cancel="cancel">
    <template slot="content">
      <!--最外层-->
      <div class="flex flex-direction padding-left-24 padding-right-24" style="width: 100%;height: 660px;">
        <!--tab-->
        <div class="flex align-center margin-top-12" style="width: 100%;">
          <hpj-tabs :tab-list="tabList" :active-tab.sync="activeTab" @change="changeTab" />
        </div>
        <!--菜单栏-->
        <div class="flex justify-between align-column-center margin-top-8" style="width: 100%;height: 32px;">
          <!--左-->
          <div class="flex align-center" style="height: 100%;">
            <div class="flex align-center margin-left-8" style="height: 100%;">
              <input-with-search
                ref="inputWithSearchEl"
                :placeholder="activeTab==='模型'?'请输入模型名称':'请输入数据集名称'"
                class="notebook-search-container"
                @search="search"
              />
            </div>
          </div>
          <!--右-->
          <div class="flex align-center font-size-12 color-content" style="height: 100%;line-height: 12px;">
            <span>已选<span class="color-blue">{{ selectionList.length }}</span>项</span>
          </div>
        </div>
        <!--表格-->
        <div
          v-loading="loading"
          class="margin-top-8"
          style="width: 100%; height: 500px;"
        >
          <el-table
            v-if="activeTab==='模型'"
            :key="activeTab"
            ref="modelTable"
            :height="modelTableHeight"
            style="width: 100%;border-radius: 2px;"
            border
            :data="tableData"
            :row-key="getRowKey"
            @selection-change="modelSelectedChange"
            @sort-change="sortChange"
            @mousedown.native="modelTableMouseDownHandler"
            @mouseup.native="modelTableMouseUpHandler"
            @mousemove.native="modelTableMouseMoveHandler"
          >
            <el-table-column type="selection" align="center" min-width="55" :reserve-selection="true" :selectable="modelSelectable" />
            <el-table-column type="index" label="序号" min-width="50" :index="indexMethod" />
            <el-table-column
              label="ID"
              align="left"
              prop="id"
              show-overflow-tooltip
              min-width="60"
              sortable="custom"
            />
            <el-table-column
              label="模型名称"
              align="left"
              prop="modelNameCh"
              show-overflow-tooltip
              min-width="210"
            >
              <template slot-scope="scope" class="flex justify-center align-center">
                <span
                  v-if="dialogType === 'authorization'"
                  class="hover-to-blue hand"
                  style="font-weight: 400"
                  type="primary"
                  :underline="false"
                  @click="handleView(scope.row)"
                >{{ scope.row.modelNameCh }}</span>
                <span v-else>{{ scope.row.modelNameCh }}</span>
              </template>
            </el-table-column>
            <el-table-column label="模型类型" align="left" :prop="dialogType === 'authorization'?'typeName':'modelTypeName'" show-overflow-tooltip min-width="110">
              <template slot="header">
                <TableFiltersPopover
                  :table-label="{
                    'type': 'modelType',
                    'label': '模型类型'
                  }"
                  :selection-list="filterModelTypeListAll"
                  :popover-width="'180'"
                  :key-props="{
                    'code': 'value',
                    'label': 'text'
                  }"
                  @filter="filterChange"
                />
              </template>
            </el-table-column>
            <el-table-column label="版本" align="left" prop="versionName" show-overflow-tooltip min-width="70" />
            <el-table-column
              label="发布时间"
              align="left"
              prop="onlineTime"
              sortable="custom"
              show-overflow-tooltip
              min-width="100"
            >
              <template slot-scope="scope" class="flex align-center" style="width: 100%;">
                <div class="flex align-center" style="width: 100%;">
                  <span>{{ scope.row.onlineTime && scope.row.onlineTime.split(' ')[0] }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="dialogType !== 'authorization'"
              label="授权时间"
              align="left"
              prop="sysUserModelData.expiryTimeStart"
              show-overflow-tooltip
              width="160"
              sortable="custom"
            >
              <template slot-scope="scope" class="flex align-center" style="width: 100%;">
                <div class="flex align-center" style="width: 100%;">
                  <span>{{ scope.row.sysUserModelData.createTime }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="dialogType !== 'authorization'"
              label="服务开始时间"
              align="left"
              prop="sysUserModelData.expiryTimeStart"
              show-overflow-tooltip
              width="130"
              sortable="custom"
            >
              <template slot-scope="scope" class="flex align-center" style="width: 100%;">
                <div class="flex align-center" style="width: 100%;">
                  <span>{{ scope.row.sysUserModelData.expiryTimeStart && scope.row.sysUserModelData.expiryTimeStart.split(' ')[0] }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="dialogType !== 'authorization'"
              label="服务到期时间"
              align="left"
              prop="sysUserModelData.expiryTimeEnd"
              show-overflow-tooltip
              width="130"
              sortable="custom"
            >
              <template slot-scope="scope" class="flex align-center" style="width: 100%;">
                <div class="flex align-center" style="width: 100%;">
                  <span>{{ scope.row.sysUserModelData.expiryTimeEnd && scope.row.sysUserModelData.expiryTimeEnd.split(' ')[0] }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="dialogType !== 'authorization'"
              label="状态"
              align="left"
              prop="status"
              show-overflow-tooltip
              min-width="100"
            >
              <template slot="header">
                <TableFiltersPopover
                  :table-label="{
                    'type': 'modelStatus',
                    'label': '状态'
                  }"
                  :selection-list="filterModelStatusListAll"
                  :popover-width="'140'"
                  :key-props="{
                    'code': 'value',
                    'label': 'text'
                  }"
                  @filter="filterChange"
                />
              </template>
              <template slot-scope="scope" class="color-content">
                <div v-if="scope.row.status === 'ON_LINE'" class="flex align-center">
                  <div class="bgc-green round" style="width: 11px;height: 11px;margin-right: 4px;" />
                  <div>已上线</div>
                </div>
                <div v-if="scope.row.status === 'OFF_LINE'" class="flex align-center">
                  <div class="round" style="width: 11px;height: 11px;margin-right: 4px;background-color: #8C8C8C;" />
                  <div>已下线</div>
                </div>
                <div v-if="scope.row.status === 'EXPIRED'" class="flex align-center">
                  <div class="round" style="width: 11px;height: 11px;margin-right: 4px;background-color: #8C8C8C;" />
                  <div>已过期</div>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            v-if="activeTab==='数据集'"
            :key="activeTab"
            ref="dataSetTable"
            style="width: 100%;border-radius: 2px"
            border
            :height="dataSetTableHeight"
            :row-key="getRowKey"
            :data="tableData"
            @selection-change="dataSetSelectedChange"
            @sort-change="sortChange"
            @mousedown.native="dataSetTableMouseDownHandler"
            @mouseup.native="dataSetTableMouseUpHandler"
            @mousemove.native="dataSetTableMouseMoveHandler"
          >
            <el-table-column type="selection" align="center" min-width="55" :reserve-selection="true" :selectable="dataSetSelectable" />
            <el-table-column label="序号" align="left" type="index" min-width="40" :index="indexMethod" />
            <el-table-column label="ID" align="left" prop="id" min-width="60" sortable="custom" />
            <el-table-column label="数据集名称" align="left" prop="name" min-width="200">
              <template slot-scope="scope" class="flex justify-center align-center">
                <span
                  v-if="dialogType === 'authorization'"
                  class="hover-to-blue hand"
                  style="font-weight: 400"
                  type="primary"
                  :underline="false"
                  @click="handleView(scope.row)"
                >{{ scope.row.name }}</span>
                <span v-else>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="类型" align="left" prop="type" min-width="70">
              <template slot="header">
                <TableFiltersPopover
                  :table-label="{
                    'type': 'datasetType',
                    'label': '类型'
                  }"
                  :selection-list="filterDataSetTypeListAll"
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
                  <span v-if="scope.row.type=='ALL'">全部</span>
                  <span v-else-if="scope.row.type=='PICTURE'">图像</span>
                  <span v-else-if="scope.row.type=='VOICE'">音频</span>
                  <span v-else-if="scope.row.type=='TEXT'">文本</span>
                  <span v-else-if="scope.row.type=='TABLE'">表格</span>
                  <span v-else-if="scope.row.type=='VIDEO'">视频</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="标注样本数/总数" align="left" prop="" min-width="140" show-overflow-tooltip>
              <template slot-scope="scope" class="flex align-center" style="width: 100%;">
                <div class="flex align-center color-content font-size-14">
                  <span><span class="color-blue">{{ scope.row.labeledNum }}</span>/{{ scope.row.taskNumber }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="发布时间"
              align="left"
              prop="releaseTime"
              min-width="100"
              sortable="custom"
              show-overflow-tooltip
            >
              <template slot-scope="scope" class="flex align-center" style="width: 100%;">
                <div class="flex align-center" style="width: 100%;">
                  <span>{{ scope.row.releaseTime && scope.row.releaseTime.split(' ')[0] }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="dialogType !== 'authorization'"
              label="授权时间"
              align="left"
              prop="judgePermission.expiryTimeStart"
              width="160"
              sortable="custom"
              show-overflow-tooltip
            >
              <template slot-scope="scope" class="flex align-center" style="width: 100%;">
                <div class="flex align-center" style="width: 100%;">
                  <span>{{ scope.row.judgePermission.createTime }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="dialogType !== 'authorization'"
              label="状态"
              align="left"
              prop="status"
              show-overflow-tooltip
              min-width="100"
            >
              <template slot="header">
                <TableFiltersPopover
                  :table-label="{
                    'type': 'modelStatus',
                    'label': '状态'
                  }"
                  :selection-list="filterDataSetStatusListAll"
                  :popover-width="'140'"
                  :key-props="{
                    'code': 'value',
                    'label': 'text'
                  }"
                  @filter="filterChange"
                />
              </template>
              <template slot-scope="scope" class="color-content">
                <div v-if="scope.row.isOnline == 0" class="flex align-center">
                  <div class="bgc-green round" style="width: 11px;height: 11px;margin-right: 4px;" />
                  <div>已上线</div>
                </div>
                <div v-if="scope.row.isOnline == 1" class="flex align-center">
                  <div class="round" style="width: 11px;height: 11px;margin-right: 4px;background-color: #8C8C8C;" />
                  <div>已下线</div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--分页-->
        <div
          v-if="pageItemTotal > pageSize"
          class="flex justify-center align-center"
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
        <!--提示弹框-->
        <authorize-dialog-tip-dialog
          v-if="showTipDialog"
          :active-tab="activeTab"
          :data-list="selectionList"
          :model-type-filters="filterModelTypeListAll"
          :user-id="userId"
          @ok="tipDialogOk"
          @cancel="tipDialogCancel"
        />
        <!--取消授权弹框-->
        <batch-cancel-authorization
          v-if="showBatchCancelAuthorizationDialog"
          :number="selectionList.length"
          :type="activeTab"
          :is-batch="false"
          @ok="batchCancelAuthorizationDialogOk"
          @cancel="batchCancelAuthorizationDialogCancel"
        />
      </div>
    </template>
  </generator-dialog>
</template>

<script>
import GeneratorDialog from '@/views/permission-management/user-management/components/GeneratorDialog';
import InputWithSearch from '@/components/InputWithSearch';
import AuthorizeDialogTipDialog from '@/views/permission-management/user-management/components/AuthorizeDialogTipDialog';
import HpjTabs from '@/components/hpj/HpjTabs';
import { getModelBase } from '@/api/model';
import { getDataSetPlatList } from '@/api/data-set';
import { permissionModelList, permissionDatasetList } from '@/api/user';
import {
  batchDataSetAuthorize,
  batchModelAuthorize
} from '@/api/user';
import TableFiltersPopover from '@/components/TableFiltersPopover';
import BatchCancelAuthorization from '@/views/permission-management/user-management/components/BatchCancelAuthorization';
export default {
  name: 'AuthorizeDialog',
  components: {
    HpjTabs,
    GeneratorDialog,
    InputWithSearch,
    AuthorizeDialogTipDialog,
    TableFiltersPopover,
    BatchCancelAuthorization
  },
  props: {
    activeTab: {
      type: String,
      required: true
    },
    dialogType: {
      type: String, // authorization\cancelAuthorization
      default: 'authorization'
    },
    userId: {
      type: String,
      required: true
    },
    filterModelTypeListAll: { // 用于筛选模型类型
      type: Array,
      required: true
    },
    filterModelStatusListAll: { // 用于筛选模型状态
      type: Array,
      default: () => [],
      required: true
    },
    filterDataSetTypeListAll: { // 用于筛选数据集类型
      type: Array,
      required: true
    },
    filterDataSetStatusListAll: { // 用于筛选数据集状态
      type: Array,
      default: () => [],
      required: true
    }
  },
  data() {
    return {
      // tab
      tabList: ['模型', '数据集'],

      // 分页相关
      loading: false, // 加载中
      keyword: '', // 搜索框
      pageItemTotal: 0, // 列表总数
      pageSize: 10, // 每页条数
      currentPage: 1, // 当前页码
      sortColumn: '', // 排序的列名
      sortOrder: '', // 排序方式

      tableData: [], // 列表
      selectionList: [], // 表格勾选数据
      filterModelTypeList: [], // 选中的筛选的模型类型
      filterModelStatusList: [],
      filterDataSetTypeList: [], // 选中的筛选的数据集类型
      filterDataSetStatusList: [],

      // 弹框
      showTipDialog: false,
      showBatchCancelAuthorizationDialog: false,
      modelTableMouseFlag: false,
      modelTableMouseOffset: 0,
      dataSetTableMouseFlag: false,
      dataSetTableMouseOffset: 0,
      modelTableHeight: 0,
      dataSetTableHeight: 0
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 表格鼠标按下滚动 开始
    // 按下鼠标记录鼠标位置
    modelTableMouseDownHandler(e) {
      this.modelTableMouseOffset = e.clientX;
      this.modelTableMouseFlag = true;
    },
    modelTableMouseUpHandler(e) {
      this.modelTableMouseFlag = false;
    },
    modelTableMouseMoveHandler(e) {
      // 这里面需要注意，通过ref需要那个包含table元素的父元素
      if (!this.$refs.modelTable) return;
      const divData = this.$refs.modelTable.bodyWrapper;
      if (this.modelTableMouseFlag) {
        // 设置水平方向的元素的位置
        divData.scrollLeft -= (-this.modelTableMouseOffset + (this.modelTableMouseOffset = e.clientX));
      }
    },
    // 按下鼠标记录鼠标位置
    dataSetTableMouseDownHandler(e) {
      this.dataSetTableMouseOffset = e.clientX;
      this.dataSetTableMouseFlag = true;
    },
    dataSetTableMouseUpHandler(e) {
      this.dataSetTableMouseFlag = false;
    },
    dataSetTableMouseMoveHandler(e) {
      // 这里面需要注意，通过ref需要那个包含table元素的父元素
      if (!this.$refs.dataSetTable) return;
      const divData = this.$refs.dataSetTable.bodyWrapper;
      if (this.dataSetTableMouseFlag) {
        // 设置水平方向的元素的位置
        divData.scrollLeft -= (-this.dataSetTableMouseOffset + (this.dataSetTableMouseOffset = e.clientX));
      }
    },
    // 表格鼠标按下滚动 结束
    changeTab(tab) {
      this.loading = true;
      this.activeTab = tab;
      this.pageSize = 10;
      this.currentPage = 1;
      this.$refs.inputWithSearchEl.searchWord = '';
      this.search();
    },
    sortChange({ column, prop, order }) {
      this.sortColumn = prop;
      this.sortOrder = order;
      if (this.activeTab === '模型') {
        this.$refs.modelTable?.clearSelection();
      } else if (this.activeTab === '数据集') {
        this.$refs.dataSetTable?.clearSelection();
      }
      this.getList();
    },
    // 过滤
    filterChange(type, list) {
      if (type === 'modelType') {
        this.filterModelTypeList = list;
      } else if (type === 'modelStatus') {
        this.filterModelStatusList = list;
      } else if (type === 'datasetType') {
        this.filterDataSetTypeList = list;
      } else if (type === 'datasetStatus') {
        this.filterDataSetStatusList = list;
      }
      if (this.activeTab === '模型') {
        this.filterDataSetTypeList = [];
        this.$refs.modelTable?.clearSelection();
      } else if (this.activeTab === '数据集') {
        this.dataSetChangeAuthorizedList = [];
        this.$refs.dataSetTable?.clearSelection();
      }
      this.currentPage = 1;
      this.getList();
    },
    /** 查看按钮操作 **/
    handleView(item) {
      if (this.activeTab === '模型') {
        // const endIndex = this.findNCharAtString(location.href, '/', 2);
        // window.open(location.href.substring(0, endIndex + 1) + 'model/mineModel/detail/' + id + '/mineModel');
        const endIndex = this.findNCharAtString(location.href, '/', 2);
        item['permissionParam']['status'] = item.status;
        sessionStorage.setItem('permissionParam', JSON.stringify(item.permissionParam));
        window.open(location.href.substring(0, endIndex + 1) + 'model-base/user-model-detail/' + item.id);
      } else if (this.activeTab === '数据集') {
        sessionStorage.setItem('isShowLabelView', true);
        sessionStorage.setItem('isShowForkButton', false);
        const { href } = this.$router.resolve({
          path: `/data-manager/data-set/common-detail/blank/${item.id}/common`
        });
        window.open(href);
      }
    },
    findNCharAtString(str, cha, num) {
      var x = str.indexOf(cha);
      for (var i = 0; i < num; i++) {
        x = str.indexOf(cha, x + 1);
      }
      return x;
    },
    // 模型点击选择框事件
    modelSelectedChange(selectedList) {
      this.selectionList = selectedList;
    },
    // 数据集点击选择框事件
    dataSetSelectedChange(selectedList) {
      this.selectionList = selectedList;
    },
    search(keyword) {
      this.keyword = keyword;
      this.currentPage = 1;
      this.selectionList = [];
      if (this.activeTab === '模型') {
        this.$refs.modelTable?.clearSelection();
      } else if (this.activeTab === '数据集') {
        this.$refs.dataSetTable?.clearSelection();
      }
      this.getList();
    },

    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    // 保存选中的数据id,row-key就是要指定一个key标识这一行的数据
    getRowKey(row) {
      return row.id;
    },
    getList() {
      if (this.activeTab === '模型') {
        this.getModelList();
      } else if (this.activeTab === '数据集') {
        this.getDataSetList();
      }
    },
    getModelList() {
      this.loading = true;
      if (this.dialogType === 'authorization') {
        const params = {
          keywords: this.keyword,
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          userId: this.userId,
          // tag: this.dialogType === 'authorization' ? 7 : 4,
          tag: 7,
          column: this.sortColumn,
          order: this.sortOrder,
          modelTypeIdList: this.filterModelTypeList
        };
        getModelBase(params).then(res => {
          this.tableData = res.data.records;
          this.loading = false;
          this.pageItemTotal = res.data.total;
          this.$nextTick(() => {
            this.modelTableHeight = 500;
            this.$refs.modelTable.bodyWrapper.scrollTop = 0;
          });
        });
      } else {
        const params = {
          keyword: this.keyword,
          modelTypeIdList: this.filterModelTypeList,
          modelPermissionStatusEnums: this.filterModelStatusList,
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          userId: this.userId,
          tag: 4,
          column: this.sortColumn,
          order: this.sortOrder
        };
        permissionModelList(params).then(res => {
          this.tableData = res.data.records;
          this.loading = false;
          this.pageItemTotal = res.data.total;
          this.$nextTick(() => {
            this.modelTableHeight = 500;
            this.$refs.modelTable.bodyWrapper.scrollTop = 0;
          });
        });
      }
    },
    // 获取数据集列表
    getDataSetList() {
      this.loading = true;
      if (this.dialogType === 'authorization') {
        const params = {
          name: this.keyword,
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          applyUserId: this.userId,
          tag: 4,
          column: this.sortColumn,
          order: this.sortOrder,
          typeList: this.filterDataSetTypeList
        };
        getDataSetPlatList(params).then(res => {
          this.tableData = res.data.records;
          this.loading = false;
          this.pageItemTotal = res.data.total;
          this.$nextTick(() => {
            this.dataSetTableHeight = 500;
            this.$refs.dataSetTable.bodyWrapper.scrollTop = 0;
          });
        });
      } else {
        const params = {
          'name': this.keyword,
          'pageNum': this.currentPage,
          'pageSize': this.pageSize,
          'typeList': this.filterDataSetTypeList,
          'statusList': this.filterDataSetStatusList,
          'applyUserId': this.userId,
          'tag': 3,
          'column': this.sortColumn,
          'order': this.sortOrder
        };
        permissionDatasetList(params).then(res => {
          this.tableData = res.data.records;
          this.loading = false;
          this.pageItemTotal = res.data.total;
          this.$nextTick(() => {
            this.dataSetTableHeight = 500;
            this.$refs.dataSetTable.bodyWrapper.scrollTop = 0;
          });
        });
      }
    },
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    ok() {
      if (this.dialogType === 'authorization') {
        this.showTipDialog = true;
      } else {
        this.showBatchCancelAuthorizationDialog = true;
      }
    },
    cancel() {
      this.$emit('cancel');
    },
    // 批量取消授权弹框ok
    batchCancelAuthorizationDialogOk() {
      if (this.activeTab === '模型') {
        const params = {
          cancelFunctionIds: [],
          userId: this.userId
        };
        for (let i = 0; i < this.selectionList.length; i++) {
          params.cancelFunctionIds.push(this.selectionList[i].id);
        }
        batchModelAuthorize(params).then(res => {
          if (res.desc === 'success') {
            this.$message({
              type: 'success',
              message: '成功取消授权' + this.selectionList.length + '个模型'
            });
          } else {
            this.$message({
              type: 'error',
              message: '取消授权' + this.selectionList.length + '个模型失败'
            });
          }
        });
      } else if (this.activeTab === '数据集') {
        const params = {
          cancelFunctionIds: [],
          userId: this.userId
        };
        for (let i = 0; i < this.selectionList.length; i++) {
          params.cancelFunctionIds.push(this.selectionList[i].id);
        }
        batchDataSetAuthorize(params).then(res => {
          if (res.desc === 'success') {
            this.$message({
              type: 'success',
              message: '成功取消授权' + this.selectionList.length + '个数据集'
            });
          } else {
            this.$message({
              type: 'error',
              message: '取消授权' + this.selectionList.length + '个数据集失败'
            });
          }
        });
      }
      this.$emit('ok');
      this.batchCancelAuthorizationDialogCancel();
    },
    // 批量取消授权弹框cancel
    batchCancelAuthorizationDialogCancel() {
      this.showBatchCancelAuthorizationDialog = false;
    },
    tipDialogOk() {
      this.tipDialogCancel();
      this.$emit('ok');
    },
    tipDialogCancel() {
      this.showTipDialog = false;
    },
    modelSelectable(row) {
      if (this.dialogType === 'cancelAuthorization') {
        return row.permissionParam.mine !== 1 && row.permissionParam.mine !== '1';
      } else {
        return true; // 可勾选
      }
    },
    dataSetSelectable(row) {
      if (this.dialogType === 'cancelAuthorization') {
        return row.mine !== 1 && row.mine !== '1';
      } else {
        return true; // 可勾选
      }
    }
  }
};
</script>
