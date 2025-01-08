<template>
  <div class="follow-company-page" :class="{ 'is-no-company': companyListData.length === 0 }">
    <div class="main-container">
      <el-container>
        <el-main>
          <div class="tab-box">
            <el-tabs v-model="activeTab" type="card" @tab-click="changeActiveTab">
              <el-tab-pane label="关注动态" name="message">
                <div class="operation-box">
                  最近动态:
                  <el-select v-model="selectedDate" placeholder="请选择">
                    <el-option v-for="item in dateOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                  </el-select>
                </div>
              </el-tab-pane>
              <el-tab-pane label="关注企业" name="company"></el-tab-pane>
            </el-tabs>
            <el-input class="search-input search-bottom ee-input" placeholder="搜索已关注企业" v-model="searchWord" clearable @clear="searchTable">
              <el-button slot="append" icon="el-icon-search" @click="searchTable"></el-button>
            </el-input>
          </div>
          <div class="table-box" v-show="activeTab === 'message'">
            <div class="title">
              企业列表
              <el-button class="plain">全部已读</el-button>
            </div>
            <div class="table">
              <el-table :data="messageTableData" stripe border>
                <el-table-column label="序号" type="index" :index="indexMethod" width="80" align="center" />
                <el-table-column show-overflow-tooltip label="企业名称" sortable prop="companyName" min-width="60" align="left">
                  <template slot-scope="scope">
                    {{ scope.row.companyName || scope.row.legalPersonName }}
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="动态类型" sortable prop="type" min-width="80" align="left" />
                <el-table-column show-overflow-tooltip label="最近动态" min-width="80" align="left" />
                <el-table-column show-overflow-tooltip label="动态更新日期" min-width="80" align="left" />
                <el-table-column show-overflow-tooltip label="状态" min-width="80" align="left" />
                <el-table-column show-overflow-tooltip label="操作" min-width="80" align="left" />
              </el-table>
              <el-pagination
                class="ee-pagination"
                v-show="messageTableListTotal > 0"
                layout="prev, pager, next, jumper"
                :current-page.sync="messageCurrentPage"
                :page-size="10"
                background
                :total="messageTableListTotal"
                @current-change="changeMessageTablePage">
              </el-pagination>
            </div>
          </div>
          <div class="card-box" v-show="activeTab === 'company'">
            <div class="list">
              <company-list-common mode="follow" :tableResult="companyListData" :showPagination="false" @refresh="searchTable" />
              <el-pagination
                class="ee-pagination"
                v-show="companyListTotal > 10"
                layout="prev, pager, next, jumper"
                :current-page.sync="companyCurrentPage"
                :page-size="10"
                background
                :total="companyListTotal"
                @current-change="changeCompanyListPage">
              </el-pagination>
            </div>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { attentionEnterprisesApis } from '@/api/attention-enterprises';
import CompanyListCommon from '@/views//CompanyListCommon.vue';
import mixinOpenWindow from '@/utils/mixinOpenWindow';

export default {
  name: 'FollowCompany',
  mixins: [mixinOpenWindow],
  components: {
    CompanyListCommon
  },
  data() {
    return {
      activeTab: 'message',
      dateOptions: [
        {
          label: '今天',
          value: 1
        },
        {
          label: '近七天',
          value: 6
        },
        {
          label: '近三十天',
          value: 30
        }
      ],
      selectedDate: 1,
      searchWord: '',
      messageTableData: [],
      messageTableListTotal: 0,
      messageCurrentPage: 1,
      companyListData: [],
      companyListTotal: 0,
      companyCurrentPage: 1
    };
  },
  computed: {
    ...mapGetters([])
  },
  mounted() {},
  methods: {
    changeActiveTab() {
      if (this.activeTab === 'message') {
        this.getMessageTable();
      } else {
        this.getCompanyList();
      }
    },
    searchTable() {
      if (this.activeTab === 'message') {
        this.changeMessageTablePage(1);
      } else {
        this.changeCompanyListPage(1);
      }
    },
    // 序号排序
    indexMethod(index) {
      return (this.currentPage - 1) * 10 + index + 1;
    },
    changeMessageTablePage(val) {
      this.messageCurrentPage = val;
      this.getMessageTable();
    },
    getMessageTable() {
      // const params = {
      //   keyword: this.searchWord,
      //   selectedDate: this.selectedDate,
      //   pageSize: 10,
      //   pageNum: this.messageCurrentPage
      // };
      // analysisApis.getInvestList(params).then((result) => {
      //   this.messageTableData = result.data.list;
      //   this.messageTableListTotal = result.data.total;
      // }).catch((err) => {
      //   console.log(err);
      // });
    },
    changeCompanyListPage(val) {
      this.companyCurrentPage = val;
      this.getCompanyList();
    },
    getCompanyList() {
      const params = {
        keywords: this.searchWord,
        pageSize: 10,
        pageNum: this.companyCurrentPage
      };
      attentionEnterprisesApis
        .getAttentionEnterprisesList(params)
        .then((result) => {
          this.companyListData = result.data.list || [];
          this.companyListTotal = result.data.total;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleAttention(item) {
      const params = {
        companyId: item.companyId
      };
      attentionEnterprisesApis
        .attentionEnterprises(params)
        .then((result) => {
          this.$message({
            message: result.msg,
            type: 'success'
          });
          this.getCompanyList();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="less">
@import '~@/styles/variables.less';
.follow-company-page {
  min-height: 100%;
  &.is-no-company {
    .page-company-common {
      display: flex;
      align-items: center;
      justify-content: center;
      height: calc(100vh - 218px);
    }
  }
  .page-company-common {
    padding: 0;
  }
  .el-tabs__header {
    border-bottom: none;
  }
  .el-tabs__nav-wrap {
    margin-bottom: 0;
    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: #e4e7ed;
    }
  }
  .el-tabs__item {
    border-bottom: none;
    &.is-active {
      &::before {
        content: '';
        position: absolute;
        bottom: 0px;
        left: 0;
        right: 0;
        height: 1px;
        background: #fff;
      }
    }
  }
  .main-container {
    .el-main {
      padding: 0;
      .tab-box {
        padding: 30px 30px 0 30px;
        background: #fff;
        box-shadow: 0px 0px 16px rgba(20, 38, 82, 0.07);
        font-size: 14px;
        position: relative;
        .el-tabs__header {
          margin: 0px;
        }
        .operation-box {
          margin: 30px 0;
        }
        .search-input {
          width: 300px;
          position: absolute;
          top: 24px;
          right: 32px;
        }
      }
      .table-box {
        margin: 30px;
        padding: 30px;
        background: #fff;
        .title {
          font-size: 22px;
          color: #1d2129;
          margin-bottom: 30px;
          .el-button {
            float: right;
          }
        }
      }
      .card-box {
        margin: 30px;
      }
    }
  }
}
</style>
