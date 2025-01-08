<template>
  <generator-dialog
    :width="900"
    title="提示"
    :top="10"
    :can-ok-button="true"
    @ok="ok"
    @cancel="cancel"
  >
    <template slot="content">
      <!--最外层-->
      <div
        class="flex flex-direction padding-left-24 padding-right-24 padding-bottom-24"
        style="width: 100%;height: 630px;"
      >
        <!--菜单栏-->
        <div class="flex justify-between align-column-center margin-top-8" style="width: 100%;height: 28px;">
          <!--左-->
          <div class="flex align-end" style="height: 100%;">
            <span v-if="activeTab === '模型'" class="font-size-12 color-content" style="line-height: 12px;">
              你确定授权<span class="color-blue">{{ dataList.length }}</span>个模型吗?
            </span>
            <span v-if="activeTab === '数据集'" class="font-size-12 color-content" style="line-height: 12px;">
              你确定授权<span class="color-blue">{{ dataList.length }}</span>个数据集吗?
            </span>
          </div>
          <!--右-->
          <div
            v-if="activeTab === '模型'"
            class="flex align-end font-size-12 color-content"
            style="height: 100%;line-height: 12px;"
          >
            <div><span>已选<span class="color-blue">{{ selectedList.length }}</span>项</span></div>
            <el-button
              type="primary"
              size="mini"
              style="align-self: center;margin-left: 12px;"
              :disabled="selectedList.length == 0"
              @click="setTimeBatch"
            >批量设置期限</el-button>
          </div>
        </div>
        <!--表格-->
        <div class="margin-top-8" style="width: 100%;">
          <el-table
            v-if="activeTab === '模型'"
            :key="activeTab"
            ref="filterTable"
            v-loading="loading"
            style="width: 100%;border-radius: 2px;"
            height="calc(100%)"
            border
            :data="dataShow"
            :row-key="getRowKey"
            @selection-change="handleSelectionChange"
            @mousedown.native="mouseDownHandler"
            @mouseup.native="mouseUpHandler"
            @mousemove.native="mouseMoveHandler"
          >
            <el-table-column type="selection" align="center" min-width="55" :reserve-selection="true" />
            <el-table-column type="index" label="序号" min-width="50" :index="indexMethod" />
            <el-table-column
              label="ID"
              align="left"
              prop="id"
              show-overflow-tooltip
              min-width="80"
            />
            <el-table-column
              label="模型名称"
              align="left"
              prop="modelNameCh"
              show-overflow-tooltip
              min-width="210"
            />
            <el-table-column label="模型类型" align="left" prop="typeName" show-overflow-tooltip min-width="110">
              <template slot="header">
                <TableFiltersPopover
                  :table-label="{
                    'type': 'type',
                    'label': '模型类型'
                  }"
                  :selection-list="modelTypeFilters"
                  :popover-width="'180'"
                  :key-props="{
                    'code': 'text',
                    'label': 'text'
                  }"
                  @filter="filterChange"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="模型期限"
              align="left"
              prop="canUseTime"
              show-overflow-tooltip
              min-width="180"
            >
              <template v-slot="scope" class="flex align-center" style="width: 100%;">
                <div class="flex align-center" style="width: 100%;">
                  <span class="color-content">
                    {{ scope.row.expiryTimeStart && scope.row.expiryTimeStart.split(' ')[0] + '- ' + scope.row.expiryTimeEnd.split(' ')[0] }}
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              prop="operator"
              show-overflow-tooltip
              width="60"
              fixed="right"
              class-name="table-operation-container"
            >
              <template slot-scope="scope" class="flex">
                <TableOperationTooltip icon-class="table-deadline" tooltip-title="设置期限" :icon-disabled="scope.row.status === '取消授权'" @tooltipClick="setTimeOne(scope.row)" />
              </template>
            </el-table-column>
          </el-table>
          <el-table
            v-if="activeTab === '数据集'"
            :key="activeTab"
            ref="dataSetTable"
            v-loading="loading"
            height="calc(100%)"
            :row-key="getRowKey"
            style="width: 100%;border-radius: 2px;"
            border
            :data="dataShow"
          >
            <el-table-column
              label="序号"
              align="left"
              type="index"
              min-width="40"
              :index="indexMethod"
              :reserve-selection="true"
            />
            <el-table-column label="ID" align="left" prop="id" min-width="60" />
            <el-table-column label="数据集名称" align="left" prop="name" min-width="200" />
            <!--            :filter-method="dataSetTypeFilter"-->
            <el-table-column label="类型" align="left" prop="type" min-width="70">
              <template slot="header">
                <TableFiltersPopover
                  :table-label="{
                    'type': 'type',
                    'label': '类型'
                  }"
                  :selection-list="dataSetTypeFilters"
                  :popover-width="'140'"
                  :key-props="{
                    'code': 'value',
                    'label': 'text'
                  }"
                  @filter="filterChange"
                />
              </template>
              <template slot-scope="scope" class="flex align-center" style="width: 100%;">
                <div v-if="scope.row.type" class="flex align-center" style="width: 100%;">
                  <span v-if="scope.row.type == 'ALL'">全部</span>
                  <span v-else-if="scope.row.type == 'PICTURE'">图像</span>
                  <span v-else-if="scope.row.type == 'VOICE'">音频</span>
                  <span v-else-if="scope.row.type == 'TEXT'">文本</span>
                  <span v-else-if="scope.row.type == 'TABLE'">表格</span>
                  <span v-else-if="scope.row.type == 'VIDEO'">视频</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--分页-->
        <div
          v-if="pageItemTotal > pageSize || pageSize !== 10"
          class="flex justify-center align-center"
          style="width: 100%;height: 60px;"
        >
          <el-pagination
            background
            :page-size="pageSize"
            layout="total,prev, pager, next,sizes,jumper"
            :page-sizes="[10, 20, 30, 40]"
            :current-page="currentPage"
            :total="pageItemTotal"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
        <!--设置期限弹窗框-->
        <set-time-dialog
          v-if="showSetTimeDialog"
          :begin-date="selectedOne ? selectedOne.expiryTimeStart : null"
          :end-date="selectedOne ? selectedOne.expiryTimeEnd : null"
          @ok="setTimeDialogOk"
          @cancel="setTimeDialogCancel"
        />
      </div>
    </template>
  </generator-dialog>
</template>

<script>
import generatorDialog from '@/views/permission-management/user-management/components/GeneratorDialog';
import SetTimeDialog from '@/views/permission-management/user-management/components/SetTimeDialog';
import TableFiltersPopover from '@/components/TableFiltersPopover';
import TableOperationTooltip from '@/components/TableOperationTooltip';
import { parseTime } from '@/utils';
import { batchDataSetAuthorize, batchModelAuthorize } from '@/api/user';
export default {
  name: 'AuthorizeDialogTipDialog',
  components: {
    generatorDialog,
    SetTimeDialog,
    TableFiltersPopover,
    TableOperationTooltip
  },
  props: {
    activeTab: {
      type: String,
      required: true
    },
    dataList: {
      type: Array,
      default: () => [],
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    modelTypeFilters: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      // 分页相关
      loading: false, // 加载中
      keyword: '', // 搜索框
      pageItemTotal: 0, // 列表总数
      pageSize: 10, // 每页条数
      currentPage: 1, // 当前页码

      // 数据相关
      dataShow: [], // 用来展示的列表
      selectedList: [],
      selectedOne: null,
      selectedIdList: [],
      // 用于筛选模型类型
      filterModelTypeList: [],
      // 用于筛选数据集
      dataSetTypeFilters: [
        { text: '图像', value: 'PICTURE' },
        { text: '音频', value: 'VOICE' },
        { text: '文本', value: 'TEXT' },
        { text: '表格', value: 'TABLE' },
        { text: '视频', value: 'VIDEO' }
      ], // 类型数据源
      filterDataSetTypeList: [],
      // 弹框相关
      showSetTimeDialog: false,
      mouseFlag: false,
      mouseOffset: 0
    };
  },
  created() {
    // 设置默认时间
    for (let i = 0; i < this.dataList.length; i++) {
      const year = new Date().getFullYear();
      this.dataList[i].expiryTimeStart = parseTime(new Date());
      this.dataList[i].expiryTimeEnd = parseTime(new Date(new Date().setFullYear(year + 1)));
      this.dataShow.push(this.dataList[i]);
    }
    this.getDataShow();
  },
  methods: {
    // 保存选中的数据id,row-key就是要指定一个key标识这一行的数据
    getRowKey(row) {
      return row.id;
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
    async ok() {
      if (this.activeTab === '模型') {
        const params = {
          cancelFunctionIds: [],
          modelDtoList: JSON.parse(JSON.stringify(this.dataList)),
          userId: this.userId
        };
        for (let i = 0; i < params.modelDtoList.length; i++) {
          params.modelDtoList[i].userId = this.userId;
          params.modelDtoList[i].functionId = params.modelDtoList[i].id;
          params.modelDtoList[i].functionType = 1;
          params.modelDtoList[i].name = params.modelDtoList[i].modelNameCh;
          params.modelDtoList[i].type = params.modelDtoList[i].modelTypeId;
          params.modelDtoList[i].releaseTime = params.modelDtoList[i].onlineTime;
        }
        await batchModelAuthorize(params).then(res => {
          if (res.desc === 'success') {
            this.$message({
              type: 'success',
              message: '成功授权' + this.dataList.length + '个模型'
            });
          } else {
            this.$message({
              type: 'error',
              message: '授权' + this.dataList.length + '个模型失败'
            });
          }
        });
      } else if (this.activeTab === '数据集') {
        const params = {
          cancelFunctionIds: [],
          dataSetDtoList: this.dataList,
          userId: this.userId
        };
        for (let i = 0; i < params.dataSetDtoList.length; i++) {
          params.dataSetDtoList[i].userId = this.userId;
          params.dataSetDtoList[i].functionId = params.dataSetDtoList[i].id;
          params.dataSetDtoList[i].functionType = 2;
          params.dataSetDtoList[i].typeEnum = params.dataSetDtoList[i].type;
          params.dataSetDtoList[i].type = 0;
        }
        await batchDataSetAuthorize(params).then(res => {
          if (res.desc === 'success') {
            this.$message({
              type: 'success',
              message: '成功授权' + this.dataList.length + '个数据集'
            });
          } else {
            this.$message({
              type: 'error',
              message: '授权' + this.dataList.length + '个数据集失败'
            });
          }
        });
      }
      this.$emit('ok');
    },
    cancel() {
      this.$emit('cancel');
    },
    handleSelectionChange(list) {
      this.selectedList = list;
    },
    // 为单个项设置期限
    setTimeOne(form) {
      this.selectedOne = form;
      this.showSetTimeDialog = true;
      this.selectedIdList = this.selectedList.map(item => { return item.id; });
    },
    // 批量设置期限
    setTimeBatch() {
      this.showSetTimeDialog = true;
      this.selectedIdList = this.selectedList.map(item => { return item.id; });
    },
    setTimeDialogOk(object) {
      if (this.selectedOne != null) {
        // 为单个模型设置期限
        for (let i = 0; i < this.dataShow.length; i++) {
          if (this.dataShow[i].id === this.selectedOne.id) {
            this.dataShow[i].expiryTimeStart = object.beginDate;
            this.dataShow[i].expiryTimeEnd = object.endDate;
            const newRow = JSON.parse(JSON.stringify(this.dataShow[i]));
            this.$set(this.dataShow, i, newRow);
          }
          if (this.dataList[i].id === this.selectedOne.id) {
            this.dataList[i].expiryTimeStart = object.beginDate;
            this.dataList[i].expiryTimeEnd = object.endDate;
            const newRow = JSON.parse(JSON.stringify(this.dataList[i]));
            this.$set(this.dataList, i, newRow);
          }
        }
      } else {
        // 为多个模型设置期限
        for (let i = 0; i < this.dataShow.length; i++) {
          for (let j = 0; j < this.selectedList.length; j++) {
            if (this.dataShow[i].id === this.selectedList[j].id) {
              this.dataShow[i].expiryTimeStart = object.beginDate;
              this.dataShow[i].expiryTimeEnd = object.endDate;
              const newRow = JSON.parse(JSON.stringify(this.dataShow[i]));
              this.$set(this.dataShow, i, newRow);
            }
            if (this.dataList[i].id === this.selectedList[j].id) {
              this.dataList[i].expiryTimeStart = object.beginDate;
              this.dataList[i].expiryTimeEnd = object.endDate;
              const newRow = JSON.parse(JSON.stringify(this.dataList[i]));
              this.$set(this.dataList, i, newRow);
            }
          }
        }
      }
      this.setTimeDialogCancel();
    },
    setTimeDialogCancel() {
      this.showSetTimeDialog = false;
      this.selectedOne = null;
    },
    // 分页器
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getDataShow();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDataShow();
    },
    // 获取展示列表
    getDataShow() {
      const list = [];
      this.dataList.forEach((item) => {
        if (this.activeTab === '模型') {
          if (this.filterModelTypeList.length > 0) {
            if (this.filterModelTypeList.indexOf(item.typeName) >= 0) {
              list.push(item);
            }
          } else {
            list.push(item);
          }
          this.$nextTick(() => {
            this.$refs.filterTable.bodyWrapper.scrollTop = 0;
          });
        } else if (this.activeTab === '数据集') {
          if (this.filterDataSetTypeList.length > 0) {
            if (this.filterDataSetTypeList.indexOf(item.type) >= 0) {
              list.push(item);
            }
          } else {
            list.push(item);
          }
          this.$nextTick(() => {
            this.$refs.dataSetTable.bodyWrapper.scrollTop = 0;
          });
        }
      });
      this.pageItemTotal = list.length;
      this.dataShow = [];
      for (let i = (this.currentPage - 1) * this.pageSize; i < this.currentPage * this.pageSize && i < this.pageItemTotal; i++) {
        this.dataShow.push(JSON.parse(JSON.stringify(list[i])));
      }
      this.$nextTick(() => {
        if (this.selectedIdList.length > 0) {
          this.selectedIdList.forEach(row => {
            if (row) {
              const newRow = this.dataShow.find(item => { return item.id === row; });
              if (this.activeTab === '模型') {
                this.$refs.filterTable.toggleRowSelection(newRow, true);
              } else if (this.activeTab === '数据集') {
                this.$refs.dataSetTable.toggleRowSelection(newRow, true);
              }
            }
          });
        }
      });
    },
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    // 过滤
    filterChange(type, list) {
      this.currentPage = 1;
      if (this.activeTab === '模型') {
        this.filterModelTypeList = list;
      } else if (this.activeTab === '数据集') {
        this.filterDataSetTypeList = list;
      }
      this.getDataShow();
    }
  }
};
</script>
