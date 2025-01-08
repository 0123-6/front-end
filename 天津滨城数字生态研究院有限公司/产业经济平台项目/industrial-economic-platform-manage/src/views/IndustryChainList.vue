<template>
  <div class="ee-view page-policy-list">
    <el-breadcrumb class="ee-breadcrumb" separator="/">
      <el-breadcrumb-item class="is-active">产业链管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="ee-view__inner">
      <div class="ee-view__head">
        <div class="ee-view__title">产业链管理</div>
        <div class="ee-form--list">
          <div class="ee-form-item">
            <el-input class="ee-input" v-model="form.chainName" placeholder="请输入产业名称" size="small" @keydown.enter.native="handleSearch">
              <i slot="suffix" class="el-icon el-icon-search" @click="handleSearch"></i>
            </el-input>
          </div>
          <div class="ee-form-item">
            <div class="ee-form-label">产业：</div>
            <el-select v-model="form.chainCode" placeholder="选择产业" clearable filterable="" size="small" @change="handleSearch">
              <el-option v-for="n in typeList" :label="n.name" :value="n.chainCode" :key="n.name"></el-option>
            </el-select>
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
          <el-table-column label="名称" prop="name" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="产业链节点" prop="totalNode" min-width="80" show-overflow-tooltip />
          <el-table-column label="企业数量" prop="totalCompany" min-width="80" show-overflow-tooltip />
          <el-table-column label="创建时间" prop="createTime" min-width="100" show-overflow-tooltip />
          <el-table-column label="状态" prop="onlineStatus" min-width="80" show-overflow-tooltip>
            <template slot-scope="sc">
              <span class="ee-tag--dot is-success" :class="sc.row.onlineStatus !== false ? 'is-success' : 'is-revoke'">
                {{ sc.row.onlineStatus !== false ? '已上线' : '已下线' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="handleDetail(scope.row)">查看</el-button>
              <!-- <el-button type="text" @click="handleAdd(scope.row)">编辑</el-button>
              <el-button type="text" @click="handleAdd(scope.row)">上线</el-button>
              <el-button type="text" @click="handleAdd(scope.row)">下线</el-button>
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
import * as api from '@/api/industryChain';

export default {
  name: 'IndustryChainList',
  components: {},
  data() {
    return {
      loading: false,
      form: {},
      dataList: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      selectedList: [],
      typeList: []
    };
  },
  computed: {},
  created() {
    this.getIndustryList();
    this.getDataList();
  },
  methods: {
    getIndustryList() {
      api
        .getIndustryChainList({
          pageSize: 999,
          pageNum: 1
        })
        .then(({ data }) => {
          this.typeList = data.list;
        });
    },
    getDataList() {
      this.loading = true;
      api
        .getIndustryChainList({
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          ...this.form
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
    handleAdd() {},
    handleDetail(row) {
      // this.$router.push(`/industry/detail/${row.id}`);
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
