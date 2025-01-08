<template>
  <!--最外层-->
  <div class="flex flex-direction" style="width: 100%;">
    <!--主体-->
    <div class="flex flex-direction bgc-main padding-left-16 padding-right-16" style="width: 100%;">
      <!--标签-->
      <hpj-tabs
        v-if="roleName !== '超级管理员'"
        style="font-size: 14px!important;"
        :tab-list="tabList"
        :active-tab.sync="activeTab"
        class="margin-top-16 tabs-container"
        :normal-background="''"
        @change="changeActiveTab"
      />
      <!--主体-->
      <div
        class="flex flex-direction bgc-white padding-left-24 padding-right-24"
        style="width: 100%;min-height: calc(100vh - 132px);"
        :class="{'margin-top-16 admin-table-container': roleName === '超级管理员'}"
      >
        <!--上-->
        <div v-if="roleName !== '超级管理员'" class="flex flex-direction operation-panel margin-top-16" style="width: 100%;">
          <div class="flex align-center" style="width: 100%;">
            <input-with-search placeholder="请输入模型名称" class="notebook-search-container" @search="search" />
          </div>
        </div>
        <div v-else class="flex align-center operation-panel margin-top-16">
          <div class="flex font-size-16 color-content font-weight">
            我的模型
          </div>
          <div style="margin-left: 24px;">
            <input-with-search placeholder="请输入模型名称" class="notebook-search-container" @search="search" />
          </div>
        </div>
        <!--表格-->
        <div class="margin-top-12">
          <el-table
            v-if="activeTab==='我的'"
            ref="filterTable"
            key="我的"
            v-loading="loading"
            border
            :data="mineModelList"
            :height="mineTableHeight"
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
              show-overflow-tooltip
              width="60"
              sortable="custom"
            />
            <el-table-column
              label="模型名称"
              align="left"
              prop="modelNameCh"
              show-overflow-tooltip
              min-width="200"
            >
              <template slot-scope="scope" class="flex justify-center align-center">
                <span
                  class="hover-to-blue hand"
                  style="font-weight: 400"
                  type="primary"
                  :underline="false"
                  @click="handleView(scope.row)"
                >{{ scope.row.modelNameCh }}</span>
              </template>
            </el-table-column>
            <el-table-column label="模型类型" align="left" prop="modelTypeName" show-overflow-tooltip width="120">
              <template slot="header">
                <TableFiltersPopover
                  :table-label="{
                    'type': 'type',
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
            <el-table-column label="版本" align="left" prop="versionName" show-overflow-tooltip width="80" />
            <el-table-column
              label="创建时间"
              align="left"
              prop="createTime"
              show-overflow-tooltip
              sortable="custom"
              width="160"
            />
            <el-table-column label="状态" align="left" prop="status" show-overflow-tooltip width="100">
              <template slot="header">
                <TableFiltersPopover
                  :table-label="{
                    'type': 'status',
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
                <div v-if="scope.row.status === 'WAIT_RELEASE'" class="flex align-center">
                  <div class="bgc-blue round" style="width: 11px;height: 11px;margin-right: 4px;" />
                  <div>未发布</div>
                </div>
                <div v-if="scope.row.status === 'WAIT_FIRST_JUDGE'" class="flex align-center">
                  <div class="bgc-orange round" style="width: 11px;height: 11px;margin-right: 4px;" />
                  <div>待初审</div>
                </div>
                <div v-if="scope.row.status === 'WAIT_FINAL_JUDGE'" class="flex align-center">
                  <div class="bgc-orange round" style="width: 11px;height: 11px;margin-right: 4px;" />
                  <div>待终审</div>
                </div>
                <div v-if="scope.row.status === 'REJECT'" class="flex align-center">
                  <div class="bgc-red round" style="width: 11px;height: 11px;margin-right: 4px;" />
                  <div>驳回</div>
                </div>
                <div v-if="scope.row.status === 'OFF_LINE'" class="flex align-center">
                  <div class="round" style="width: 11px;height: 11px;margin-right: 4px;background-color: #8C8C8C;" />
                  <div>已下线</div>
                </div>
                <div v-if="scope.row.status === 'ON_LINE'" class="flex align-center">
                  <div class="bgc-green round" style="width: 11px;height: 11px;margin-right: 4px;" />
                  <div>已发布</div>
                </div>
                <div v-if="scope.row.status === 'DEVELOYMENT_FAIL'" class="flex align-center">
                  <!-- <div class="bgc-red round" style="width: 11px;height: 11px;margin-right: 4px;" /> -->
                  <i style="color: #FD5E3A;margin-right: 4px;" class="el-icon-warning-outline icon" />
                  <div>部署失败</div>
                </div>
                <div v-if="scope.row.status === 'UNDER_DEVELOYMENT'" class="flex align-center">
                  <div class="el-icon-time color-blue" style="width: 11px;height: 11px;margin-right: 4px;" />
                  <div>部署中</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="服务时间"
              align="left"
              prop="onlineTime"
              show-overflow-tooltip
              width="120"
              sortable="custom"
            >
              <template slot-scope="scope" class="flex align-center" style="width: 100%;">
                <div class="flex align-center" style="width: 100%;">
                  <span>{{ scope.row.onlineTime && scope.row.onlineTime.split(' ')[0] }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="审核意见" align="left" prop="remark" show-overflow-tooltip min-width="120">
              <template slot-scope="scope" style="width: 100%;">
                <div style="width: 100%;">
                  <div v-if="scope.row.status === 'REJECT'" style="width: 100%;">
                    <el-popover
                      v-if="scope.row.status === 'REJECT'"
                      placement="right"
                      title="驳回申请原因"
                      width="200"
                      trigger="hover"
                      :content="scope.row.remark"
                    >
                      <el-link slot="reference" type="primary" :underline="false">
                        驳回原因&nbsp;<i class="el-icon-question" />
                      </el-link>
                    </el-popover>
                  </div>
                  <div v-else style="width: 100%;">
                    {{ scope.row.remark }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="170" fixed="right" class-name="table-operation-container">
              <template slot-scope="scope" class="flex">
                <TableOperationTooltip icon-class="table-see" tooltip-title="查看" style="margin-right: 8px;" @tooltipClick="handleView(scope.row)" />
                <TableOperationTooltip
                  icon-class="table-edit"
                  tooltip-title="编辑"
                  style="margin-right: 8px;"
                  :icon-disabled="scope.row.status === 'ON_LINE' || scope.row.status === 'UNDER_DEVELOYMENT' || scope.row.status === 'WAIT_FIRST_JUDGE' || scope.row.status === 'WAIT_FINAL_JUDGE'"
                  @tooltipClick="handleEdit(scope.row)"
                />
                <TableOperationTooltip
                  icon-class="table-check"
                  tooltip-title="校验"
                  :icon-disabled="scope.row.status === 'ON_LINE' || scope.row.status === 'UNDER_DEVELOYMENT'"
                  style="margin-right: 8px;"
                  @tooltipClick="toCheckDetail(scope.row)"
                />
                <TableOperationTooltip
                  icon-class="table-release"
                  tooltip-title="申请发布"
                  style="margin-right: 8px;"
                  :icon-disabled="scope.row.status === 'WAIT_FIRST_JUDGE' || scope.row.status === 'WAIT_FINAL_JUDGE'
                    || scope.row.status === 'ON_LINE' || scope.row.status === 'UNDER_DEVELOYMENT'"
                  @tooltipClick="handleApply(scope.row)"
                />
                <TableOperationTooltip
                  icon-class="table-delete"
                  tooltip-title="删除"
                  :icon-disabled="scope.row.status === 'ON_LINE' || scope.row.status === 'UNDER_DEVELOYMENT' || scope.row.status === 'WAIT_FIRST_JUDGE' || scope.row.status === 'WAIT_FINAL_JUDGE'"
                  @tooltipClick="handleDelete(scope.row)"
                />
              </template>
            </el-table-column>
          </el-table>
          <el-table
            v-if="activeTab==='授权'"
            ref="filterTable"
            key="授权"
            v-loading="loading"
            border
            :data="authorizedModelList"
            :height="commonTableHeight"
            @selection-change="handleSelectionChange"
            @mousedown.native="mouseDownHandler"
            @mouseup.native="mouseUpHandler"
            @mousemove.native="mouseMoveHandler"
            @sort-change="sortChange"
          >
            <el-table-column
              label="序号"
              align="left"
              type="index"
              show-overflow-tooltip
              width="60"
            />
            <el-table-column
              label="ID"
              align="left"
              prop="id"
              show-overflow-tooltip
              width="60"
              sortable="custom"
            />
            <el-table-column
              label="模型名称"
              align="left"
              prop="modelNameCh"
              show-overflow-tooltip
              min-width="200"
            >
              <template slot-scope="scope" class="flex justify-center align-center">
                <span
                  class="hover-to-blue hand"
                  style="font-weight: 400"
                  type="primary"
                  :underline="false"
                  @click="handleView(scope.row)"
                >{{ scope.row.modelNameCh }}</span>
              </template>
            </el-table-column>
            <el-table-column label="模型类型" align="left" prop="modelTypeName" show-overflow-tooltip width="120">
              <template slot="header">
                <TableFiltersPopover
                  :table-label="{
                    'type': 'type',
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
            <el-table-column label="版本" align="left" prop="versionName" show-overflow-tooltip width="80" />
            <el-table-column
              label="发布时间"
              align="left"
              prop="onlineTime"
              sortable="custom"
              show-overflow-tooltip
              width="120"
            >
              <template slot-scope="scope" class="flex align-center" style="width: 100%;">
                <div class="flex align-center" style="width: 100%;">
                  <span>{{ scope.row.onlineTime && scope.row.onlineTime.split(' ')[0] }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="授权时间"
              align="left"
              prop="sysUserModelData.createTime"
              sortable="custom"
              show-overflow-tooltip
              width="160"
            >
              <template slot-scope="scope" class="flex align-center" style="width: 100%;">
                <div class="flex align-center" style="width: 100%;">
                  <span>{{ scope.row.sysUserModelData && scope.row.sysUserModelData.createTime }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="到期时间"
              align="left"
              prop="sysUserModelData.expiryTimeEnd"
              show-overflow-tooltip
              width="120"
            >
              <template slot-scope="scope" class="flex align-center" style="width: 100%;">
                <div class="flex align-center" style="width: 100%;">
                  <span>{{ scope.row.sysUserModelData && scope.row.sysUserModelData.expiryTimeEnd.split(' ')[0] }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="left" prop="modelPermissionStatusEnum" show-overflow-tooltip width="100">
              <template slot="header">
                <TableFiltersPopover
                  :table-label="{
                    'type': 'status',
                    'label': '状态'
                  }"
                  :selection-list="filterStatusListAll"
                  :popover-width="'140'"
                  :key-props="{
                    'code': 'value',
                    'label': 'text'
                  }"
                  @filter="filterChange"
                />
              </template>
              <template slot-scope="scope" class="color-content">
                <div v-if="scope.row.modelPermissionStatusEnum === 'ON_LINE'" class="flex align-center">
                  <div class="bgc-green round" style="width: 11px;height: 11px;margin-right: 4px;" />
                  <div>已上线</div>
                </div>
                <div v-if="scope.row.modelPermissionStatusEnum === 'OFF_LINE'" class="flex align-center">
                  <div class="round" style="width: 11px;height: 11px;margin-right: 4px;background-color: #8C8C8C;" />
                  <div>已下线</div>
                </div>
                <div v-if="scope.row.modelPermissionStatusEnum === 'EXPIRED'" class="flex align-center">
                  <div class="round" style="width: 11px;height: 11px;margin-right: 4px;background-color: #8C8C8C;" />
                  <div>已过期</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="60" fixed="right" class-name="table-operation-container">
              <template slot-scope="scope" class="flex">
                <TableOperationTooltip icon-class="table-see" tooltip-title="查看" @tooltipClick="handleView(scope.row)" />
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--分页-->
        <div v-if="pageItemTotal > pageSize" class="flex justify-center model-pagination-container align-center" style="width: 100%;height: 60px;min-height: 60px;">
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
      width="600px"
      :close-on-click-modal="false"
      append-to-body
      :custom-class="'info-dialog'"
      :before-close="() => { showDialog = false }"
    >
      <apply-release ref="applyRelease" :show-dialog.sync="showDialog" @refreshDataList="getList" />
      <div v-if="flag !== 2" slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="$refs['applyRelease'].submitForm()">提交申请</el-button>
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
import {
  mineModelPage,
  delMyModel,
  getModelClassification,
  getMineModelAuthorizedModelList
} from '@/api/model.js';
import applyRelease from '@/views/develop/components/apply-release.vue';
import InputWithSearch from '@/components/InputWithSearch';
import _ from 'lodash';
import HpjTabs from '@/components/hpj/HpjTabs';
import { mapGetters } from 'vuex';
import MessageDialog from '@/views/data-manager/dataSet/components/MessageDialog';
import TableFiltersPopover from '@/components/TableFiltersPopover';
import TableOperationTooltip from '@/components/TableOperationTooltip';

export default {
  name: 'ModelFile',
  components: {
    applyRelease,
    InputWithSearch,
    HpjTabs,
    MessageDialog,
    TableFiltersPopover,
    TableOperationTooltip
  },
  data() {
    return {
      // tab
      tabList: ['我的', '授权'],
      activeTab: '我的',

      keyword: '',
      pageSize: 10,
      currentPage: 1,
      pageItemTotal: 0,
      statusList: [], // 筛选状态
      sortColumn: '', // 排序的列名
      sortOrder: '', // 排序方式

      flag: 0,
      showDialog: false,
      title: '',
      loading: false, // 页面加载
      mineModelList: [], // 我的模型信息
      authorizedModelList: [], // 授权模型信息
      multiple: true, // 非多个禁用
      ids: [],
      showSearch: true, // 显示隐藏搜索条件
      showUploadFileDialog: false,
      mouseFlag: false,
      mouseOffset: 0,
      filterModelStatusListAll: [
        { value: 'WAIT_RELEASE', text: '未发布' },
        { value: 'WAIT_FIRST_JUDGE', text: '待初审' },
        { value: 'WAIT_FINAL_JUDGE', text: '待终审' },
        { value: 'REJECT', text: '驳回' },
        { value: 'OFF_LINE', text: '已下线' },
        { value: 'ON_LINE', text: '已发布' },
        { value: 'DEVELOYMENT_FAIL', text: '部署失败' },
        { value: 'UNDER_DEVELOYMENT', text: '部署中' }
      ],
      filterModelTypeListAll: [], // 模型类型筛选全部
      filterModelTypeList: [], // 模型类型筛选
      filterStatusListAll: [
        { text: '已下线', value: 'OFF_LINE' },
        { text: '已上线', value: 'ON_LINE' },
        { text: '已过期', value: 'EXPIRED' }], // 模型状态全部
      filterStatusList: [], // 过滤的模型状态
      isShowMessageDialog: false, // 信息提示框显隐
      currentDeleteId: '',
      messageContent: '', // 信息提示框内容
      listInterval: null,
      mineTableHeight: 0,
      commonTableHeight: 0
    };
  },
  computed: {
    ...mapGetters(['name', 'avatar', 'roleName', 'userId'])
  },
  created() {
    this.getModelClassification();
    this.getList();
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
        const data = res.data;
        for (let i = 0; i < data.length; i++) {
          const params = {
            text: data[i].typeName,
            value: data[i].id
          };
          this.filterModelTypeListAll.push(params);
        }
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
      if (!this.$refs.filterTable) return;
      const divData = this.$refs.filterTable.bodyWrapper;
      if (this.mouseFlag) {
        // 设置水平方向的元素的位置
        divData.scrollLeft -= (-this.mouseOffset + (this.mouseOffset = e.clientX));
      }
    },
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
    sortChange({ column, prop, order }) {
      if (prop === 'sysUserModelData.createTime') {
        this.sortColumn = prop.split('.')[1];
      } else {
        this.sortColumn = prop;
      }
      this.sortOrder = order;
      this.getList();
    },
    getList() {
      if (this.activeTab === '我的') {
        this.getMineList();
      } else if (this.activeTab === '授权') {
        this.getAuthorizedList();
      }
    },
    getMineList() {
      this.loading = true;
      const params = {
        keyword: this.keyword,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        statusList: this.statusList,
        modelTypeIdList: this.filterModelTypeList,
        column: this.sortColumn,
        order: this.sortOrder
      };
      mineModelPage(params).then(res => {
        if (res.code === '000000') {
          this.pageItemTotal = res.data.total;
          if (
            this.total > 0 &&
            res.data.records.length === 0 &&
            this.currentPage > 1
          ) {
            this.currentPage--;
            this.getMineList();
          }
          this.mineModelList = res.data.records;
          this.$nextTick(() => {
            this.$refs.filterTable.bodyWrapper.scrollTop = 0;
            this.setTableHeight();
          });
          this.loading = false;
          const index = res.data.records.findIndex(item => { return item.status === 'UNDER_DEVELOYMENT'; });
          if (index >= 0) {
            if (this.listInterval) return;
            this.listInterval = setInterval(() => {
              this.getMineList();
            }, 5000);
          } else {
            clearInterval(this.listInterval);
            this.listInterval = null;
          }
        } else {
          this.mineModelList = [];
          this.loading = false;
          clearInterval(this.listInterval);
          this.listInterval = null;
        }
      }).catch(() => {
        this.mineModelList = [];
        this.loading = false;
        clearInterval(this.listInterval);
        this.listInterval = null;
      });
    },
    // 获取授权列表
    getAuthorizedList() {
      this.loading = true;
      const params = {
        'keyword': this.keyword,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        'modelPermissionStatusEnums': this.filterStatusList,
        'modelTypeIdList': this.filterModelTypeList,
        userId: this.userId,
        column: this.sortColumn,
        order: this.sortOrder
      };
      getMineModelAuthorizedModelList(params).then(res => {
        this.authorizedModelList = [];
        this.authorizedModelList = res.data.records;
        document.getElementById('layout-container').scrollTop = 0;
        this.pageItemTotal = res.data.total;
        this.loading = false;
        this.$nextTick(() => {
          this.$refs.filterTable.bodyWrapper.scrollTop = 0;
          this.setTableHeight();
        });
      });
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.multiple = !selection.length;
    },
    // 搜索函数
    search: _.debounce(function(val) {
      this.keyword = val;
      this.initGetListParams();
      this.getList();
    }, 200),
    /** 申请发布 */
    handleApply(row) {
      if (row.status === 'WAIT_FIRST_JUDGE' || row.status === 'WAIT_FINAL_JUDGE' || row.status === 'ON_LINE' || row.status === 'UNDER_DEVELOYMENT') return;
      this.title = '申请发布';
      this.showDialog = true;
      this.$nextTick(() => {
        this.$refs.applyRelease.getInfo(row.id);
      });
    },
    // 查看检验结果
    toCheckDetail(row) {
      if (row.status === 'ON_LINE' || row.status === 'UNDER_DEVELOYMENT') return;
      this.$router.push(`/model/mine-model/validate/${row.id}`);
    },
    /** 查看按钮操作 **/
    handleView(item) {
      if (this.activeTab === '我的') {
        item['permissionParam'] = {
          mine: 1
        };
        item['permissionParam']['status'] = item.status;
        sessionStorage.setItem('permissionParam', JSON.stringify(item.permissionParam));
        sessionStorage.setItem('preRoute', 'mineModel');
        const endIndex = this.findNCharAtString(location.href, '/', 2);
        window.open(location.href.substring(0, endIndex + 1) + 'model/mine-model/detail/' + item.id);
      } else {
        item['permissionParam']['status'] = item.modelPermissionStatusEnum;
        sessionStorage.setItem('permissionParam', JSON.stringify(item.permissionParam));
        sessionStorage.setItem('preRoute', 'mineModel');
        if (this.roleName === '超级管理员') {
          const endIndex = this.findNCharAtString(location.href, '/', 2);
          window.open(location.href.substring(0, endIndex + 1) + 'model/mine-model/detail/' + item.id);
        } else {
          const endIndex = this.findNCharAtString(location.href, '/', 2);
          window.open(location.href.substring(0, endIndex + 1) + 'model-base/detail/' + item.id);
        }
      }
      // this.$router.push({
      //   path: '/model/mineModel/detail/' + item.id + '/mineModel',
      //   query: item.permissionParam
      // });
    },
    // 编辑按钮
    handleEdit(row) {
      if (row.status === 'ON_LINE' || row.status === 'UNDER_DEVELOYMENT' || row.status === 'WAIT_FIRST_JUDGE' || row.status === 'WAIT_FINAL_JUDGE') return;
      sessionStorage.setItem('preRoute', 'modelDevelop');
      this.$router.push('/model/create-model/create/2/' + row.id);
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      if (row.status === 'ON_LINE' || row.status === 'UNDER_DEVELOYMENT' || row.status === 'WAIT_FIRST_JUDGE' || row.status === 'WAIT_FINAL_JUDGE') return;
      this.isShowMessageDialog = true;
      this.currentDeleteId = row.id || this.ids;
      this.messageContent = `确定要删除<span class="label-color">&nbsp;&nbsp;${row.modelNameCh}&nbsp;&nbsp;</span>的模型信息吗?`;
    },
    saveMessage() {
      delMyModel(this.currentDeleteId.toString()).then(res => {
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
    // 切换面板
    changeActiveTab(activeTab) {
      this.activeTab = activeTab;
      this.filterModelTypeList = [];
      this.filterStatusList = [];
      this.statusList = [];
      this.initGetListParams();
      this.getList();
    },
    // 初始化排序参数
    initGetListParams() {
      this.currentPage = 1;
      this.pageSize = 10;
    },
    // 过滤
    filterChange(type, list) {
      this.initGetListParams();
      if (this.activeTab === '我的') {
        if (type === 'type') {
          this.filterModelTypeList = list;
        } else if (type === 'status') {
          this.statusList = list;
        }
      } else if (this.activeTab === '授权') {
        if (type === 'type') {
          this.filterModelTypeList = list;
        } else if (type === 'status') {
          this.filterStatusList = list;
        }
      }
      this.getList();
    },
    findNCharAtString(str, cha, num) {
      var x = str.indexOf(cha);
      for (var i = 0; i < num; i++) {
        x = str.indexOf(cha, x + 1);
      }
      return x;
    },
    // 设置表格高度，做表格滚动表头不动处理
    setTableHeight() {
      const bodyHeight = document.body.offsetHeight;
      const navHeight = document.getElementById('AiHeader-container').offsetHeight;
      const topOperationHeight = document.getElementsByClassName('operation-panel')[0].offsetHeight;
      const paginationHeight = document.getElementsByClassName('model-pagination-container')[0] ? document.getElementsByClassName('model-pagination-container')[0].offsetHeight : 0;
      if (this.roleName !== '超级管理员') {
        const topTabsHeight = document.getElementsByClassName('tabs-container')[0].offsetHeight;
        this.mineTableHeight = bodyHeight - navHeight - topTabsHeight - topOperationHeight - paginationHeight - 64 - 16 - 16;
        this.commonTableHeight = bodyHeight - navHeight - topTabsHeight - topOperationHeight - paginationHeight - 64 - 16 - 16;
        const realMineTableHeight = this.mineModelList.length * 45 + 45;
        if (this.mineModelList.length === 0) {
          this.mineTableHeight = 60 + 45;
        } else {
          this.mineTableHeight > realMineTableHeight ? this.mineTableHeight = realMineTableHeight : '';
        }
        const realCommonTableHeight = this.authorizedModelList.length * 45 + 45;
        if (this.authorizedModelList.length === 0) {
          this.commonTableHeight = 60 + 45;
        } else {
          this.commonTableHeight > realCommonTableHeight ? this.commonTableHeight = realCommonTableHeight : '';
        }
      } else {
        this.mineTableHeight = bodyHeight - navHeight - topOperationHeight - paginationHeight - 64 - 16 - 16;
        const realTableHeight = this.mineModelList.length * 45 + 45;
        if (this.mineModelList.length === 0) {
          this.mineTableHeight = 60 + 45;
        } else {
          this.mineTableHeight > realTableHeight ? this.mineTableHeight = realTableHeight : '';
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.admin-table-container {
  min-height: calc(100vh - 142px) !important;
}
::v-deep .info-dialog {
  .el-dialog__header {
    height: 40px;
    line-height: 40px;
    padding: 0 24px;
    border-bottom: 1px solid #f2f2f2;
    .el-dialog__title {
      font-size: 14px;
      color: #262626;
      font-weight: 700;
    }
  }
}
::v-deep {
  .content-container {
    .label-color {
      color: #0164FF;
    }
  }
}
</style>
