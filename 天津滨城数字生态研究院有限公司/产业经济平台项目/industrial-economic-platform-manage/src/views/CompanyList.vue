<template>
  <div class="ee-view page-policy-list">
    <el-breadcrumb class="ee-breadcrumb" separator="/">
      <el-breadcrumb-item>企业管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="ee-view__inner">
      <div class="ee-view__head">
        <div class="ee-view__title">企业管理</div>
        <div class="ee-form--list">
          <div class="ee-form-item">
            <el-input
              class="ee-input"
              v-model="form.keywords"
              placeholder="请输入公司名称，法人姓名"
              size="small"
              @keydown.enter.native="handleSearch"
              style="width: 256px">
              <i slot="suffix" class="el-icon el-icon-search" @click="handleSearch"></i>
            </el-input>
          </div>
          <div class="ee-form-item">
            <div class="ee-form-label">地区：</div>
            <el-cascader
              v-model="form.region"
              :options="CITY_OPTIONS"
              :props="{ checkStrictly: true, ...$regionProps }"
              placeholder="选择地区"
              filterable
              size="small"
              @change="changeArea"></el-cascader>
          </div>
        </div>
      </div>
      <div class="ee-view__body">
        <!-- <div class="ee-buttons">
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
          <el-button type="primary" plain :disabled="selectedList.length !== 0" icon="el-icon-delete" @click="handleDel">删除</el-button>
        </div> -->
        <el-table ref="elTable" v-loading="loading" :data="dataList" tooltip-effect="dark" stripe @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" fixed="left" width="55" />
          <el-table-column label="序号" prop="$index" width="80" show-overflow-tooltip />
          <el-table-column label="统一社会信用代码" prop="creditNo" width="180" show-overflow-tooltip>
            <template slot-scope="sc">
              {{ sc.row.creditNo || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="企业" prop="companyName" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="经营状态" prop="regStatusName" width="80" show-overflow-tooltip>
            <template slot-scope="sc">
              <div class="ee-tag--dot is-dark" :class="'is-' + sc.row.regStatus">
                {{ company_status.find((n) => n.itemCode == sc.row.regStatus).itemName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="法人" prop="legalPersonName" width="100" show-overflow-tooltip />
          <el-table-column label="注册资本" prop="regCapital" min-width="80" show-overflow-tooltip>
            <template slot-scope="sc">
              {{ sc.row.regCapital ? `${sc.row.regCapital}万元` : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="成立时间" prop="setupDate" width="110" show-overflow-tooltip>
            <template slot-scope="sc">
              {{ (sc.row.setupDate || '').substr(0, 10) }}
            </template>
          </el-table-column>
          <el-table-column label="省" prop="provinceName" min-width="60" show-overflow-tooltip />
          <el-table-column label="市" prop="cityName" min-width="60" show-overflow-tooltip />
          <el-table-column label="区" prop="countyName" min-width="60" show-overflow-tooltip />
          <el-table-column label="所属行业" prop="industryName" min-width="80" show-overflow-tooltip />
          <el-table-column label="资质类别" prop="types" min-width="60" show-overflow-tooltip>
            <template slot-scope="sc">
              {{ (sc.row.types || []).join(',') || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="handleDetail(scope.row)">查看</el-button>
              <!-- <el-button type="text" @click="handleAdd(scope.row)">编辑</el-button>
              <el-button type="text" @click="handleDel(scope.row)">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-show="total > pageSize"
          class="ee-pagination"
          background
          layout="total,prev, pager, next,sizes,jumper"
          :current-page.sync="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          :total="total"
          @size-change="changeSize"
          @current-change="changePage">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import { mapGetters } from 'vuex';
import * as api from '@/api/company';
const { company_type, key_company, company_status } = JSON.parse(localStorage.getItem('iep_platform_all_dict'));

export default {
  name: 'CompanyList',
  components: {},
  data() {
    return {
      company_status,
      loading: false,
      form: {
        region: ['china']
      },
      dataList: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      selectedList: [],
      industryTypeList: [],
      departmentList: []
    };
  },
  computed: {
    ...mapGetters(['CITY_OPTIONS'])
  },
  created() {
    this.getDataList();
  },
  mounted() {},
  methods: {
    getDataList() {
      this.loading = true;
      const { keywords = '', region } = this.form;
      api
        .getCompanyList({
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          keywords,
          regionCode: region.length === 1 ? '' : region[region.length - 1],
          regionLevel: region.length === 1 ? '' : Array.from(new Set(region)).length - 1
        })
        .then(({ data }) => {
          this.dataList = data.list.map((n, i) => {
            n.$index = this.$getRowIndex(i, this.currentPage, this.pageSize);
            return n;
          });
          this.total = data.total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleSearch() {
      this.currentPage = 1;
      this.getDataList();
    },
    changeArea(val) {
      this.handleSearch();
    },
    handleAdd() {},
    handleDetail() {},
    handleDel() {},
    changeSize() {
      this.handleSearch();
    },
    changePage(val) {
      this.currentPage = val;
      this.getDataList();
    },
    handleSelectionChange(val) {
      this.selectedList = val;
    }
  }
};
</script>
<style lang='less'>
</style>
