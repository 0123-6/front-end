<template>
  <div class="page-policy-doc">
    <el-breadcrumb class="ee-breadcrumb fixed-top-left" separator="/">
      <el-breadcrumb-item>产业政策</el-breadcrumb-item>
      <el-breadcrumb-item class="is-active">政策匹配</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="ee-view-content wrap-inner">
      <div class="wrap-search flex-center">
        <el-input class="ee-input is-large" placeholder="请输入政策名称" v-model="keyword" clearable @keydown.enter.native="handleSearch">
          <el-button slot="append" :disabled="loading" @click="handleSearch">搜 索</el-button>
        </el-input>
      </div>
      <el-form
        v-loading="loading"
        element-loading-custom-class="ee-loading--none"
        class="wrap-form ee-form ee-form--bolder"
        :model="form"
        label-width="80px">
        <el-form-item label="区      域：">
          <ee-cascader
            ref="EeCascader"
            v-model="form.rootRegion"
            placeholder="全国"
            :options="regionTree"
            :multiple="false"
            autoResize
            @change="confirmRegion"
            @options-change="optionsChange" />
        </el-form-item>
        <el-form-item class="fitem--radio" label="地区范围：">
          <el-radio-group class="ee-radio-group" v-model="form.area_code" @change="changeAreaRange">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="86">国家部委</el-radio-button>
            <el-radio-button v-for="n in areaList" :label="n.regionCode" :key="n.regionCode">{{ n.regionName }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="fitem--radio" label="发布机构：">
          <div class="d-flex ai-end">
            <div class="flex-1" :style="{ overflow: 'hidden', maxHeight: showAllDepart ? '' : '68px' }">
              <el-radio-group ref="radioGroupOrg" class="ee-radio-group" v-model="form.department" @change="handleSearch">
                <el-radio-button label="">全部</el-radio-button>
                <el-radio-button v-for="n in departmentList" :label="n" :key="n">{{ n }}</el-radio-button>
              </el-radio-group>
            </div>
            <el-button v-if="showOrgMore" class="ee-button--back" type="text" @click="showAllDepart = !showAllDepart" style="margin-bottom: 8px">
              更多
              <i :class="showAllDepart ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
            </el-button>
          </div>
        </el-form-item>
        <el-form-item class="fitem--radio" label="产业类别：">
          <div class="d-flex ai-end">
            <div class="flex-1" :style="{ overflow: 'hidden', maxHeight: showAllChain ? '' : '68px' }">
              <el-radio-group ref="radioGroupType" class="ee-radio-group" v-model="form.tag" @change="handleSearch">
                <el-radio-button label="">全部</el-radio-button>
                <span v-for="n in industryTypeList" :key="n.name">
                  <el-popover popper-class="ee-radio-popper" placement="bottom" width="600" trigger="hover">
                    <el-radio-button slot="reference" :class="{ 'is-active-v': n.list.find((c) => c + '__' + n.name === form.tag) }" :label="n.name">
                      <span>{{ n.name }}</span>
                    </el-radio-button>
                    <el-radio-group class="ee-radio-group" v-model="form.tag" @change="handleSearch">
                      <el-radio-button v-for="c in n.list" :key="c" :label="c + '__' + n.name">{{ c }}</el-radio-button>
                    </el-radio-group>
                  </el-popover>
                </span>
              </el-radio-group>
            </div>
            <el-button v-if="showTypeMore" class="ee-button--back" type="text" @click="showAllChain = !showAllChain" style="margin-bottom: 8px">
              更多
              <i :class="showAllChain ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <div v-loading="loading" element-loading-custom-class="ee-loading" class="wrap-body">
        <div class="table-title">政策列表</div>
        <el-table :data="tableData" stripe>
          <el-table-column label="序号" prop="rowIndex" width="80" align="left" />
          <el-table-column label="政策名称" prop="title" min-width="150" align="left" show-overflow-tooltip="">
            <template v-slot="sc">
              <el-button class="ee-button--grid ell" type="text" @click="handleDetail(sc.row)">{{ sc.row.title }}</el-button>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="发布机构" prop="publish_department" min-width="100" align="left" />
          <el-table-column show-overflow-tooltip label="地区" prop="area_name" min-width="80" align="left" />
          <el-table-column show-overflow-tooltip label="申报时间" width="220" align="left">
            <template v-slot="sc">{{ sc.row.begin_date }} - {{ sc.row.end_date }}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="状态" width="90" align="left">
            <template v-slot="sc">
              <span class="ee-tag--dot" :class="getStatusClass(sc.row)">
                {{ sc.row.status == 1 ? '进行中' : '已截止' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="剩余天数" width="90" align="left">
            <template v-slot="sc">
              <span v-if="sc.row.remain_days > 0" class="ee-tag--rect is-ddin" :class="getLeftDayClass(sc.row)"> {{ sc.row.remain_days }}天 </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="操作" width="160" align="left">
            <template v-slot="sc">
              <el-button class="ee-button--grid" type="text" @click="handleDetail(sc.row)">查看详情</el-button>
              <el-button class="ee-button--grid" type="text" @click="goCompanyList(sc.row)">匹配企业</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-pagination
        class="ee-pagination"
        v-show="pageTotal > 1"
        layout="prev, pager, next, jumper"
        :current-page.sync="currentPage"
        :page-size="10"
        :total="tableListTotal"
        background
        @current-change="changePage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex';
import mixinRegion from '@/utils/mixinRegion';
import mixinIndustry from '@/utils/mixinIndustry';
import mixinScrollMemory from '@/utils/mixinScrollMemory';
import * as api from '@/api/policy';

export default {
  name: 'PolicyDoc',
  components: {},
  mixins: [mixinRegion, mixinIndustry, mixinScrollMemory],
  data() {
    return {
      keyword: '',
      tableListTotal: 10,
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      tableData: [],
      loading: false,
      form: {
        rootRegion: [],
        area_code: '',
        department: '',
        tag: ''
      },
      areaList: [],
      showAllDepart: false,
      showOrgMore: false,
      departmentList: [],
      showAllChain: false,
      showTypeMore: false
    };
  },
  computed: {
    ...mapGetters(['iep_platform_MENU_ID', 'iep_orgRegion'])
  },
  watch: {},
  mounted() {
    let rootRegion = [].concat(this.iep_orgRegion.regionPath);
    this.form.rootRegion = rootRegion;
    if (rootRegion[rootRegion.length - 1] !== 'china') {
      this.form.area_code = rootRegion[rootRegion.length - 1];
      this.getDepartmentList();
    }
    this.handleSearch();
    this.$nextTick(() => {
      console.log('cacheNodes', this.$refs.EeCascader.cacheNodes);
    });
  },
  activated() {},
  methods: {
    optionsChange(nodes) {
      let leafNodes = nodes.filter((n) => n.regionCode === this.iep_orgRegion.regionCode);
      let leafNode = leafNodes[leafNodes.length - 1];
      if (leafNode) {
        this.areaList = this.iep_orgRegion.regionPath
          .map((n) => nodes.find((c) => c.regionCode === n))
          .filter((n) => n && n.regionCode !== 'china')
          .concat(leafNode.children);
      }
    },
    confirmRegion(val, nodeList) {
      if (val.length > 0 && val[val.length - 1] !== 'china') {
        const leafNode = nodeList[nodeList.length - 1];
        this.areaList = Array.from(new Set(nodeList.map((n) => n.regionCode)))
          .map((n) => nodeList.find((c) => c.regionCode === n))
          .filter((n) => n && n.regionCode !== 'china')
          .concat(leafNode.children);
        this.form.area_code = leafNode.regionCode;
        this.getDepartmentList();
      } else {
        this.form.area_code = '';
        this.areaList = [];
        this.clearDepartment();
      }
      this.handleSearch();
    },
    changeAreaRange() {
      this.clearDepartment();
      this.getDepartmentList();
      this.handleSearch();
    },
    getDepartmentList() {
      const { area_code } = this.form;
      if (!area_code || area_code === 'china' || area_code === '1') return;
      api
        .getDepartmentList({
          area_code
        })
        .then(({ data }) => {
          if (data.code === 0) {
            this.departmentList = data.data.list;
            this.$nextTick(() => {
              this.showOrgMore = this.$refs.radioGroupOrg.$el.getBoundingClientRect().height > 68;
            });
          }
        });
    },
    clearDepartment() {
      this.showOrgMore = false;
      this.form.department = '';
      this.departmentList = [];
    },
    afterIndustryLoad() {
      this.$nextTick(() => {
        this.showTypeMore = this.$refs.radioGroupType.$el.getBoundingClientRect().height > 68;
      });
    },
    goCompanyList(row) {
      this.storeScrollMemory();
      this.$router.push(`/policy-company/${row.id}`);
    },
    handleDetail(row) {
      this.storeScrollMemory();
      this.$router.push(`/policy-detail/${row.id}`);
    },
    getStatusClass(row) {
      return row.status == 1 ? 'is-success' : 'is-danger';
    },
    getLeftDayClass(row) {
      return row.remain_days >= 20 ? 'is-success' : row.remain_days >= 10 ? 'is-warning' : 'is-danger';
    },
    handleSearch() {
      this.currentPage = 1;
      this.getTableData();
    },
    changePage(val) {
      this.currentPage = val;
      this.getTableData();
    },
    getTableData() {
      this.loading = true;
      const { rootRegion, area_code = '', department = '', tag = '' } = this.form;
      const is_all_area = area_code === '' ? 1 : 0;
      const formatAreaCode = is_all_area ? (rootRegion.length > 0 ? rootRegion[rootRegion.length - 1] : '') : area_code;
      api
        .getPolicyAwardList({
          page_size: this.pageSize,
          page_num: this.currentPage,
          keyword: this.keyword,
          source: department,
          tag: tag ? tag.split('__')[0] : '',
          area_code: formatAreaCode === 'china' ? '' : formatAreaCode,
          is_all_area
        })
        .then(({ data }) => {
          if (data.code === 0) {
            this.tableData = data.data.list.map((n, i) => {
              n.rowIndex = (this.currentPage - 1) * this.pageSize + i + 1;
              return n;
            });
            this.tableListTotal = data.data.total_num;
            this.pageTotal = Math.ceil(data.data.total_num / this.pageSize);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>
<style lang='less'>
.page-policy-doc {
  position: relative;
  background: url('@/assets/images/company-search-bg.png') center top no-repeat;
  background-size: 100% 184px;
  .wrap-inner {
    padding: 50px 0;
  }
  .wrap-search {
    .ee-input {
      width: 728px;
    }
  }
  .wrap-form {
    margin-top: 26px;
    padding: 24px 30px 1px;
    background: #fff;
    box-shadow: 0px 0px 16px 0px rgba(20, 38, 82, 0.07);
    .top-title {
      position: relative;
      padding: 8px 0;
      color: #1d2129;
      font-size: 18px;
      font-weight: 500;
      line-height: 22px;
      border-bottom: 1px solid rgba(229, 230, 235, 1);
    }
    .ee-input {
      width: 602px;
    }
  }
  .wrap-body {
    margin-top: 12px;
    padding: 19px 20px 22px;
    border-radius: 4px;
    background: #fff;
    box-shadow: 0px 0px 16px 0px rgba(20, 38, 82, 0.07);
    .table-title {
      color: #1d2129;
      font-size: 22px;
      font-weight: 600;
      line-height: 24px;
    }
    .el-table {
      margin-top: 12px;
    }
  }
}
</style>
