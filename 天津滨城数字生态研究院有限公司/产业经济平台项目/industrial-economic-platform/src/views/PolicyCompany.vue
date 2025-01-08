<template>
  <div class="page-policy-company">
    <div class="ee-view-content wrap-inner">
      <div class="wrap-top">
        <div class="ee-view-title d-flex ai-center">
          <el-button class="ee-button--back" type="text" icon="el-icon-arrow-left" @click="$router.push('/policy-documents')">返回</el-button>
          <span class="ee-split"></span>
          <span class="title">匹配企业</span>
        </div>
        <div class="top-inner">
          <div class="doc-name d-flex ai-center">
            <div class="name ell">{{ detail.title }}</div>
            <div class="ee-tag--dot is-dark" :class="detail.status == 1 ? 'is-success ' : 'is-danger'">
              {{ detail.status == 1 ? '进行中' : '已截止' }}
            </div>
          </div>
          <div class="doc-info row1 d-flex ai-center jc-between">
            <div class="d-flex ai-center">
              <span class="label">发布机构：</span>
              <span class="value flex-1 ell">{{ detail.publish_department || '-' }}</span>
            </div>
            <div class="d-flex ai-center">
              <span class="label">剩余天数：</span>
              <span
                v-if="detail.remain_days > 0"
                class="value f-d-din"
                :class="'ee-color-' + (detail.remain_days >= 20 ? 'success' : detail.remain_days >= 10 ? 'warning' : 'danger')">
                {{ detail.remain_days }}天
              </span>
              <span v-else class="value">-</span>
            </div>
            <div class="d-flex ai-center">
              <span class="label">申报时间：</span>
              <span v-if="detail.begin_date || detail.end_date" class="value">{{ detail.begin_date || '-' }} 至 {{ detail.end_date || '-' }}</span>
              <span v-else class="value">-</span>
            </div>
          </div>
          <div class="doc-info d-flex ai-center">
            <span class="label">地 区：</span>
            <span class="value flex-1 ell">{{ detail.area_name || '-' }}</span>
          </div>
          <div class="doc-info d-flex">
            <span class="label">申报条件：</span>
            <div class="d-flex ai-end flex-1">
              <div class="value flex-1" :class="{ ell2: !expandContent }" style="margin-right: 0" v-html="detail.content_html"></div>
              <i v-if="detail.content" class="el-icon-arrow-down" :class="{ 'is-expand': expandContent }" @click="expandContent = !expandContent"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="wrap-body">
        <el-form v-loading="loading" element-loading-custom-class="ee-loading--none" class="ee-form" :model="form">
          <div class="d-flex">
            <el-form-item style="width: 38%">
              <el-input class="ee-input" v-model="form.keyword" placeholder="请输入关键词" clearable @keydown.enter.native="handleSearch">
                <el-button slot="append" @click="handleSearch">
                  <svg-icon icon-class="search" />
                </el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="地区：" label-width="70px" style="width: 31%">
              <el-cascader
                v-model="form.area_code"
                :options="regionList"
                :props="props"
                placeholder="选择地区"
                filterable
                clearable
                @change="handleSearch"
                style="width: 100%"></el-cascader>
            </el-form-item>
            <el-form-item label="企业类型：" label-width="90px" style="width: 31%">
              <el-select v-model="form.type" placeholder="选择企业类型" clearable @change="handleSearch" style="width: 100%">
                <el-option v-for="n in company_type" :label="n.itemName" :value="n.itemCode" :key="n.itemCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
        <div v-loading="loading" element-loading-custom-class="ee-loading">
          <div class="d-flex ai-center list-total-info">
            <span>政策匹配结果</span>
            <span class="total-num"> {{ tableListTotal.toLocaleString() }}</span>
          </div>
          <company-list-common
            mode="policy"
            :tableResult="tableData"
            :showPagination="false"
            @match-policy="handleMatchPolicy"
            @detail="storeScrollMemory" />
          <el-pagination
            class="ee-pagination"
            v-show="tableListTotal > pageSize"
            layout="prev, pager, next, jumper"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            :total="tableListTotal"
            background
            @current-change="changePage">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog title="匹配情况" :visible.sync="dialogVisible" top="10vh" width="76.4%">
      <div class="company-policy-wrap"></div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex';
import mixinRegion from '@/utils/mixinRegion';
import mixinScrollMemory from '@/utils/mixinScrollMemory';
import { findNodeByDFS } from '@/utils';
import * as api from '@/api/policy';
import { industrialInvestmentApis } from '@/api/industrial-investment';
import CompanyListCommon from './CompanyListCommon.vue';

const { company_type, key_company } = JSON.parse(localStorage.getItem('iep_platform_all_dict'));

export default {
  name: 'PolicyCompany',
  components: {
    CompanyListCommon
  },
  mixins: [mixinRegion, mixinScrollMemory],
  data() {
    return {
      form: {
        keyword: '',
        area_code: '',
        type: ''
      },
      detail: {},
      expandContent: false,
      dialogVisible: false,
      companyParams: {},
      tableListTotal: 0,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      loading: false,
      company_type: company_type.concat(key_company),
      regionList: [],
      props: { checkStrictly: true, emitPath: false, value: 'regionCode', label: 'regionName', disabled: 'disabled', children: 'children' }
    };
  },

  computed: {
    ...mapGetters(['iep_platform_MENU_ID', 'iep_orgRegion'])
  },

  watch: {},

  created() {
    this.policyId = this.$route.params.id * 1;
    this.init();
  },

  mounted() {},

  activated() {
    if (this.policyId != this.$route.params.id) {
      this.policyId = this.$route.params.id * 1;
      this.expandContent = false;
      this.init();
    }
  },

  methods: {
    init() {
      Object.keys(this.form).forEach((n) => {
        this.form[n] = '';
      });
      this.detail = {};
      this.tableData = [];
      this.tableListTotal = 0;
      this.getDetail();
      this.handleSearch();
    },
    afterRegionLoad() {
      this.findRegionList();
    },
    findRegionList() {
      if (this.regionTree.length > 0 && this.detail.area_name) {
        const node = findNodeByDFS(this.regionTree[0], (node) => node.regionName === this.detail.area_name);
        if (node) {
          this.regionList = [node];
        } else {
          this.regionList = [];
        }
      }
    },
    getTableData() {
      this.loading = true;
      api
        .getPolicyCompanyList({
          policy_id: this.policyId,
          page_num: this.currentPage,
          page_size: this.pageSize,
          ...this.form
        })
        .then(({ data }) => {
          if (data.code === 0) {
            this.comIds = data.data.company_id_list || [];
            this.tableListTotal = data.data.total_num;
            if (this.comIds.length > 0) {
              this.getCompanyList();
            } else {
              this.tableData = [];
              if (this.currentPage === 1) this.tableListTotal = 0;
              this.loading = false;
            }
          } else {
            this.loading = false;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getCompanyList() {
      industrialInvestmentApis
        .getIndustrialInvestmentList({
          comIds: this.comIds,
          pageSize: this.pageSize,
          pageNum: 1
        })
        .then((result) => {
          const { list } = result.data.investmentRespList;
          this.tableData = list;
          if (this.currentPage > 1) {
            this.$nextTick(() => {
              document.querySelector('.app-main').scrollTo({
                top: 300,
                behavior: 'smooth'
              });
            });
          }
          this.loading = false;
        })
        .catch((e) => {
          this.loading = false;
          console.log(e);
        });
    },
    getDetail() {
      api
        .getAwardPolicyDetail({ policy_id: this.$route.params.id })
        .then(({ data }) => {
          if (data.code === 0) {
            this.detail = data.data;
            this.findRegionList();
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    handleMatchPolicy() {
      this.dialogVisible = true;
    },
    handleSearch() {
      this.currentPage = 1;
      this.getTableData();
    },
    changePage(val) {
      this.currentPage = val;
      this.getTableData();
    }
  }
};
</script>
<style lang='less'>
.page-policy-company {
  .wrap-top {
    padding-left: 24px;
    background: #fff;
    box-shadow: 0px 0px 16px 0px rgba(20, 38, 82, 0.07);
    .top-inner {
      padding: 0 24px 24px 0;
    }
    .doc-info {
      margin-top: 12px;
      font-size: 14px;
      line-height: 22px;
      &.row1 {
        width: 60%;
        min-width: 1000px;
      }
      .label {
        color: #86909c;
      }
      .value {
        margin-right: 30px;
        color: #1a262c;
        &:last-child {
          margin-right: 0;
        }
      }
      .el-icon-arrow-down {
        margin-left: 5px;
        padding: 2px;
        color: rgba(0, 0, 0, 0.25);
        cursor: pointer;
        transition: transform 0.3s;
        &.is-expand {
          transform: rotate(180deg);
        }
      }
    }
    .doc-name {
      margin-top: 24px;
      .name {
        max-width: calc(100% - 200px);
        font-size: 20px;
        font-weight: 500;
        line-height: 24px;
      }
      .ee-tag--dot {
        margin-left: 22px;
      }
    }
  }
  .wrap-body {
    padding: 29px 0;
  }
  .el-form-item {
    margin-bottom: 12px !important;
  }
  .list {
    &-total {
      &-info {
        margin-bottom: 8px;
        color: #86909c;
        font-size: 12px;
        line-height: 28px;
        white-space: pre;
        .total-num,
        .cur-page,
        .total-page {
          font-size: 14px;
          font-family: D-DIN-Bold;
        }
        .total-num {
          margin: 0 5px;
          color: #cc4f47;
        }
      }
    }
  }
}
.company-policy-wrap {
  height: calc(80vh - 50px);
}
</style>
