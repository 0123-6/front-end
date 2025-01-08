<template>
  <div class="ee-view page-policy-list">
    <el-breadcrumb class="ee-breadcrumb" separator="/">
      <el-breadcrumb-item>政策管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="ee-view__inner">
      <div class="ee-view__head">
        <div class="ee-view__title">政策管理</div>
        <div class="ee-form--list">
          <div class="ee-form-item">
            <el-input class="ee-input" v-model="form.keyword" placeholder="请输入政策名称" size="small" @keydown.enter.native="handleSearch">
              <i slot="suffix" class="el-icon el-icon-search" @click="handleSearch"></i>
            </el-input>
          </div>
          <div class="ee-form-item">
            <div class="ee-form-label">区域：</div>
            <el-cascader
              v-model="form.area_code"
              :options="CITY_OPTIONS"
              :props="{ checkStrictly: true, ...$regionProps, emitPath: false }"
              placeholder="选择区域"
              filterable
              clearable
              size="small"
              @change="changeArea"></el-cascader>
          </div>
          <div class="ee-form-item">
            <div class="ee-form-label">发布机构：</div>
            <el-select v-model="form.source" placeholder="选择发布机构" clearable filterable="" size="small" @change="handleSearch">
              <el-option v-for="n in departmentList" :label="n" :value="n" :key="n"></el-option>
            </el-select>
          </div>
          <div class="ee-form-item">
            <div class="ee-form-label">产业类别：</div>
            <el-cascader
              v-model="form.tag"
              :options="industryTypeList"
              :props="{ checkStrictly: true, value: 'name', label: 'name', children: 'list', emitPath: false }"
              placeholder="选择产业类别"
              clearable
              filterable
              size="small"
              @change="changeIndustryType"></el-cascader>
          </div>
        </div>
      </div>
      <div class="ee-view__body">
        <!-- <div class="ee-buttons">
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
          <el-button type="primary" plain :disabled="selectedList.length !== 0" icon="el-icon-delete" @click="handleDel">删除</el-button>
        </div> -->
        <el-table
          ref="elTable"
          v-loading="loading"
          :data="dataList"
          tooltip-effect="dark"
          stripe
          @selection-change="handleSelectionChange"
          @filter-change="filterHandler">
          <!-- <el-table-column type="selection" align="center" fixed="left" width="55" /> -->
          <el-table-column label="序号" prop="$index" width="80" show-overflow-tooltip />
          <el-table-column label="名称" prop="title" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column
            label="类别"
            prop="category"
            column-key="category"
            :filter-multiple="false"
            :filters="policyCategories"
            width="80"
            show-overflow-tooltip />
          <el-table-column label="文号" prop="document_no" width="120" show-overflow-tooltip />
          <el-table-column label="成文日期" prop="written_date" sortable="" width="120" show-overflow-tooltip />
          <el-table-column label="发布日期" prop="publish_date" sortable width="120" show-overflow-tooltip />
          <el-table-column label="索引号" prop="index_no" min-width="80" show-overflow-tooltip />
          <el-table-column label="发布机构" prop="publish_department" min-width="80" show-overflow-tooltip />
          <el-table-column label="地区" prop="care_name" min-width="80" show-overflow-tooltip />
          <el-table-column label="申报时间" prop="" width="200" show-overflow-tooltip>
            <template slot-scope="sc">{{ sc.row.begin_date || sc.row.end_date ? `${sc.row.begin_date} ~ ${sc.row.end_date}` : '-' }}</template>
          </el-table-column>
          <el-table-column
            label="状态"
            prop="status"
            column-key="status"
            :filter-multiple="false"
            :filters="policyStatus"
            width="80"
            show-overflow-tooltip>
            <template v-slot="sc">
              <span class="ee-tag--dot" :class="getStatusClass(sc.row)">
                {{ sc.row.status == 1 ? '进行中' : '已截止' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="剩余天数" prop="remain_days" sortable="" width="100" show-overflow-tooltip>
            <template v-slot="sc">
              <span v-if="sc.row.remain_days > 0" class="ee-tag--rect is-ddin" :class="getLeftDayClass(sc.row)"> {{ sc.row.remain_days }}天 </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="70" fixed="right">
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
import * as api from '@/api/policy';
import { policyCategories, policyStatus } from '@/utils/constant';

export default {
  name: 'PolicyList',
  components: {},
  data() {
    return {
      loading: false,
      form: {
        area_code: '',
        category: '',
        keyword: '',
        source: '',
        tag: ''
      },
      dataList: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      selectedList: [],
      industryTypeList: [],
      departmentList: [],
      policyCategories: policyCategories.map((n) => {
        n.value = n.text;
        return n;
      }),
      policyStatus
    };
  },
  computed: {
    ...mapGetters(['CITY_OPTIONS'])
  },
  created() {
    this.getIndustryCategoryList();
    this.getDataList();
  },
  mounted() {},
  methods: {
    filterHandler(filters) {
      // console.log('filters', filters);
      Object.keys(filters).forEach((n) => {
        this.form[n] = filters[n][0] || '';
      });
      this.handleSearch();
    },
    getStatusClass(row) {
      return row.status == 1 ? 'is-success' : 'is-danger';
    },
    getLeftDayClass(row) {
      return row.remain_days >= 20 ? 'is-success' : row.remain_days >= 10 ? 'is-warning' : 'is-danger';
    },
    getDataList() {
      this.loading = true;
      const { tag, area_code } = this.form;
      api
        .getOamPolicyList({
          page_size: this.pageSize,
          page_num: this.currentPage,
          ...this.form,
          tag: tag ? tag.split('__')[0] : '',
          area_code: area_code === 'china' ? 86 : area_code
        })
        .then(({ data }) => {
          if (data.code === 0) {
            this.dataList = data.data.list.map((n, i) => {
              // n.remain_days = 100;
              n.$index = this.$getRowIndex(i, this.currentPage, this.pageSize);
              return n;
            });
            this.total = data.data.total_num;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getIndustryCategoryList() {
      api
        .getIndustryCategoryList()
        .then(({ data }) => {
          this.industryTypeList = data.data.industry_category.map((n) => ({
            name: n.name,
            list: n.list.map((c) => ({
              name: c,
              list: []
            }))
          }));
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getDepartmentList() {
      const { area_code } = this.form;
      if (!area_code) return;
      api
        .getDepartmentList({
          area_code: area_code === 'china' ? 86 : area_code
        })
        .then(({ data }) => {
          if (data.code === 0) {
            this.departmentList = data.data.list;
          }
        });
    },
    handleSearch() {
      this.currentPage = 1;
      this.getDataList();
    },
    changeIndustryType() {
      this.handleSearch();
    },
    changeArea(val) {
      this.form.source = '';
      this.departmentList = [];
      this.getDepartmentList();
      this.handleSearch();
    },
    handleAdd() {},
    handleDetail(row) {
      this.$router.push(`/policy/detail/${row.id}`);
    },
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
