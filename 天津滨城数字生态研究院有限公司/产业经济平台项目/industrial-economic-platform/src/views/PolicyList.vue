<template>
  <div class="page-policy-list">
    <policy-query-head ref="PolicyQueryHead" :loading="loading" :params="defaultParams" @search="changeCondition" />
    <div v-loading="loading" element-loading-custom-class="ee-loading" class="ee-list-wrap">
      <div class="ee-view-content">
        <div class="ee-list-total d-flex ai-start flex-wrap">
          <div v-show="hasCondition" class="d-flex ai-start c-tag-list condition-list">
            <span>筛选结果：</span>
            <policy-list-condition-tag :form="form" @remove="handleRemove" />
            <div class="d-flex ai-center btn-reset" @click="handleReset(true)"><i class="el-icon-refresh-left"></i>重置</div>
          </div>
          <div v-show="totalResult > 0" class="d-flex ai-center ee-list-total-info">
            已为您找到<span class="total-num">{{ totalResult.toLocaleString() }}</span
            >条相关结果
            <!-- <template v-if="pageTotal > 1">
              <span class="cur-page">{{ currentPage }}</span
              >/ <span class="total-page">{{ pageTotal }}</span> 页
            </template> -->
          </div>
        </div>
        <div v-if="tableData.total_num > 0" class="ee-taber">
          <div
            class="ee-taber__button"
            v-for="(n, i) in policyCategories"
            :key="i"
            :class="{ 'is-active': category === n.text }"
            @click="changeType(n)">
            <span>{{ n.text }}</span>
            <span>（</span>
            <span class="f-d-din">{{ tableData[n.value + '_num'] }}</span>
            <span>）</span>
          </div>
        </div>
        <policy-list-common :tableData="tableData.list" @detail="storeScrollMemory" />
        <el-pagination
          class="ee-pagination"
          v-show="pageTotal > 1"
          layout="prev, pager, next, jumper"
          :current-page.sync="currentPage"
          :page-size="10"
          :total="tableListTotal"
          background
          @current-change="changePage" />
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex';
import mixinScrollMemory from '@/utils/mixinScrollMemory';
import { policyCategories } from '@/utils/constant';
import * as api from '@/api/policy';
import PolicyQueryHead from './PolicyQueryHead.vue';
import PolicyListConditionTag from './PolicyListConditionTag.vue';
import PolicyListCommon from './PolicyListCommon.vue';

export default {
  name: 'PolicyList',
  components: {
    PolicyQueryHead,
    PolicyListConditionTag,
    PolicyListCommon
  },
  mixins: [mixinScrollMemory],
  data() {
    return {
      policyCategories: [{ text: '全部', value: 'total' }].concat(policyCategories),
      category: '全部',
      counts: [0, 0, 0, 0, 0],
      hasCondition: false,
      isSearch: false,
      searchType: '',
      isFocus: false,
      tableListTotal: 0,
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      tableData: {
        list: [],
        total_num: 0,
        government_num: 0,
        department_num: 0,
        regulation_num: 0,
        park_num: 0
      },
      loading: false,
      selectRegion: [],
      selectedList: [],
      form: {
        keyword: '',
        regionCode: '',
        regionCodeName: '',
        orgId: '',
        orgIdName: '',
        industryType: '',
        industryTypeName: ''
      },
      defaultParams: {},
      totalResult: 0
    };
  },

  computed: {
    ...mapGetters(['iep_orgRegion'])
  },

  created() {
    this.readParams();
    this.getTableData();
  },

  mounted() {},

  activated() {
    this.readParams();
    if (this.$route.params.force && this.isActivated) {
      this.getTableData();
    }
    this.isActivated = true;
  },

  methods: {
    readParams() {
      const params = JSON.parse(JSON.stringify(this.$route.params));
      // delete params.force;
      this.defaultParams = {
        keyword: params.keyword
      };
      this.form = Object.assign(this.form, params);
      console.log('PolicyList form', this.form);
      if (Object.keys(params).length > 0) {
        this.resetCategory();
      }
    },
    resetCategory() {
      this.category = '全部';
    },
    getTableData() {
      const { regionCode = '', keyword = '', orgId = '', industryType = '' } = this.form;
      this.hasCondition = !!(regionCode || orgId || industryType);
      const params = {
        page_size: this.pageSize,
        page_num: this.currentPage,
        keyword,
        source: orgId,
        tag: industryType ? industryType.split('__')[0] : '',
        category: this.category === '全部' ? '' : this.category
      };
      if (regionCode && regionCode != 'china') {
        params.area_code = regionCode;
      }
      this.loading = true;
      api
        .getPolicyList(params)
        .then(({ data }) => {
          if (data.code === 0) {
            if (this.category !== '全部') {
              const dataObj = {
                list: data.data.list
              };
              switch (this.category) {
                case '党政发文':
                  dataObj.government_num = data.data.total_num;
                  break;
                case '部门发文':
                  dataObj.department_num = data.data.total_num;
                  break;
                case '规章条例':
                  dataObj.regulation_num = data.data.total_num;
                  break;
                case '园区政策':
                  dataObj.park_num = data.data.total_num;
                  break;
                default:
                  break;
              }
              this.tableData = Object.assign(this.tableData, dataObj);
            } else {
              this.tableData = Object.assign(this.tableData, data.data);
            }
            if (params.category === '') {
              this.totalResult = data.data.total_num;
            }
            this.tableListTotal = data.data.total_num;
            this.pageTotal = Math.ceil(data.data.total_num / this.pageSize);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    changeType(n) {
      this.category = n.text;
      this.handleSearch();
    },
    removeItem(key) {
      this.form[key] = '';
      this.form[key + 'Name'] = '';
    },
    handleRemove(key) {
      this.resetCategory();
      this.removeItem(key);
      this.handleSearch();
      this.$refs.PolicyQueryHead.handleRemove(key);
    },
    handleReset() {
      Object.keys(this.form)
        .filter((n) => ['keyword'].indexOf(n) < 0)
        .forEach((n) => {
          this.form[n] = '';
        });
      this.resetCategory();
      this.handleSearch();
      ['regionCode', 'orgId', 'industryType'].forEach((n) => {
        this.$refs.PolicyQueryHead.handleRemove(n);
      });
    },
    changeCondition(val) {
      this.resetCategory();
      this.form = Object.assign(this.form, val);
      this.handleSearch();
    },
    handleSearch() {
      this.currentPage = 1;
      this.getTableData();
    },
    handleConfirmCondition(data) {
      this.form = data;
      this.handleSearch();
    },
    changePage(val) {
      this.currentPage = val;
      this.getTableData();
    }
  }
};
</script>
<style lang='less'>
.page-policy-list {
  padding-bottom: 40px;
  .condition-list {
    margin-right: 52px;
    padding: 0;
    border-top: none;
  }
  .ee-taber {
    margin-top: 4px;
  }
  .page-policy-common {
    padding-top: 20px;
  }
}
</style>
