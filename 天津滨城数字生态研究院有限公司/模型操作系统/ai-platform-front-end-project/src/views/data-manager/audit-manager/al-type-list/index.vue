<template>
  <div class="al-type-wrapper">
    <div style="margin-top: 16px">
      <div class="crumbs">
        <div>
          <span>{{ dataSetDetail.name }}</span>
          <span v-if="dataSetDetail.status === 'REJECT'" style="color: #FD5E3A;background: rgba(253,94,58,0.20)">{{ statusMap[dataSetDetail.status] }}</span>
          <span v-if="dataSetDetail.status === 'ON_LINE'" style="color: #00AB5A;background: rgba(0,171,90,0.20)">{{ statusMap[dataSetDetail.status] }}</span>
          <span v-if="dataSetDetail.status === 'WAIT_JUDGE'" style="color: #F66600;background: rgba(246,102,0,0.20)">{{ statusMap[dataSetDetail.status] }}</span>
        </div>
        <div>
          <!--        审核按钮状态判断-->
          <el-button v-if="dataSetDetail.status === 'WAIT_JUDGE'" class="blue-btn" size="mini" @click="handleAudit">审核</el-button>
          <el-button class="return-btn" icon="el-icon-caret-left" @click="returnBack">返回</el-button>
        </div>
      </div>
      <al-describe :data="dataSetDetail" :type="$route.params.type" />
    </div>
    <div v-loading="loading" class="list">
      <el-table
        v-if="detailLabelData.length !== 0"
        ref="multipleTable"
        :data="detailLabelData"
        stripe
        @cell-click="clickCell"
        @mousedown.native="mouseDownHandler"
        @mouseup.native="mouseUpHandler"
        @mousemove.native="mouseMoveHandler"
      >
        <el-table-column label="序号" type="index" width="120" :index="indexMethod" />
        <el-table-column label="ID" prop="id" show-overflow-tooltip width="120" />
        <el-table-column
          v-for="(innerItem, innerIndex) of sourceData"
          :key="innerIndex"
          :label="sourceData.length === 1 && dataSetDetail.type !== 'TABLE' ? '原数据' : innerItem"
          min-width="150"
        >
          <template v-slot="scope">
            <template v-if="dataSetDetail.type === 'PICTURE'">
              <el-image
                class="image-table-container"
                :src="scope.row.sourceData[innerItem].indexOf('http') >=0 ? scope.row.sourceData[innerItem] : labelStudioUrl+scope.row.sourceData[innerItem]"
              />
            </template>
            <template v-if="dataSetDetail.type === 'TEXT'">
              <el-tooltip
                v-model="scope.row.showTooltip"
                placement="top"
                :open-delay="100"
                effect="dark"
                :disabled="!scope.row.showTooltip"
                :popper-class="'table-tool-container'"
              >
                <div slot="content">{{ scope.row.sourceData[innerItem] }}</div>
                <div class="text-table-container" @mouseenter="showTips($event, scope.row, innerItem)">{{ scope.row.sourceData[innerItem] }}</div>
              </el-tooltip>
            </template>
            <template v-if="dataSetDetail.type === 'VOICE' || dataSetDetail.type === 'VIDEO'">
              <audio :ref="'music'+scope.$index" :src="scope.row.sourceData[innerItem].indexOf('http') >=0 ? scope.row.sourceData[innerItem] : labelStudioUrl + scope.row.sourceData[innerItem]" controls />
            </template>
            <template v-if="dataSetDetail.type === 'TABLE'">
              {{ scope.row.sourceData[innerItem] }}
            </template>
          </template>
        </el-table-column>
        <el-table-column label="标注" prop="labeled" sortable show-overflow-tooltip width="100" />
        <el-table-column
          label="操作"
          class-name="table-operation-container"
          align="center"
          show-overflow-tooltip
          width="120"
          fixed="right"
        >
          <template v-slot="scope">
            <TableOperationTooltip icon-class="table-see" tooltip-title="查看" @tooltipClick="handleView(scope.row, scope.$index)" />
          </template>
        </el-table-column>
      </el-table>
      <empty-state v-show="!loading && detailLabelData.length === 0" />
    </div>
    <div v-show="total > pageSize" class="flex justify-center common-dataSet-pagination-container">
      <el-pagination
        background
        :page-size="pageSize"
        layout="prev, pager, next"
        :current-page="currentPage"
        :total="total"
        @current-change="changeCurrentPage"
      />
    </div>
    <audit-dialog
      v-if="showDialogOk"
      @ok="auditOk"
      @reject="auditReject"
      @cancel="auditCancel"
    />
  </div>
</template>

<script>
import AuditDialog from '@/views/data-manager/components/audit-dialog';
import AlDescribe from '@/views/data-manager/components/al-describe';
import { dataCheckInfo, dataCheckPass, dataCheckReject } from '@/api/data-check';
import { getDataSetPlatTaskList } from '@/api/data-set';
import EmptyState from '@/components/EmptyState';
import TableOperationTooltip from '@/components/TableOperationTooltip';
import { mapGetters } from 'vuex';
export default {
  name: 'Index',
  components: {
    AuditDialog,
    AlDescribe,
    EmptyState,
    TableOperationTooltip
  },
  data() {
    return {
      loading: false,
      dataSetDetail: {},
      detailLabelData: [],
      sourceData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      showDialogOk: false,
      statusMap: {
        'REJECT': '已驳回',
        'ON_LINE': '已通过',
        'WAIT_JUDGE': '待审核'
      },
      mouseFlag: false,
      mouseOffset: 0
    };
  },
  computed: {
    ...mapGetters(['labelStudioUrl'])
  },
  mounted() {
    this.getCardDetail();

    this.$nextTick(() => {
      const audios = document.getElementsByTagName('audio');
      // 暂停函数
      function pauseAll() {
        const self = this;
        [].forEach.call(audios, function(i) {
          // 将audios中其他的audio全部暂停
          i !== self && i.pause();
        });
      }
      // 给play事件绑定暂停函数
      [].forEach.call(audios, function(i) {
        i.addEventListener('play', pauseAll.bind(i));
      });
    });
  },
  beforeDestroy() {
    const audios = document.getElementsByTagName('audio');
    // 暂停函数
    function pauseAll() {
      const self = this;
      [].forEach.call(audios, function(i) {
        // 将audios中其他的audio全部暂停
        i !== self && i.pause();
      });
    }
    // 给play事件移除绑定暂停函数
    [].forEach.call(audios, function(i) {
      i.removeEventListener('play', pauseAll);
    });
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
    // 获取详情信息
    getCardDetail() {
      this.loading = true;
      dataCheckInfo(this.$route.params.id).then(res => {
        if (res.code === '000000') {
          this.dataSetDetail = res.data;
          const pageParams = {
            labelStudioProjectId: this.dataSetDetail.labelStudioProjectId,
            token: 'Token d080a2576954dd32d250b2a94380d20292c67322',
            pageNum: this.currentPage,
            pageSize: this.pageSize
          };
          getDataSetPlatTaskList(pageParams).then(res => {
            if (res.code === '000000') {
              this.total = res.data.total;
              this.sourceData = [];
              this.detailLabelData = res.data.tasks.map(item => {
                item.sourceData = {};
                for (const key in item.data) {
                  const typeName = key !== '$undefined$' ? key : this.dataSetDetail.type.toLowerCase();
                  this.sourceData.indexOf(typeName) < 0 ? this.sourceData.push(typeName) : '';
                  item.sourceData[typeName] = item.data[key];
                }
                item.labeled = item.is_labeled ? '是' : '否';
                return item;
              });
              // 先塞一次，加载完直接点击查看
              this.$store.commit('dataSet/CLEAR_ID_LIST');
              this.$store.commit('dataSet/ADD_ID_LIST', { tableData: res.data.tasks, pageNum: this.currentPage });
              this.loading = false;
              if (this.total === 0) return;
              // 缓存id数据，用于详情上下条
              if (this.currentPage * 50 < this.total) {
                // 存Vuex
                getDataSetPlatTaskList({
                  labelStudioProjectId: this.dataSetDetail.labelStudioProjectId,
                  token: 'Token d080a2576954dd32d250b2a94380d20292c67322',
                  pageNum: this.currentPage,
                  pageSize: 50
                }).then(res => {
                  if (res.code === '000000') {
                    this.$store.commit('dataSet/CLEAR_ID_LIST');
                    this.$store.commit('dataSet/ADD_ID_LIST', { tableData: res.data.tasks, pageNum: this.currentPage });
                  }
                }).catch(err => {
                  console.log(err);
                });
              } else {
                const page = Math.ceil(this.total / 50);
                getDataSetPlatTaskList({
                  labelStudioProjectId: this.dataSetDetail.labelStudioProjectId,
                  token: 'Token d080a2576954dd32d250b2a94380d20292c67322',
                  pageNum: page,
                  pageSize: 50
                }).then(res => {
                  if (res.code === '000000') {
                    this.$store.commit('dataSet/CLEAR_ID_LIST');
                    this.$store.commit('dataSet/ADD_ID_LIST', { tableData: res.data.tasks, pageNum: page });
                  }
                }).catch(err => {
                  console.log(err);
                });
              }
            } else {
              this.loading = false;
            }
          }).catch(err => {
            console.log(err);
            this.loading = false;
          });
        }
      });
    },
    // 点击表格单元格
    clickCell(row, column) {
      if (column.property === 'sourceData') {
        this.toLabelView(row);
      }
    },
    handleView(data, index) {
      const rowIndex = (this.currentPage - 1) * this.pageSize + index + 1;
      sessionStorage.setItem('dataSetDetailType', this.dataSetDetail.type);
      this.$router.push({ path: `/data-manager/audit/common-label/${this.$route.params.id}/detail/${data.id}/${rowIndex}` });
    },
    // 分页
    changeCurrentPage(value) {
      this.currentPage = value;
      this.getCardDetail();
    },
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    handleAudit() {
      this.showDialogOk = true;
      this.dialogTitle = '审核数据集';
    },
    auditOk(val) {
      const _this = this;
      const params = {
        applyId: this.$route.params.id,
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
        } else {
          _this.$message({
            message: _this.dialogTitle + '失败!',
            type: 'error'
          });
          this.auditCancel();
        }
      });
    },
    auditReject(val) {
      const _this = this;
      const params = {
        applyId: this.$route.params.id,
        remark: val || ''
      };
      dataCheckReject(params).then(res => {
        if (res.code === '000000') {
          _this.$message({
            message: _this.dialogTitle + '成功!',
            type: 'success'
          });
          _this.auditCancel();
          this.getCardDetail();
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
      this.showDialogOk = false;
    },
    returnBack() {
      this.$router.push({ path: `/data-manager/audit/list` });
    },
    // 文本悬浮显示
    showTips(obj, row, innerItem) {
      // obj为鼠标移入时的事件对象
      // currentWidth 为文本在页面中所占的宽度，创建标签，加入到页面，获取currentWidth ,最后在移除
      const TemporaryTag = document.createElement('span');
      TemporaryTag.innerText = row.sourceData[innerItem];
      TemporaryTag.className = 'getTextWidth';
      document.querySelector('body').appendChild(TemporaryTag);
      const currentWidth = document.querySelector('.getTextWidth').offsetWidth;
      document.querySelector('.getTextWidth').remove();

      // cellWidth为表格容器的宽度
      const cellWidth = obj.target.offsetWidth;

      // 当文本宽度小于||等于容器宽度两倍时，代表文本显示未超过两行
      currentWidth <= (2 * cellWidth) ? row.showTooltip = false : row.showTooltip = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.al-type-wrapper{
  width: 90%;
  margin: 0 auto;
  height: calc(100vh - var(--header-height));
  min-width: var(--main-div-min-width);
  max-width: 1200px;
  .crumbs{
    height: 40px;
    padding-right: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #e4edf8;
    >div:nth-child(1){
      >span:nth-child(1){
        display: inline-block;
        max-width: 650px;
        margin: 0 10px 0 20px;
        font-size: 14px;
        color: #323232;
        letter-spacing: 0;
        line-height: 14px;
        font-weight: 400;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      >span:nth-child(2){
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 68px;
        height: 24px;
        font-size: 12px;
        letter-spacing: -0.51px;
        text-align: center;
        line-height: 14px;
        font-weight: 400;
        border-radius: 16px 1px 16px 1px;
      }
    }
  }
  .common-dataSet-pagination-container {
    margin-top: 16px
  }
  .image-table-container {
    height: 60px;
  }
  ::v-deep .list{
    margin-top: 16px;
    border-radius: 4px;
    min-height: calc(100vh - 360px);
    background: #ffffff;
    .empty-state-container {
      margin-top: 0;
      padding: 10vh;
    }
    .el-table .cell{
      padding-left: 24px;
      height: auto !important;
    }
    .text-table-container {
      display:-webkit-box;
      text-overflow:ellipsis;
      overflow:hidden;
      -webkit-line-clamp: 2;
      -webkit-box-orient:vertical;
    }
    .el-table__header,.el-table__empty-block{
      width: 100% !important;
    }
    .el-table__body-wrapper tr > td {
      height: 84px;
    }
    .el-table__fixed-body-wrapper tr > td {
      height: 84px;
    }
  }
}
</style>
<style lang="scss">
.table-tool-container {
  width: 30%
}
</style>
