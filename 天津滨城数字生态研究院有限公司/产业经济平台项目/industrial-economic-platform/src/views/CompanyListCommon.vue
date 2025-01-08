<template>
  <div v-loading="loading" class="page-company-common" :class="{ 'is-policy': isPolicy, 'is-region': isRegion }">
    <div v-if="isRegion" class="d-flex ai-center jc-between list-total-info">
      <div :style="{ visibility: !loading ? 'visible' : 'hidden' }">
        <span>已为您找到</span>
        <span class="total-num">{{ tableListTotal.toLocaleString() }}</span>
        <span>条相关结果</span>
      </div>
      <template v-if="showPagination && !isRegion && pageTotal > 1">
        <span class="cur-page">{{ currentPage }}</span>
        / <span class="total-page">{{ pageTotal }}</span> 页
      </template>
      <el-input
        v-if="isRegion"
        class="ee-input"
        :placeholder="placeholder"
        v-model="keyword"
        clearable
        @keydown.enter.native="handleSearch"
        style="width: 264px">
        <el-button slot="append" @click="handleSearch">
          <svg-icon icon-class="search" />
        </el-button>
      </el-input>
    </div>
    <div class="list-content">
      <div ref="listInner" class="list-content__inner">
        <div class="list-item" v-for="item in tableData" :key="item.id">
          <div class="top d-flex ai-center">
            <div class="d-flex ai-center flex-1">
              <span class="name ell" @click="toCorporatePortrait(item.companyId)">{{ item.companyName || item.legalPersonName }}</span>
              <div class="ee-tag--dot is-dark" :class="'is-' + item.regStatus">
                {{ dicts.company_status.find((n) => n.itemCode == item.regStatus).itemName }}
              </div>
            </div>
            <div class="d-flex ai-center">
              <span v-if="isFollow && item.concernDate" class="follow-time">关注时间：{{ item.concernDate }}</span>
              <!-- <el-button v-if="isPolicy" class="ee-button" size="small" type="primary" plain icon="el-icon-sort" @click="handleMatchPolicy(item)">
                匹配情况
              </el-button> -->
              <el-button class="ee-button" size="small" :class="{ 'is-active': item.concerned }" type="primary" plain @click="handleAttention(item)">
                <div class="d-flex ai-center">
                  <img v-if="!item.concerned" src="@/assets/icons/hollow-heart.svg" />
                  <img v-else src="@/assets/icons/solid-heart.svg" />
                  <span>{{ item.concerned ? '取消关注' : '关注企业' }}</span>
                </div>
              </el-button>
              <el-button class="ee-button" size="small" type="primary" icon="el-icon-office-building" @click="toCorporatePortrait(item.companyId)">
                企业画像
              </el-button>
            </div>
          </div>
          <div class="bottom d-flex ai-center">
            <img v-if="item.imageUrl" :src="item.imageUrl" class="avatar" />
            <div v-else class="avatar-text flex-center ai-center">{{ (item.companyName || item.legalPersonName).charAt(0) }}</div>
            <div class="flex-1">
              <div v-if="item?.types?.length > 0 || item.board || item.sename" class="ee-company-type d-flex ai-center flex-wrap">
                <span
                  class="ee-company-type-tag"
                  v-for="childItem of item.types"
                  :key="childItem"
                  :style="{
                    color: keyCompanyMap.get(childItem)?.color,
                    background: keyCompanyMap.get(childItem)?.backgroundColor
                  }">
                  {{ keyCompanyMap.get(childItem)?.itemName || childItem }}</span
                >
                <span v-if="item.board || item.sename" class="ee-company-type-tag" style="color: #fff; background: #97a0b6">
                  {{ item.board || '' }}{{ item.sename || '' }}
                </span>
              </div>
              <div class="ee-company-intro d-flex ai-center flex-wrap">
                <div class="item">
                  法定代表人： <span>{{ item.legalPersonName }}</span>
                </div>
                <div class="item">
                  注册资本：<span>{{ item.regCapital }}万元</span>
                </div>
                <div class="item">
                  成立日期：<span>{{ item.setupDate }}</span>
                </div>
                <!-- <div class="item">
                      统一社会信用代码：<span>{{ item.creditNo }}</span>
                    </div> -->
                <div class="item">
                  注册地址：<span>{{ item.regionName }}</span>
                </div>
              </div>
              <div class="ee-company-layout d-flex ai-start">
                <span>产业布局：</span>
                <div v-if="item.industrialLayouts && item.industrialLayouts.length > 0" class="d-flex ai-center flex-wrap flex-1">
                  <span class="ee-company-layout-tag" v-for="childItem of item.industrialLayouts" :key="childItem">{{ childItem }}</span>
                </div>
                <div v-else-if="item.industrialLayout" class="d-flex ai-center flex-wrap flex-1">
                  <span class="ee-company-layout-tag">{{ item.industrialLayout }}</span>
                </div>
                <span v-else>-</span>
              </div>
            </div>
            <div v-if="item.totalScore" class="score text-center">
              <div class="score-value">{{ item.totalScore }}</div>
              <div>企业评分</div>
            </div>
          </div>
        </div>
      </div>
      <el-pagination
        class="ee-pagination"
        v-show="showPagination && tableListTotal > pageSize"
        layout="prev, pager, next, jumper"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :total="tableListTotal"
        background
        @current-change="changePage">
      </el-pagination>
      <div v-show="!loading && tableData.length == 0" class="ee-nodata">暂无数据</div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex';
import mixinOpenWindow from '@/utils/mixinOpenWindow';
import { industrialInvestmentApis } from '@/api/industrial-investment';
import { attentionEnterprisesApis } from '@/api/attention-enterprises';

const { company_type, key_company, company_status } = JSON.parse(localStorage.getItem('iep_platform_all_dict'));

export default {
  name: 'IndustrialInvestment',
  components: {},
  mixins: [mixinOpenWindow],
  props: {
    mode: {
      type: String,
      default: ''
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    params: {
      type: Object,
      default() {
        return {};
      }
    },
    placeholder: {
      type: String,
      default: '请输入关键词'
    },
    tableResult: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      dicts: {
        company_type,
        key_company,
        company_status
      },
      keyword: '',
      tableListTotal: 0,
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      tableData: [],
      loading: false,
      form: {
        regions: [],
        typeCodes: []
      },
      keyCompanyMap: new Map()
    };
  },
  computed: {
    ...mapGetters(['iep_platform_MENU_ID']),
    // 企业匹配
    isPolicy() {
      return this.mode === 'policy';
    },
    // 区分分布跳转弹窗
    isRegion() {
      return this.mode === 'region';
    },
    // 产业招商
    isIndustry() {
      return this.mode === 'industry';
    },
    // 关注企业
    isFollow() {
      return this.mode === 'follow';
    },
    ignoreRegionTree() {
      return !this.isPolicy;
    }
  },
  watch: {
    params(val) {
      this.setParams(this.form, val);
      this.handleSearch();
    },
    tableResult: {
      handler(val) {
        this.setTableResult(val);
      },
      deep: true
    }
  },
  created() {
    if (this.isPolicy) {
      this.dicts.company_type = company_type.concat(key_company);
    }
    this.handleColor(this.dicts);
    if (this.isIndustry || this.isFollow || this.isPolicy) {
      this.setTableResult(this.tableResult);
    } else {
      this.setParams();
      this.getTableData();
    }
    if (this.isPolicy || this.isIndustry) this.$eventBus.$on('attentionCompany', this.onAttentionCompany);
  },
  methods: {
    onAttentionCompany({ companyId, concerned }) {
      let one = this.tableData.find((n) => n.companyId === companyId);
      if (one) {
        this.$set(one, 'concerned', concerned);
      }
    },
    setTableResult(val) {
      if (val) {
        this.tableData = val;
      }
    },
    setParams() {
      Object.assign(this.form, this.params);
    },
    handleColor(data) {
      this.keyCompanyMap = new Map(data?.key_company.map((item) => [item.itemCode, item]));
    },
    // 获取表格数据
    getTableData() {
      const params = {
        keyword: this.keyword,
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        ...this.form
      };
      this.loading = true;
      industrialInvestmentApis
        .getIndustrialInvestmentList(params)
        .then((result) => {
          const { pages, list, total } = result.data.investmentRespList;
          this.pageTotal = pages;
          this.tableListTotal = total;
          this.tableData = list;
          if (this.isRegion) {
            this.$nextTick(() => {
              this.$refs.listInner.scrollTo({
                top: 0,
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
    changeRegion() {
      this.handleSearch();
    },
    handleMatchPolicy(item) {
      this.$emit('match-policy', item);
    },
    handleAttention(item) {
      const params = {
        companyId: item.companyId
      };
      attentionEnterprisesApis.attentionEnterprises(params).then((result) => {
        if (this.isFollow) {
          this.$emit('refresh');
          this.$eventBus.$emit('attentionCompany', { companyId: item.companyId, concerned: !item.concerned });
        } else {
          this.$message({
            message: result.msg,
            type: 'success'
          });
          this.$set(item, 'concerned', !item.concerned);
        }
      });
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
.page-company-common {
  padding: 29px 0;
  &.is-region {
    padding: 29px 0px;
    overflow: auto;
    .list-total-info {
      padding: 0 10px;
    }
    .list-content {
      margin-top: 10px;
      &__inner {
        overflow-y: auto;
        padding: 10px 10px 0;
        height: calc(80vh - 179px);
      }
    }
  }
  &.is-policy {
    padding: 5px 0 0;
    .total-num {
      color: #cc4f47;
      font-family: D-DIN-bold;
      font-size: 14px;
      font-style: normal;
    }
    .list-content {
      min-height: 400px;
    }
  }
  .el-form-item {
    margin-bottom: 12px !important;
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
          color: #356df6;
        }
        .cur-page {
          margin-left: 18px;
          color: #356df6;
        }
      }
      .btn-reset {
        margin-left: 20px;
        color: #356df6;
        font-size: 14px;
        cursor: pointer;
      }
    }
    &-item {
      margin-bottom: 16px;
      min-height: 195px;
      box-sizing: border-box;
      border-radius: 2px;
      background: #fff;
      box-shadow: 0px 0px 14px 0px rgba(19, 38, 82, 0.08);
      &:hover {
        background: rgba(53, 109, 246, 0.1);
      }
      .top {
        padding: 0 32px;
        position: relative;
        height: 64px;
        border-bottom: 1px solid #ebe9f1;
        .name {
          color: #1a262c;
          font-size: 18px;
          font-weight: 500;
          cursor: pointer;
        }
        .el-button {
          display: flex;
          margin-left: 14px;
          line-height: 14px;
          &:first-child {
            margin-left: 0;
          }
          img {
            margin-right: 5px;
            height: 14px;
          }
        }
        .follow-time {
          padding: 4px 12px;
          color: #9e9e9e;
          border-radius: 3px;
          font-family: D-DIN-Bold;
          font-size: 12px;
          background: #f2f2f2;
          margin-right: 32px;
        }
      }
      .ee-tag--dot {
        margin-left: 22px;
      }
      .bottom {
        padding: 20px 32px;
      }
      .avatar,
      .avatar-text {
        margin-right: 18px;
        margin-bottom: 6px;
        width: 88px;
        height: 88px;
        border-radius: 4px;
        border: 1px solid #e9e9e9;
        background: #fff;
      }
      .avatar {
        object-fit: contain;
      }
      .avatar-text {
        box-sizing: border-box;
        border: 1px solid #e9e9e9;
        background: #356df6;
        font-size: 36px;
        color: #fff;
      }
      .score {
        margin: 0 20px 0 18px;
        color: #565656;
        font-size: 12px;
        line-height: 17px;
        &-value {
          margin-bottom: 2px;
          color: #f8aa50;
          font-family: D-DIN-Bold;
          font-size: 28px;
          font-weight: 700;
          line-height: 30px;
        }
      }
      .el-icon-sort {
        transform: rotate(90deg);
      }
    }
  }
}
</style>
