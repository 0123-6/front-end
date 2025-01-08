<template>
  <div class="page-company-list">
    <div class="search-row">
      <el-breadcrumb class="ee-breadcrumb fixed-top-left" separator="/">
        <el-breadcrumb-item class="is-active">产业招商</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="search-row-inner ee-view-content flex-center ai-center">
        <div class="search-input">
          <el-input
            class="ee-input is-large"
            placeholder="请输入公司名称、法人姓名等"
            v-model="keyword"
            clearable
            @keydown.enter.native="handleSearch">
            <el-button slot="append" :disabled="loading" @click="handleSearch">搜 索</el-button>
          </el-input>
          <!-- <el-popover
            ref="popover"
            popper-class="history-search-popper"
            v-model="showPopper"
            placement="bottom"
            title="历史搜索"
            width="620"
            trigger="manual">
            <div class="history-clear d-flex ai-center" @click="clearRecentSearch"><i class="el-icon-delete"></i>清空</div>
            <div class="history-list d-flex ai-center flex-wrap">
              <div v-for="item of recentSearchList" :key="item.value" class="history-item d-flex ai-center" @click="keyword = item.value">
                {{ item.value }}<i class="el-icon-close" @click.stop="removeRecentSearch(item.value)"></i>
              </div>
            </div>
          </el-popover> -->
        </div>
        <div class="ee-finder flex-center ai-center" :class="{ 'is-active': searchType == 1 }" @click="handleChain">产业链找企业</div>
        <div class="ee-finder flex-center ai-center" :class="{ 'is-active': searchType == 2 }" @click="handleCondition">多条件查企业</div>
      </div>
    </div>
    <div v-loading="loading" element-loading-custom-class="ee-loading" class="list-wrap">
      <div class="ee-view-content">
        <company-list-chain
          ref="CompanyListChain"
          v-show="searchType === 1"
          :loading="loading"
          @close="searchType = ''"
          @change="handleConfirmChain" />
        <company-list-condition
          ref="CompanyListCondition"
          v-show="searchType === 2"
          :loading="loading"
          @close="searchType = ''"
          @change="handleConfirmCondition" />
        <div v-show="!isSearch" class="list-title">推荐企业</div>
        <div v-show="isSearch" class="list-total d-flex ai-start flex-wrap">
          <div v-show="hasCondition" class="d-flex ai-start c-tag-list condition-list">
            <span>筛选条件：</span>
            <company-list-condition-tag :form="form" :dicts="dicts" @remove="handleRemove">
              <div v-if="chainName" class="d-flex ai-center c-tag-item">
                产业链：
                <span class="value">{{ chainName }}</span>
                <i class="el-icon-close" @click="clearChain(true)"></i>
              </div>
              <div v-if="selectedNodes.length > 0" class="d-flex ai-center c-tag-item">
                节点：
                <span class="value">{{ selectedNodes.map((n) => n.name).join('、') }}</span>
                <i class="el-icon-close" @click="clearChainNodes"></i>
              </div>
            </company-list-condition-tag>
            <div class="d-flex ai-center btn-reset" @click="handleReset(true)"><i class="el-icon-refresh-left"></i>重置</div>
          </div>
          <div v-show="tableListTotal > 0 && !loading" class="d-flex ai-center list-total-info">
            已为您找到
            <span class="total-num">{{ tableListTotal.toLocaleString() }}</span>
            条相关结果
            <template v-if="pageTotal > 1">
              <span class="cur-page">{{ currentPage }}</span
              >/ <span class="total-page">{{ pageTotal }}</span> 页
            </template>
          </div>
          <div v-show="loading" class="d-flex ai-center list-total-info">正在搜索</div>
        </div>
        <company-list-common mode="industry" :tableResult="tableData" :showPagination="false" @detail="storeScrollMemory" />
        <el-pagination
          class="ee-pagination"
          v-show="isSearch && pageTotal > 1"
          layout="prev, pager, next, jumper"
          :current-page.sync="currentPage"
          :page-size="10"
          :total="tableListTotal"
          background
          @current-change="changePage" />
      </div>
    </div>
    <el-backtop target=".app-main" :visibility-height="100"></el-backtop>
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex';
import mixinScrollMemory from '@/utils/mixinScrollMemory';
import { industrialInvestmentApis } from '@/api/industrial-investment';
import CompanyListChain from './CompanyListChain.vue';
import CompanyListCondition from './CompanyListCondition.vue';
import CompanyListConditionTag from './CompanyListConditionTag.vue';
import CompanyListCommon from './CompanyListCommon.vue';

export default {
  name: 'IndustrialInvestment',
  components: {
    CompanyListChain,
    CompanyListCondition,
    CompanyListConditionTag,
    CompanyListCommon
  },
  mixins: [mixinScrollMemory],
  data() {
    return {
      showPopper: false,
      popVisible: false,
      showGoTop: false,
      dicts: JSON.parse(localStorage.getItem('iep_platform_all_dict')),
      hasCondition: false,
      isSearch: false,
      searchType: '',
      keyword: '',
      isFocus: false,
      recentSearchList: [],
      tableListTotal: 0,
      currentPage: 1,
      pageSize: 20,
      pageTotal: 0,
      tableData: [],
      loading: false,
      selectRegion: [],
      selectedList: [],
      form: {
        regions: [],
        contactWay: [],
        intelProperty: [],
        negativeOpinion: [],
        taxGrade: [],
        capitalTypes: [],
        regCapitals: [],
        setupDates: [],
        typeCodes: [],
        so110Count: [],
        financingTypes: []
      },
      companyStatusMap: new Map(),
      keyCompanyMap: new Map(),

      chainId: '',
      chainName: '',
      chainCode: '',
      selectedNodes: []
    };
  },

  computed: {
    ...mapGetters(['iep_platform_MENU_ID', 'iep_orgRegion'])
  },

  watch: {
    popVisible() {
      this.handleShowPopper();
    },
    recentSearchList: {
      handler() {
        this.handleShowPopper();
      },
      deep: true
    },
    keyword() {
      this.handleShowPopper();
    }
  },

  created() {
    this.dicts.company_type = this.dicts.company_type.concat(this.dicts.key_company);
    this.handleColor(this.dicts);
    this.readParams();
    this.getTableData();
    this.getRecentSearchList();
  },

  methods: {
    readParams() {
      const { params = {} } = this.$route;
      if (Object.keys(params).length > 0) {
        this.handleReset(false);
      }
      if (params.chainTypeObj) {
        const { id, chainCode, name } = params.chainTypeObj;
        this.chainId = id;
        this.chainCode = chainCode;
        this.chainName = name;
      }
      Object.assign(this.form, params);
      delete this.form.chainTypeObj;
    },
    handleShowPopper() {
      this.showPopper = this.popVisible && this.recentSearchList.length > 0 && !this.keyword;
    },
    handleRemove(key) {
      this.form[key] = [];
      this.handleSearch();
      this.$refs.CompanyListCondition.handleRemove(key);
    },
    handleColor(data) {
      this.companyStatusMap = new Map(data?.company_status.map((item) => [item.itemCode, item]));
      this.keyCompanyMap = new Map(data?.key_company.map((item) => [item.itemCode, item]));
    },
    handleReset(refresh = true) {
      Object.keys(this.form).forEach((n) => {
        this.form[n] = [];
        if (this.$refs.CompanyListCondition) this.$refs.CompanyListCondition.handleRemove(n);
      });
      this.clearChain(refresh);
    },
    handleSearch() {
      this.currentPage = 1;
      this.getTableData();
    },
    clearChainNodes() {
      this.selectedNodes = [];
      if (this.$refs.CompanyListChain) this.$refs.CompanyListChain.clearNodes();
      this.handleSearch();
    },
    clearChain(refresh = true) {
      this.chainId = '';
      this.chainName = '';
      this.chainCode = '';
      this.selectedNodes = [];
      this.$refs.CompanyListChain.handleClear();
      if (refresh) {
        this.handleSearch();
      }
    },
    handleConfirmChain({ type, typeName, chainCode = '', selectedNodes }) {
      this.chainId = type;
      this.chainName = typeName;
      this.chainCode = chainCode;
      this.selectedNodes = selectedNodes;
      this.handleSearch();
    },
    handleConfirmCondition(data) {
      this.form = data;
      this.handleSearch();
    },
    changePage(val) {
      this.currentPage = val;
      this.getTableData();
    },
    getTableData() {
      const { iep_orgRegion } = this;
      const hasField = !!Object.keys(this.form).find((n) => this.form[n].length > 0);
      this.hasCondition = !!this.chainId || this.selectedNodes.length > 0 || hasField;
      this.isSearch = !!this.keyword || this.hasCondition;
      const pageSize = this.isSearch ? 10 : 20;
      const chainCodes =
        this.selectedNodes.length > 0 ? this.selectedNodes.map((n) => n.code) : [this.chainCode || this.mainChainCode].filter((n) => !!n);
      const params = {
        keyword: this.keyword,
        pageSize,
        pageNum: this.currentPage,
        chainCodes,
        ...this.form
      };
      if (!this.isSearch) {
        params.regions = [
          {
            regionCode: iep_orgRegion.regionCode,
            regionLevel: iep_orgRegion.regionLevel
          }
        ];
      }
      this.loading = true;
      industrialInvestmentApis
        .getIndustrialInvestmentList(params)
        .then((result) => {
          if (this.loading) {
            this.pageSize = pageSize;
            const { pages, list, total } = result.data.investmentRespList;
            this.pageTotal = pages;
            this.tableListTotal = total;
            this.tableData = list;
            this.loading = false;

            sessionStorage.setItem('investmentScrollTop', '');

            this.$nextTick(() => {
              this.judgeScrollTop();
              if (this.currentPage > 1) {
                document.querySelector('.app-main').scrollTo({
                  top: 192,
                  behavior: 'smooth'
                });
              }
            });

            if (this.keyword && !this.recentSearchList.find((n) => n.value === this.keyword)) {
              this.getRecentSearchList();
            }
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleChain() {
      this.searchType = 1;
    },
    handleCondition() {
      this.searchType = 2;
    },
    getRecentSearchList() {
      // const params = {
      //   type: 'INVEST',
      //   limit: 10
      // };
      // industrialInvestmentApis.getRecentSearchListData(params).then((result) => {
      //   this.recentSearchList = result.data;
      // });
    },
    clearRecentSearch() {
      industrialInvestmentApis.clearRecentSearch({ type: 'INVEST' }).then((result) => {
        this.getRecentSearchList();
      });
    },
    removeRecentSearch(value) {
      const params = {
        type: 'INVEST',
        keyword: value
      };
      industrialInvestmentApis.clearItemRecentSearch(params).then((result) => {
        this.getRecentSearchList();
      });
    },
    judgeScrollTop() {
      const dom = document.querySelector('.app-main');
      this.showGoTop = dom.scrollHeight > dom.clientHeight && dom.scrollTop > 0;
    }
  }
};
</script>
<style lang='less'>
.history-search-popper {
  padding: 14px 14px 20px;
  box-sizing: border-box;
  .el-popover__title {
    color: #1a262c;
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
  }
  .history {
    &-list {
      margin-top: 4px;
    }
    &-clear {
      position: absolute;
      top: 18px;
      right: 14px;
      color: #86909c;
      cursor: pointer;
      i {
        margin-right: 5px;
      }
    }
    &-item {
      margin: 10px 16px 0 0;
      padding: 0 6px 0 10px;
      height: 28px;
      border-radius: 2px;
      border: 1px solid #e5e6eb;
      background: #fff;
      color: #4b5666;
      font-size: 14px;
      line-height: 28px;
      cursor: pointer;
      i {
        margin-left: 3px;
        padding: 5px;
        cursor: pointer;
      }
      &:hover {
        i {
          color: #356df6;
        }
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
.page-company-list {
  padding-bottom: 40px;
  .search-row {
    position: relative;
    background: url('@/assets/images/company-search-bg.png') center no-repeat;
    background-size: 100% 100%;
    &-inner {
      position: relative;
      height: 184px;
    }
    .search-input {
      position: relative;
      width: 728px;
    }
  }
  .page-company-common {
    padding-top: 0;
    padding-bottom: 0;
  }
  .list {
    &-title {
      padding: 24px 0;
      color: #1d2129;
      font-size: 22px;
      font-weight: 600;
      line-height: 24px;
    }
    &-total {
      padding: 24px 0 16px;
      color: #595959;
      font-size: 12px;
      &-info {
        margin-bottom: 8px;
        line-height: 22px;
      }
      .total-num,
      .cur-page,
      .total-page {
        font-size: 14px;
        font-family: D-DIN-Bold;
      }
      .total-num {
        margin: 0 5px;
        color: #356df6;
      }
      .cur-page {
        margin-left: 18px;
        color: #356df6;
      }
      .btn-reset {
        margin-left: 20px;
        color: #356df6;
        font-size: 14px;
        cursor: pointer;
      }
    }
  }
  .condition-list {
    margin-right: 52px;
    padding: 0;
    border-top: none;
  }
  .to-top {
    position: fixed;
    right: 6.2%;
    bottom: 100px;
    width: 74px;
    height: 74px;
    border-radius: 100%;
    background: #fff;
    box-shadow: 0px 0px 14px rgba(19, 38, 82, 0.08);
    color: #86909c;
    font-size: 14px;
    line-height: 22px;
    z-index: 1;
    cursor: pointer;
    &:hover {
      color: #333;
    }
  }
  @media screen and (max-width: 1500px) {
    .to-top {
      right: 30px;
    }
  }
}
</style>
