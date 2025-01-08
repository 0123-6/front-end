<template>
  <el-dialog
    v-dialogDrag
    :custom-class="'upload-file-dialog'"
    width="900px"
    visible
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="cancel"
    :title="'选择数据集'"
  >
    <div
      class="flex flex-direction"
    >
      <div class="flex justify-between" style="width: 100%; height: 514px">
        <div class="flex flex-direction" style="width: 100%; height: 100%">
          <!--上-->
          <div class="flex flex-direction">
            <!--平台or我的-->
            <div class="flex align-center margin-top-8" style="padding: 0 24px">
              <hpj-tabs :tab-list="tabList" :active-tab.sync="pingtaiOrMine" @change="changeActiveTab" />
              <InputWithSearch class="inline-search" :placeholder="'请输入数据集名称'" @search="searchList" />
            </div>
          </div>
          <!--中，下，表格和分页-->
          <div
            v-loading="loading"
            class=""
            style="width: 100%; padding: 8px 24px; height: 400px"
          >
            <!-- 高度不要动 -->
            <!--table-->
            <el-table
              ref="filterTable"
              highlight-current-row
              :height="tableHeight"
              :data="tableData"
              border
              @sort-change="sortChange"
              @current-change="handleCurrentChange"
              @mousedown.native="mouseDownHandler"
              @mouseup.native="mouseUpHandler"
              @mousemove.native="mouseMoveHandler"
            >
              <el-table-column
                label="ID"
                prop="id"
                align="left"
                show-overflow-tooltip
                sortable="custom"
                min-width="60"
              >
                <template
                  slot-scope="scope"
                  class="flex align-center"
                  style="width: 100%"
                >
                  <el-radio
                    v-model="selectedIndex"
                    :label="scope.row.id"
                    @change="handleCurrentChange(scope.row)"
                  />
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                align="left"
                prop="name"
                show-overflow-tooltip
                min-width="150"
              />
              <el-table-column
                label="类型"
                align="left"
                prop="type"
                show-overflow-tooltip
                width="80"
              >
                <template v-slot="scope">
                  <span>{{ typeMap[scope.row.type] }}</span>
                </template>
              </el-table-column>
              <!--                <el-table-column label="大小" align="left" prop="age" show-overflow-tooltip min-width="100"/>-->
              <el-table-column
                label="样本"
                align="left"
                prop="taskNumber"
                show-overflow-tooltip
                min-width="80"
                sortable="custom"
              />
              <el-table-column
                v-if="isShowLabelTemplate"
                label="标注模板"
                align="left"
                prop="labelTemplate"
                show-overflow-tooltip
                min-width="150"
              >
                <template v-slot="scope">
                  <span>{{ scope.row.groupTitle }}/{{ scope.row.templateTitle }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="发布时间"
                sortable="custom"
                align="left"
                :prop="pingtaiOrMine === '平台' ? 'releaseTime' : 'createTime'"
                show-overflow-tooltip
                min-width="130"
              />
              <el-table-column
                label="操作"
                class-name="table-operation-container"
                align="center"
                prop="操作"
                show-overflow-tooltip
                width="60"
                fixed="right"
              >
                <template
                  slot-scope="scope"
                  class="flex"
                  style="width: 100%"
                >
                  <TableOperationTooltip icon-class="table-see" tooltip-title="查看" @tooltipClick="handleView(scope.row.id)" />
                </template>
              </el-table-column>
            </el-table>
            <div
              v-if="isShowTips"
              class="flex font-size-14 margin-top-8"
              style="color: #b7b7b7"
            >
              提示：模型体验最多支持10个样本推理，如选择的数据集样本大于10，则取前10个样本。
            </div>
            <!--下,分页-->
            <div
              v-if="pageItemTotal > pageSize"
              class="flex justify-center align-center"
              style="width: 100%; height: 60px"
            >
              <el-pagination
                background
                :page-size="pageSize"
                layout="total,prev, pager, next,sizes,jumper"
                :page-sizes="[10, 20, 30, 40]"
                :current-page="currentPage"
                :total="pageItemTotal"
                @size-change="changePageSize"
                @current-change="changePageNum"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <template slot="footer">
      <div
        class="flex flex-1 justify-center align-center margin-top-8"
        style="width: 100%;height:30px"
      >
        <el-button class="white-btn" @click="cancel">取消</el-button>
        <el-button class="blue-btn" @click="ok">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { getDataSetListMine, getDataSetListPlateform } from '@/api/data-set';
import HpjTabs from '@/components/hpj/HpjTabs';
import InputWithSearch from '@/components/InputWithSearch';
import TableOperationTooltip from '@/components/TableOperationTooltip';
import { mapGetters } from 'vuex';

export default {
  components: {
    HpjTabs,
    InputWithSearch,
    TableOperationTooltip
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    recordSelectedData: {
      type: Object,
      required: false
    },
    isShowTips: {
      type: Boolean,
      default: true
    },
    selectedType: {
      type: String,
      default: '' // 'PICTURE','VOICE','TEXT','TABLE','VIDEO'
    },
    selectedLabelTemplateType: {
      type: [String, Number],
      default: ''
    },
    isShowLabelTemplate: {
      type: Boolean,
      default: false
    },
    formWebType: {
      type: String, // experience(模型库体验demo) validate(模型校验)
      required: true
    }
  },
  data() {
    return {
      tableData: [], // 主要内容
      currentSelectedDataSet: null,
      selectedIndex: -1,

      tabList: ['我的', '平台'],
      pingtaiOrMine: '我的', // 平台，我的

      loading: false, // 加载中

      keyword: '', // 搜索框
      pageItemTotal: 0, // 列表总数
      pageSize: 10, // 每页条数
      currentPage: 1, // 当前页码
      mouseOffset: 0,
      otherTabPagination: {
        pageItemTotal: 0,
        pageSize: 10,
        currentPage: 1
      }, // 面板切换时记录前一个tab分页
      typeMap: {
        PICTURE: '图像',
        TEXT: '文本',
        VIDEO: '视频',
        VOICE: '音频',
        TABLE: '表格'
      },
      sortColumn: '', // 排序的列名
      sortOrder: '', // 排序方式
      tableHeight: 0
    };
  },
  computed: {
    ...mapGetters(['userId'])
  },
  watch: {
    recordSelectedData: {
      handler: function(val) {
        if (JSON.stringify(val) !== '{}') {
          this.currentSelectedDataSet = val;
        }
      },
      immediate: true
    },
    pingtaiOrMine: {
      handler: function() {
        this.loading = true;
        // 记录之前分页
        const pagination = JSON.parse(JSON.stringify(this.otherTabPagination));
        this.otherTabPagination = {
          pageItemTotal: this.total,
          currentPage: this.currentPage,
          pageSize: this.pageSize
        };
        this.pageItemTotal = pagination.pageItemTotal;
        this.currentPage = pagination.currentPage;
        this.pageSize = pagination.pageSize;
        this.getDataSetList();
      }
    }
  },
  created() {
    this.loading = true;
    this.getDataSetList();
  },
  methods: {
    // 表格鼠标按下滚动 开始
    // 按下鼠标记录鼠标位置
    mouseDownHandler(e) {
      this.mouseOffset = e.clientY;
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
        divData.scrollTop -= (-this.mouseOffset + (this.mouseOffset = e.clientY));
      }
    },
    // 表格鼠标按下滚动 结束
    // 切换面板
    changeActiveTab(activeTab) {
      this.pingtaiOrMine = activeTab;
    },
    // 查看按钮
    handleView(id) {
      if (this.pingtaiOrMine === '我的') {
        if (this.formWebType === 'validate') {
          sessionStorage.setItem('isShowLabelView', true);
          sessionStorage.setItem('isShowForkButton', false);
        } else if (this.formWebType === 'dataset') {
          sessionStorage.setItem('isShowLabelView', true);
          sessionStorage.setItem('isShowForkButton', false);
        } else if (this.formWebType === 'comparison') {
          sessionStorage.setItem('isShowLabelView', true);
          sessionStorage.setItem('isShowForkButton', false);
        } else if (this.formWebType === 'evaluation') {
          sessionStorage.setItem('isShowLabelView', true);
          sessionStorage.setItem('isShowForkButton', false);
        } else {
          sessionStorage.setItem('isShowLabelView', false);
          sessionStorage.setItem('isShowForkButton', false);
        }
        const { href } = this.$router.resolve({
          // path: `/data-manager/dataSet/mine-detail/blank/${id}`
          path: `/data-manager/data-set/common-detail/blank/${id}/mine`
        });
        window.open(href, '_blank');
      } else {
        if (this.formWebType === 'validate') {
          sessionStorage.setItem('isShowLabelView', true);
          sessionStorage.setItem('isShowForkButton', false);
        } else if (this.formWebType === 'dataset') {
          sessionStorage.setItem('isShowLabelView', true);
          sessionStorage.setItem('isShowForkButton', false);
        } else if (this.formWebType === 'comparison') {
          sessionStorage.setItem('isShowLabelView', true);
          sessionStorage.setItem('isShowForkButton', false);
        } else if (this.formWebType === 'evaluation') {
          sessionStorage.setItem('isShowLabelView', true);
          sessionStorage.setItem('isShowForkButton', false);
        } else {
          sessionStorage.setItem('isShowLabelView', false);
          sessionStorage.setItem('isShowForkButton', false);
        }
        const { href } = this.$router.resolve({
          path: `/data-manager/data-set/common-detail/blank/${id}/permission`
        });
        window.open(href, '_blank');
      }
    },
    sortChange({ column, prop, order }) {
      this.sortColumn = prop;
      this.sortOrder = order;
      this.getDataSetList();
    },
    // 获取数据
    getDataSetList() {
      if (this.pingtaiOrMine === '平台') {
        const params = {
          name: this.keyword,
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          empty: 1,
          label: 1,
          labeledStatus: 'LABELED',
          tag: 3,
          applyUserId: this.userId,
          column: this.sortColumn,
          order: this.sortOrder,
          typeList: this.selectedType === '' ? [] : this.selectedType.split(','),
          templateId: this.selectedLabelTemplateType
        };
        getDataSetListPlateform(params)
          .then((res) => {
            this.pageItemTotal = res.data.total;
            this.tableData = res.data.records;
            this.$nextTick(() => {
              this.tableHeight = 400;
              this.$refs.filterTable.bodyWrapper.scrollTop = 0;
            });
            if (Object.keys(this.currentSelectedDataSet).indexOf('mine') >= 0) {
              this.handleCurrentChange(this.currentSelectedDataSet);
            }
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          });
      } else if (this.pingtaiOrMine === '我的') {
        const params = {
          name: this.keyword,
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          empty: 1,
          label: 1,
          status: 0,
          tag: 0,
          type: this.selectedType === '' ? null : this.selectedType,
          templateId: this.selectedLabelTemplateType
        };
        getDataSetListMine(params)
          .then((res) => {
            this.pageItemTotal = res.data.total;
            this.tableData = res.data.records;
            this.tableHeight = 400;
            this.loading = false;
            this.$nextTick(() => {
              this.tableHeight = 400;
              this.$refs.filterTable.bodyWrapper.scrollTop = 0;
            });
            if (Object.keys(this.currentSelectedDataSet).indexOf('mine') < 0) {
              this.handleCurrentChange(this.currentSelectedDataSet);
            }
          })
          .catch(() => {
            this.loading = false;
          });
      }
    },
    // 输入框搜索
    searchList(value) {
      this.keyword = value;
      this.currentPage = 1;
      this.getDataSetList();
    },
    // 每页选择
    changePageSize(value) {
      this.pageSize = value;
      this.currentPage = 1;
      this.getDataSetList();
    },
    // 分页
    changePageNum(value) {
      this.currentPage = value;
      this.getDataSetList();
    },
    // 选择数据
    selectDataSet(item) {
      this.currentSelectedDataSet = item;
    },
    // 选择
    handleCurrentChange(item) {
      this.currentSelectedDataSet = item;
      this.selectedIndex = item.id;
    },
    ok() {
      this.$emit('ok', this.currentSelectedDataSet);
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .upload-file-dialog {
  margin-top: 20vh !important;
  .el-dialog__header {
    height: 40px;
    line-height: 40px;
    padding: 0 24px;
    border-bottom: 1px solid rgba(242,242,242,1);
    .el-dialog__title {
      font-family: SourceHanSansSC-Bold;
      font-size: 14px;
      color: #262626;
      letter-spacing: 0;
      line-height: 16px;
      font-weight: 700;
    }
  }
  .el-dialog__body {
    padding: 8px 0;
  }
  .el-dialog__footer {
    padding: 24px;
    padding-top: 0;
  }

  .inline-search {
    margin-left: 24px;
  }

  .select-dataSet-container {
    margin-top: 7px;
    width: 100%;
    height: 426px;
    border: 1px solid rgba(226, 231, 234, 1);
    overflow: auto;
  }

  .my-list {
    &:hover {
      background-color: #0164ff;
      color: white;
    }

    &.active {
      background-color: #0164ff;
      color: white;
    }
  }

  .cancel-btn {
    width: 72px;
    height: 32px;
    border: 1px solid rgba(191, 208, 224, 1);
    color: #0164ff;
    padding: 0;
    border-radius: 0;
  }

  .save-btn {
    width: 72px;
    height: 32px;
    background: #0164ff;
    color: #ffffff;
    padding: 0;
    border-radius: 0;
    margin-left: 16px;
  }
}
</style>
