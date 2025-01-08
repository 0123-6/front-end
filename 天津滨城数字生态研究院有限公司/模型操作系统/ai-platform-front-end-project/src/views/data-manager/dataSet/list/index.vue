<template>
  <div class="flex flex-direction dataSet-container">
    <el-tabs v-model="activeTab" type="border-card" class="tabs-container" @tab-click="changeActiveTab">
      <el-tab-pane name="mine">
        <span slot="label" class="name-container">我的</span>
        <div class="operation-container">
          <div class="button-container">
            <el-button
              class="label-type-button"
              :class="{'is-active': searchFrom.labelType === 'ALL'}"
              @click="changeLabelType('ALL')"
            >
              全部({{ labelNumConfig.total }})
            </el-button>
            <el-button
              class="label-type-button"
              :class="{'is-active': searchFrom.labelType === 'UN_LABEL'}"
              @click="changeLabelType('UN_LABEL')"
            >
              未标注({{ labelNumConfig.unLabeled }})
            </el-button>
            <el-button
              class="label-type-button"
              :class="{'is-active': searchFrom.labelType === 'LABELING'}"
              @click="changeLabelType('LABELING')"
            >
              标注中({{ labelNumConfig.labeling }})
            </el-button>
            <el-button
              class="label-type-button"
              :class="{'is-active': searchFrom.labelType === 'LABELED'}"
              @click="changeLabelType('LABELED')"
            >
              已标注({{ labelNumConfig.labeled }})
            </el-button>
          </div>
          <div class="search-container">
            <InputWithSearch class="inline-search" :placeholder="'请输入数据集名称'" @search="searchList" />
            <div class="inline-search">
              <span class="type-title-container">类型</span>
              <el-select v-model="searchFrom.type" placeholder="请选择" @change="changeSelectParams">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="inline-search">
              <span class="type-title-container">状态</span>
              <el-select v-model="searchFrom.state" placeholder="请选择" @change="changeSelectParams">
                <el-option
                  v-for="item in stateOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
          <div class="button-container create">
            <el-button
              class="blue-btn"
              @click="openDataSetDialog"
            >
              创建数据集
            </el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane name="common">
        <span slot="label" class="name-container">平台</span>
        <div class="button-container">
          <el-button
            class="label-type-button"
            :class="{'is-active': searchFrom.labelType === 'ALL'}"
            @click="changeLabelType('ALL')"
          >
            全部({{ labelNumConfig.total }})
          </el-button>
          <el-button
            class="label-type-button"
            :class="{'is-active': searchFrom.labelType === 'belongMe'}"
            @click="changeLabelType('belongMe')"
          >
            我发布的({{ labelNumConfig.mine }})
          </el-button>
          <el-button
            v-if="roleName !== '超级管理员'"
            class="label-type-button"
            :class="{'is-active': searchFrom.labelType === 'permission'}"
            @click="changeLabelType('permission')"
          >
            平台授权({{ labelNumConfig.permission }})
          </el-button>
        </div>
        <div class="search-container">
          <InputWithSearch class="inline-search" :placeholder="'请输入数据集名称'" @search="searchList" />
          <div class="inline-search">
            <span class="type-title-container">类型</span>
            <el-select v-model="searchFrom.type" placeholder="请选择" @change="changeSelectParams">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="dataSet-detail-container">
      <div v-if="activeTab === 'mine'" class="mine-detail-container">
        <DataCard
          v-for="item of dataSetList"
          :key="item.id"
          :card-data="item"
          :is-show-operation="item.status!=='WAIT_JUDGE'"
          @online="openOnlineDialog"
          @edit="openEditDialog"
          @delete="openDeleteDialog"
          @singleClick="toDetail"
        />
      </div>
      <div v-if="activeTab === 'common'" class="common-detail-container">
        <DataCard
          v-for="item of dataSetList"
          :key="item.id"
          :card-data="item"
          :is-show-operation="false"
          :is-show-state="false"
          :is-show-mine-con="item.mine === 1"
          :is-show-permission-con="item.judgePermission && item.judgePermission.permissionExpire === 2"
          @singleClick="toDetail"
        />
      </div>
      <empty-state v-show="!loading && dataSetList.length === 0" />
      <div v-show="total > 12" class="flex justify-center dataSet-pagination-container">
        <el-pagination
          background
          :page-size="pageSize"
          layout="total,prev, pager, next,sizes,jumper"
          :current-page="currentPage"
          :page-sizes="[12,24,36,48]"
          :total="total"
          @current-change="changeCurrentPage"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
    <DetailDialog
      v-if="isShowDetailDialog"
      ref="detailDialogEL"
      :state="detailDialogState"
      :detail-form.sync="dataSetDetail"
      @save="saveDataSet"
      @cancel="cancelSave"
    />
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
import InputWithSearch from '@/components/InputWithSearch';
import DetailDialog from '@/views/data-manager/dataSet/components/DetailDialog';
import MessageDialog from '@/views/data-manager/dataSet/components/MessageDialog';
import DataCard from '@/views/data-manager/dataSet/components/DataCard';
import emptyState from '@/components/EmptyState';
import { getDataSetStatistics, getDataSetMineList, applyDataSet, deleteDataSet, createDataSet,
  updateDataSet, getPlatStatistics, getDataSetPlatList } from '@/api/data-set';
import { mapGetters } from 'vuex';
export default {
  components: {
    InputWithSearch,
    DetailDialog,
    MessageDialog,
    DataCard,
    emptyState
  },
  data() {
    return {
      activeTab: 'mine', // 当前面板
      loading: false,
      labelNumConfig: {
        total: '29',
        unLabeled: '12',
        labeling: '7',
        labeled: '10',
        mine: '1'
      }, // 标注数据统计
      searchFrom: {
        labelType: 'ALL',
        searchWord: '',
        type: 'ALL',
        state: 'ALL'
      }, // 查询参数
      otherTabSearchFrom: {
        labelType: 'ALL',
        searchWord: '',
        type: 'ALL',
        state: 'ALL'
      }, // 面板切换时记录前一个tab筛选
      typeOptions: [
        { label: '全部', value: 'ALL' },
        { label: '图像', value: 'PICTURE' },
        { label: '音频', value: 'VOICE' },
        { label: '文本', value: 'TEXT' },
        { label: '表格', value: 'TABLE' },
        { label: '视频', value: 'VIDEO' }
      ], // 类型数据源
      stateOptions: [
        { label: '全部', value: 'ALL' },
        { label: '未发布', value: 'WAIT_RELEASE' },
        { label: '待审核', value: 'WAIT_JUDGE' },
        { label: '已发布', value: 'ON_LINE' },
        { label: '被驳回', value: 'REJECT' }
        // { label: '已下线', value: 'OFF_LINE' }
      ], // 状态数据源
      isShowDetailDialog: false, // 详情弹框显隐
      dataSetDetail: {
        id: '',
        name: '',
        type: '',
        description: '',
        labelStudioProjectId: ''
      }, //  详情弹数据
      detailDialogState: 'add', // 详情弹框状态
      dataSetList: [], // 数据集数据源
      total: 0, // 分页总数
      currentPage: 1, // 当前页
      pageSize: 12, // 每页条数
      otherTabPagination: {
        total: 0, // 分页总数
        currentPage: 1, // 当前页
        pageSize: 12 // 每页条数
      }, // 面板切换时记录前一个tab分页
      currentDataSet: {}, // 当前操作的数据集
      isShowMessageDialog: false, // 信息提示框显隐
      messageType: '', // 信息提示框类型
      messageTitle: '', // 信息提示框标题
      messageContent: '' // 信息提示框内容
    };
  },
  computed: {
    ...mapGetters(['userId', 'roleName'])
  },
  mounted() {
    this.getDataSetListList();
    this.getLabelNumConfig();
  },
  methods: {
    // 进入详情
    toDetail(cardData) {
      if (this.activeTab === 'mine') {
        if (cardData.status !== 'WAIT_JUDGE') {
          this.$router.push({ path: `/data-manager/data-set/mine-detail/self/${cardData.id}` });
        } else {
          sessionStorage.setItem('isShowLabelView', true);
          sessionStorage.setItem('isShowForkButton', false);
          this.$router.push({ path: `/data-manager/data-set/common-detail/self/${cardData.id}/mine` });
        }
      } else {
        let tagType = ''; // permission, common, mine
        if (cardData.mine === 1) {
          tagType = 'permission';
        } else {
          if (cardData.judgePermission && cardData.judgePermission.permissionExpire === 2) {
            tagType = 'permission';
          } else {
            tagType = 'common';
          }
        }
        if (this.roleName === '超级管理员') {
          sessionStorage.setItem('isShowLabelView', true);
          sessionStorage.setItem('isShowForkButton', true);
        } else {
          if (tagType === 'common') {
            sessionStorage.setItem('isShowLabelView', false);
            sessionStorage.setItem('isShowForkButton', false);
          } else {
            sessionStorage.setItem('isShowLabelView', true);
            sessionStorage.setItem('isShowForkButton', true);
          }
        }
        this.$router.push({ path: `/data-manager/data-set/common-detail/self/${cardData.id}/${tagType}` });
      }
    },
    // 切换面板
    changeActiveTab(tab) {
      this.activeTab = tab.name;
      // 记录之前分页
      const pagination = JSON.parse(JSON.stringify(this.otherTabPagination));
      this.otherTabPagination = { total: this.total, currentPage: this.currentPage, pageSize: this.pageSize };
      this.total = pagination.total;
      this.currentPage = pagination.currentPage;
      this.pageSize = pagination.pageSize;
      // 记录之前筛选
      const tabSearchFrom = JSON.parse(JSON.stringify(this.otherTabSearchFrom));
      this.otherTabSearchFrom = { labelType: this.searchFrom.labelType, searchWord: this.searchFrom.searchWord, type: this.searchFrom.type, state: this.searchFrom.state };
      this.searchFrom = tabSearchFrom;
      // 查询
      this.dataSetList = [];
      this.getDataSetListList();
      this.getLabelNumConfig();
    },
    // 改变下拉框选择
    changeSelectParams() {
      this.changeCurrentPage(1);
    },
    // 改变标注状态
    changeLabelType(type) {
      this.searchFrom.labelType = type;
      this.changeCurrentPage(1);
    },
    // 输入框搜索
    searchList(value) {
      this.searchFrom.searchWord = value;
      this.changeCurrentPage(1);
    },
    // 打开创建数据集弹框
    openDataSetDialog() {
      this.isShowDetailDialog = true;
      this.$nextTick(() => this.$refs.detailDialogEL.clearForm());
      this.dataSetDetail = {
        id: '',
        name: '',
        type: '',
        description: '',
        labelStudioProjectId: ''
      };
      this.detailDialogState = 'add';
    },
    // 打开编辑提示框
    openEditDialog(cardData) {
      const { id, name, type, description, labelStudioProjectId } = cardData;
      this.dataSetDetail = { id, name, type, description, labelStudioProjectId };
      this.isShowDetailDialog = true;
      this.detailDialogState = 'edit';
    },
    // 保存数据集
    saveDataSet() {
      if (this.detailDialogState === 'add') {
        // 创建
        this.dataSetDetail.token = 'Token d080a2576954dd32d250b2a94380d20292c67322';
        const { name, type, description, token } = this.dataSetDetail;
        createDataSet({ name, type, description, token }).then((res) => {
          if (res.code === '000000') {
            this.$message.success('创建成功');
            // this.changeCurrentPage(1)
            // this.getLabelNumConfig()
            this.$router.push({ path: `/data-manager/data-set/mine-detail/self/${res.data}` });
          }
        });
        this.isShowDetailDialog = false;
      } else {
        // 编辑
        this.dataSetDetail.token = 'Token d080a2576954dd32d250b2a94380d20292c67322';
        const { id, name, description, token, labelStudioProjectId } = this.dataSetDetail;
        updateDataSet({ id, name, description, token, labelStudioProjectId }).then((res) => {
          if (res.code === '000000') {
            this.$message.success('更新成功');
            this.getDataSetListList();
            this.getLabelNumConfig();
          }
        });
        this.isShowDetailDialog = false;
      }
    },
    // 取消保存
    cancelSave() {
      this.isShowDetailDialog = false;
    },
    // 打开发布提示框
    openOnlineDialog(cardData) {
      this.messageType = 'online';
      this.isShowMessageDialog = true;
      this.currentDataSet = cardData;
      this.messageTitle = '发布申请';
      this.messageContent = `要申请<span class="label-color">&nbsp;&nbsp;${cardData.id}-${cardData.name}&nbsp;&nbsp;</span>发布吗?`;
    },
    // 打开删除提示框
    openDeleteDialog(cardData) {
      this.messageType = 'delete';
      this.isShowMessageDialog = true;
      this.currentDataSet = cardData;
      this.messageTitle = '删除 ';
      this.messageContent = `确定要删除<span class="label-color">&nbsp;&nbsp;${cardData.id}-${cardData.name}&nbsp;&nbsp;</span>吗?`;
    },
    // 取消信息提示框
    cancelMessage() {
      this.isShowMessageDialog = false;
    },
    // 确定信息提示框
    saveMessage() {
      if (this.messageType === 'online') {
        applyDataSet(this.currentDataSet.id).then((res) => {
          if (res.code === '000000') {
            this.$message.success('申请发布成功');
            this.getDataSetListList();
            this.getLabelNumConfig();
          }
        });
      } else if (this.messageType === 'delete') {
        deleteDataSet(this.currentDataSet.id).then((res) => {
          if (res.code === '000000') {
            this.$message.success('删除成功');
            this.getDataSetListList();
            this.getLabelNumConfig();
          }
        });
      }
      this.isShowMessageDialog = false;
    },
    // 分页
    changeCurrentPage(value) {
      this.currentPage = value;
      this.getDataSetListList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getDataSetListList();
    },
    // 获取数据
    getDataSetListList() {
      this.loading = true;
      if (this.activeTab === 'mine') {
        const pageParams = {
          type: this.searchFrom.type === 'ALL' ? null : this.searchFrom.type,
          status: this.searchFrom.state === 'ALL' ? null : this.searchFrom.state,
          labeledStatus: this.searchFrom.labelType === 'ALL' ? null : this.searchFrom.labelType,
          name: this.searchFrom.searchWord,
          pageNum: this.currentPage,
          pageSize: this.pageSize
        };
        getDataSetMineList(pageParams).then(res => {
          this.loading = false;
          this.total = res.data.total;
          this.dataSetList = res.data.records;
          document.getElementById('layout-container').scrollTop = 0;
          if (
            this.total > 0 &&
            res.data.records.length === 0 &&
            this.currentPage > 1
          ) {
            this.currentPage--;
            this.getDataSetListList();
          }
        }).catch(err => {
          console.log(err);
          this.loading = false;
        });
      } else {
        const pageParams = {
          typeList: this.searchFrom.type === 'ALL' ? [] : this.searchFrom.type.split(','),
          tag: this.searchFrom.labelType === 'ALL' ? 0 : this.searchFrom.labelType === 'belongMe' ? 1 : 2,
          name: this.searchFrom.searchWord,
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          applyUserId: this.userId
        };
        getDataSetPlatList(pageParams).then(res => {
          this.loading = false;
          this.total = res.data.total;
          this.dataSetList = res.data.records;
          document.getElementById('layout-container').scrollTop = 0;
          if (
            this.total > 0 &&
            res.data.records.length === 0 &&
            this.currentPage > 1
          ) {
            this.currentPage--;
            this.getDataSetListList();
          }
        }).catch(err => {
          console.log(err);
          this.loading = false;
        });
      }
    },
    // 获取统计信息
    getLabelNumConfig() {
      if (this.activeTab === 'mine') {
        getDataSetStatistics().then((res) => {
          this.labelNumConfig = res.data;
        });
      } else {
        getPlatStatistics(this.userId).then((res) => {
          this.labelNumConfig = res.data;
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.dataSet-container {
  padding: 16px 24px;
  min-width: 1300px;
  .tabs-container {
    box-shadow: none;
    border: none;
    ::v-deep {
      .el-tabs__header {
        background-color:#edf2f9;
        border: none;
        .el-tabs__item {
          color: #323232;
          width: 105px;
          border: none;
          text-align: center;
          height: 38px;
          line-height: 38px;
          border-radius: 4px 4px 0 0;
          &.is-active {
            color: #0164FF;
            &::before {
              content: " ";
              width: 105px;
              height: 3px;
              background: #0164FF;
              display: inline-block;
              position: absolute;
              left: 0px;
              top: 1px;
            }
          }
          .name-container {
            display: inline-block;
          }
        }
      }
      .el-tabs__content {
        padding: 16px 16px 0;
      }
      .operation-container {
        // display: flex;
        // align-items: center;
        // justify-content: space-between;
        // flex-wrap: wrap;
      }
      .button-container,.search-container {
        margin-bottom: 16px;
        display: inline-block;
      }
      .button-container {
        margin-right: 8px;
        &.create {
          float: right;
        }
      }
      .type-title-container {
        font-size: 12px;
        color: #646464;
        margin-right: 8px;
      }
    }
  }
  .dataSet-detail-container {
    .mine-detail-container,.common-detail-container {
      grid-autoflow: columns;
      grid-gap: 16px;
      box-sizing: border-box;
      display: grid;
      grid-auto-rows: 1fr;
      grid-template-columns: repeat(4,1fr);
      @media screen and (max-width: 1200px) {
        grid-template-columns: repeat(3, 1fr)
      }
      @media (min-width: 1200px) and (max-width: 1366px) {
        grid-template-columns: repeat(3, 1fr)
      }
      @media (min-width: 1366px) and (min-width: 1460px) {
        grid-template-columns: repeat(4, 1fr)
      }
    }
    .dataSet-pagination-container {
      margin-top: 24px
    }
  }
  .label-type-button {
    padding: 8px 16px;
    background: #E9EEEF;
    border-radius: 4px;
    color: #8C8C8C;
    border: 1px solid #E9EEEF;
    font-weight: 400;
    &:hover {
      color: #8C8C8C;
      border: 1px solid #E9EEEF;
    }
    &.is-active {
      background: #E4EDF8;
      color: #0164FF;
      border: 1px solid #E4EDF8;
    }
    &+.label-type-button {
      margin-left: 8px;
    }
  }
  .inline-search {
    display: inline-block;
    &+.inline-search {
      margin-left: 24px;
    }

    ::v-deep {
      .el-select {
        width: 150px;
        .el-input__inner {
          height: 32px !important;
          line-height: 32px !important;
          .el-input__icon {
            line-height: 32px;
          }
        }
      }
    }
  }
  .content-container {
    ::v-deep {
      .label-color {
        color: #0164FF;
      }
    }
  }
}
</style>
