<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-07-05 14:01:29
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-11-02 09:47:05
 * @FilePath: \ai-platform-front-end-project\src\views\data-manager\dataSet\detail\common\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%A
-->
<template>
  <div class="common-dataSet-container">
    <DetailCard
      :card-detail="dataSetDetail"
      :is-show-fork="setIsShowFork()"
      :info-type="'data-set'"
      :tag-type="tagType"
      @back="backList"
      @fork="forkDataSet"
    />
    <div v-loading="loading" class="detail-container">
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
          <template slot-scope="scope">
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
          v-if="setIsShowLabelView()"
          class-name="table-operation-container"
          label="操作"
          align="center"
          show-overflow-tooltip
          width="120"
          fixed="right"
        >
          <template slot-scope="scope">
            <TableOperationTooltip icon-class="table-see" tooltip-title="查看" @tooltipClick="toLabelView(scope.row, scope.$index)" />
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
    <!-- fork弹框-->
    <MessageDialog
      v-if="isShowForkMessageDialog"
      :save-btn-title="'确定'"
      @save="saveFork"
      @cancel="cancelFork"
    >
      <template slot="content">
        <div class="content-container" v-html="forkMessageContent" />
      </template>
    </MessageDialog>
    <!-- 加载弹框 -->
    <MessageDialog
      v-if="isShowLoadingMessageDialog"
      :is-show-footer="false"
      :is-show-close-button="messageType !== 'loading'"
      @cancel="cancelLoadingMessage"
    >
      <template slot="content">
        <div class="content-container">
          <template v-if="loadingMessageType === 'loading'">
            <svg-icon
              class-name="loading-icon"
              icon-class="loading"
            />
            <div class="label-color">正在Fork中</div>
          </template>
          <template v-else-if="loadingMessageType === 'error'">
            <svg-icon
              class-name="error-icon"
              icon-class="error"
            />
            <div class="error-color">Fork失败</div>
          </template>
        </div>
      </template>
    </MessageDialog>
    <!-- 跳转弹框 -->
    <MessageDialog
      v-if="isShowViewMessageDialog"
      :save-btn-title="'查看'"
      @save="saveView"
      @cancel="cancelView"
    >
      <template slot="content">
        <div class="content-container" v-html="viewMessageContent" />
      </template>
    </MessageDialog>
  </div>
</template>
<script>
import DetailCard from '@/views/data-manager/dataSet/components/DetailCard';
import MessageDialog from '@/views/data-manager/dataSet/components/MessageDialog';
import { getDataSetPlatDetail, getDataSetPlatTaskList, checkVerify, forkDataSet, getDataSetEditDetail } from '@/api/data-set';
import EmptyState from '@/components/EmptyState';
import TableOperationTooltip from '@/components/TableOperationTooltip';
import { mapGetters } from 'vuex';
export default {
  components: {
    DetailCard,
    MessageDialog,
    EmptyState,
    TableOperationTooltip
  },
  data() {
    return {
      webType: 'self',
      tagType: 'permission',
      dataSetDetail: {},
      loading: false,
      detailLabelData: [],
      total: 0, // 分页总数
      currentPage: 1, // 当前页
      pageSize: 10, // 每页条数
      isShowForkMessageDialog: false, // 信息提示框显隐
      forkMessageContent: '', // 信息提示框内容
      isShowViewMessageDialog: false, // 信息提示框显隐
      isShowLoadingMessageDialog: false, // 信息提示框显隐
      viewMessageContent: '', // 信息提示框内容
      sourceData: [], // 源数据type列表
      mouseFlag: false,
      mouseOffset: 0,
      loadingMessageType: 'loading'
      // forkedId: ''
    };
  },
  computed: {
    ...mapGetters(['labelStudioUrl', 'roleName'])
  },
  mounted() {
    this.webType = this.$route.params.webType;
    this.tagType = this.$route.params.tagType;
    this.init();
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
    async init() {
      await this.getCardDetail();
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
    // 返回
    backList() {
      this.$router.push({ path: '/data-manager/data-set/list' });
    },
    // fork
    forkDataSet() {
      if (this.dataSetDetail.isFork) {
        // 第一次fork
        this.isShowForkMessageDialog = true;
        this.forkMessageContent = `确定要Fork一份<span class="label-color">&nbsp;&nbsp;${this.dataSetDetail.id}-${this.dataSetDetail.name}&nbsp;&nbsp;</span>吗?`;
      } else {
        // 不是第一次fork
        this.isShowForkMessageDialog = true;
        this.forkMessageContent = `你已Fork过<span class="label-color">&nbsp;&nbsp;${this.dataSetDetail.id}-${this.dataSetDetail.name}&nbsp;&nbsp;</span><br>确定要重新Fork一份吗?`;
      }
    },
    // 确定fork
    saveFork() {
      this.isShowLoadingMessageDialog = true;
      this.loadingMessageType = 'loading';
      this.forkedId = '';
      forkDataSet({
        id: this.$route.params.id,
        labelStudioProjectId: this.dataSetDetail.labelStudioProjectId,
        token: 'Token d080a2576954dd32d250b2a94380d20292c67322'
      }).then(res => {
        if (res.code === '000000') {
          this.cancelLoadingMessage();
          this.isShowViewMessageDialog = true;
          this.dataSetDetail.isFork = false;
          // this.forkedId = res.data
          this.viewMessageContent = `已成功Fork<span class="label-color">&nbsp;&nbsp;${this.dataSetDetail.id}-${this.dataSetDetail.name}&nbsp;&nbsp;</span>到<span class="label-color">&nbsp;&nbsp;我的&nbsp;&nbsp;</span>数据模块<br>要去查看吗?`;
        } else {
          this.isShowViewMessageDialog = false;
          this.loadingMessageType = 'error';
          setTimeout(() => {
            this.cancelLoadingMessage();
            this.cancelFork();
          }, 3000);
        }
      }).catch(err => {
        console.log(err);
        setTimeout(() => {
          this.cancelLoadingMessage();
          this.cancelFork();
        }, 3000);
        this.loadingMessageType = 'error';
        this.isShowViewMessageDialog = false;
      });
    },
    // 取消fork
    cancelFork() {
      this.isShowForkMessageDialog = false;
    },
    // 确定查看
    saveView() {
      this.isShowForkMessageDialog = false;
      this.isShowViewMessageDialog = false;
      this.$router.push({ path: `/data-manager/data-set/list` });
    },
    // 取消查看
    cancelView() {
      this.isShowForkMessageDialog = false;
      this.isShowViewMessageDialog = false;
    },
    cancelLoadingMessage() {
      this.isShowLoadingMessageDialog = false;
    },
    // 获取详情信息
    async getCardDetail() {
      this.loading = true;
      // 临时加 this.webType === 'blank'
      // if (this.webType === 'self' || this.webType === 'blank') {
      if (this.tagType === 'common' || this.tagType === 'permission') {
        getDataSetPlatDetail(this.$route.params.id).then(res => {
          if (res.code === '000000') {
            this.dataSetDetail = res.data;
            // if (this.webType === 'self') {
              checkVerify({
                id: this.$route.params.id,
                labelStudioProjectId: this.dataSetDetail.labelStudioProjectId,
                token: 'Token d080a2576954dd32d250b2a94380d20292c67322'
              }).then(res => {
                if (res.code === '000000') {
                  this.dataSetDetail.isFork = res.data;
                } else {
                  this.dataSetDetail.isFork = true;
                }
              }).catch(err => {
                console.log(err);
                this.dataSetDetail.isFork = true;
              });
            // } else {
            //   this.dataSetDetail.isFork = false;
            // }
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
                  // 存Vuex
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
      } else {
        await getDataSetEditDetail(this.$route.params.id).then(res => {
          if (res.code === '000000') {
            this.dataSetDetail = res.data;
            this.dataSetDetail.isFork = false;
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
                  item.labeled = item.is_labeled ? '1' : '0';
                  return item;
                });
                // 先塞一次，加载完直接点击查看
                this.$store.commit('dataSet/CLEAR_ID_LIST');
                this.$store.commit('dataSet/ADD_ID_LIST', { tableData: res.data.tasks, pageNum: this.currentPage });
                this.loading = false;
              } else {
                this.loading = false;
              }
            }).catch(err => {
              console.log(err);
              this.loading = false;
            });
          }
        }).catch(err => {
          console.log(err);
          this.dataSetDetail.isFork = false;
        });
      }
      // } else if (this.tagType === 'mine') {
      //   getDataSetEditDetail(this.$route.params.id).then(res => {
      //     if (res.code === '000000') {
      //       this.dataSetDetail = res.data;
      //       this.dataSetDetail.isFork = false;
      //       const pageParams = {
      //         labelStudioProjectId: this.dataSetDetail.labelStudioProjectId,
      //         token: 'Token d080a2576954dd32d250b2a94380d20292c67322',
      //         pageNum: this.currentPage,
      //         pageSize: this.pageSize
      //       };
      //       getDataSetPlatTaskList(pageParams).then(res => {
      //         if (res.code === '000000') {
      //           this.total = res.data.total;
      //           this.sourceData = [];
      //           this.detailLabelData = res.data.tasks.map(item => {
      //             item.sourceData = {};
      //             for (const key in item.data) {
      //               const typeName = key !== '$undefined$' ? key : this.dataSetDetail.type.toLowerCase();
      //               this.sourceData.indexOf(typeName) < 0 ? this.sourceData.push(typeName) : '';
      //               item.sourceData[typeName] = item.data[key];
      //             }
      //             item.labeled = item.is_labeled ? '是' : '否';
      //             return item;
      //           });
      //           // 先塞一次，加载完直接点击查看
      //           this.$store.commit('dataSet/CLEAR_ID_LIST');
      //           this.$store.commit('dataSet/ADD_ID_LIST', { tableData: res.data.tasks, pageNum: this.currentPage });
      //           this.loading = false;
      //         } else {
      //           this.loading = false;
      //         }
      //       }).catch(err => {
      //         console.log(err);
      //         this.loading = false;
      //       });
      //     }
      //   }).catch(err => {
      //     console.log(err);
      //     this.dataSetDetail.isFork = false;
      //   });
      // }
    },
    // 分页
    changeCurrentPage(value) {
      this.currentPage = value;
      this.getCardDetail();
    },
    // 点击表格单元格
    clickCell(row, column) {
      if (column.property === 'sourceData') {
        this.toLabelView(row);
      }
    },
    // 查看表格数据
    toLabelView(row, index) {
      const rowIndex = (this.currentPage - 1) * this.pageSize + index + 1;
      sessionStorage.setItem('dataSetDetailType', this.dataSetDetail.type);
      this.$router.push({ path: `/data-manager/data-set/common-label/${this.webType}/${this.$route.params.id}/${this.$route.params.tagType}/detail/${row.id}/${rowIndex}` });
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
    },
    // 序号排序
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    setIsShowFork() {
      if (sessionStorage.getItem('isShowForkButton') === 'true') {
        return true;
      } else {
        return false;
      }
    },
    setIsShowLabelView() {
      if (sessionStorage.getItem('isShowLabelView') === 'true') {
        // 后续优化的统一标准，目前只做埋点操作（目前模型管理列表体验数据跳转使用）
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.common-dataSet-container {
  width: 90%;
  padding: 16px 0;
  margin: auto;
  min-width: var(--main-div-min-width);
  max-width: 1200px;
  .detail-container {
    background: #FFFFFF;
    border-radius: 4px;
    margin-top: 16px;
    min-height: calc(100vh - 360px);
  }
  .common-dataSet-pagination-container {
    margin-top: 16px
  }
  ::v-deep {
    .el-table .cell{
      padding-left: 24px;
      height: auto !important;
    }
    .el-table {
      .el-table__header-wrapper, .el-table__fixed-header-wrapper {
        th {
          word-break: break-word;
          background: #FFFFFF;
          color: #515a6e;
          height: 40px;
          font-size: 14px;
        }
      }
      .el-table__body-wrapper, .el-table__fixed-body-wrapper {
        td {
          height: 84px;
        }
      }
    }
    .empty-state-container {
      margin-top: 0;
      padding: 10vh;
    }
  }
  .image-table-container {
    height: 60px;
  }
  .text-table-container {
    display:-webkit-box;
    text-overflow:ellipsis;
    overflow:hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient:vertical;
  }
  .content-container {
    ::v-deep {
      .loading-icon {
        width: 24px;
        height: 24px;
        margin-bottom: 16px;
        animation: transformRotate 4s linear infinite;
      }
      .error-icon {
        width: 24px;
        height: 24px;
        margin-bottom: 16px;
      }
      .label-color {
        color: #0164FF;
      }
      .error-color {
        color: #FD5E3A;
        & + .error-color {
          margin-top: 16px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.table-tool-container {
  max-width: 30%
}
</style>
