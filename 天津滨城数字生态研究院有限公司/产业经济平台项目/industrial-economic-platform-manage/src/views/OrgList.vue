<template>
  <div class="ee-view page-policy-list">
    <el-breadcrumb class="ee-breadcrumb" separator="/">
      <el-breadcrumb-item>机构管理</el-breadcrumb-item>
      <el-breadcrumb-item class="is-active">机构列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="ee-view__inner">
      <div class="ee-view__head">
        <div class="ee-view__title">机构列表</div>
        <div class="ee-form--list">
          <div class="ee-form-item">
            <el-input
              class="ee-input"
              v-model="form.keywords"
              placeholder="请输入机构全称，管理员，管理员手机号，销售人员"
              size="small"
              @keydown.enter.native="handleSearch"
              style="width: 380px">
              <i slot="suffix" class="el-icon el-icon-search" @click="handleSearch"></i>
            </el-input>
          </div>
        </div>
      </div>
      <div class="ee-view__body">
        <div class="ee-buttons">
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
        </div>
        <el-table ref="elTable" v-loading="loading" :data="dataList" tooltip-effect="dark" stripe @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" fixed="left" width="55" />
          <el-table-column label="序号" prop="$index" width="80" show-overflow-tooltip />
          <el-table-column label="机构ID" prop="code" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="机构全称" prop="organizationFullName" min-width="200" show-overflow-tooltip />
          <el-table-column label="状态" prop="status" width="80" show-overflow-tooltip>
            <template slot-scope="sc">
              <span class="ee-tag--dot is-success" :class="['is-success', 'is-danger', 'is-revoke'][[sc.row.status]]">
                {{ ['使用中', '已禁用', '已过期'][sc.row.status] }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="服务周期" prop="" width="210" show-overflow-tooltip>
            <template slot-scope="sc">
              <span>{{ sc.row.serviceStartTime + '至' + sc.row.serviceEndTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="用户数" prop="userNum" min-width="80" show-overflow-tooltip />
          <el-table-column label="剩余时长(天)" prop="leftDays" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column label="管理员" prop="contactPerson" min-width="80" show-overflow-tooltip />
          <el-table-column label="管理员手机号" prop="mobile" min-width="120" show-overflow-tooltip />
          <el-table-column label="销售人员" prop="salesperson" min-width="80" show-overflow-tooltip />
          <el-table-column label="创建时间" prop="createTime" width="170" show-overflow-tooltip />
          <el-table-column label="操作" width="130" fixed="right">
            <template slot-scope="sc">
              <el-button type="text" @click="handleDetail(sc.row)">查看</el-button>
              <el-button type="text" @click="handleEdit(sc.row)">编辑</el-button>
              <el-button type="text" :disabled="sc.row.status === 0 || sc.row.remark === '1'" @click="handleDel(sc.row)">删除</el-button>
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
import mixinListPage from '@/utils/mixinListPage';
import { getTimeDiff } from '@/utils';
import * as api from '@/api/tenant-manage';

export default {
  name: 'OrgList',
  components: {},
  mixins: [mixinListPage],
  data() {
    return {
      loading: false,
      form: {
        type: 1
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
  created() {},
  activated() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      this.loading = true;
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        ...this.form
      };
      api.getTenantListData(params).then(({ data }) => {
        this.dataList = data.list.map((n, i) => {
          n.leftDays = getTimeDiff(n.serviceStartTime + ' 00:00:00', n.serviceEndTime + ' 23:59:59');
          n.$index = this.$getRowIndex(i, this.currentPage, this.pageSize);
          return n;
        });
        this.total = data.total;
        this.loading = false;
      });
    },
    handleSearch() {
      this.currentPage = 1;
      this.getDataList();
    },
    handleAdd() {
      this.$router.push(`/tenant/form/0`);
    },
    handleEdit(row) {
      this.$router.push(`/tenant/form/${row.id}`);
    },
    handleDetail(row) {
      this.$router.push(`/tenant/detail/${row.id}`);
    },
    handleDel(row) {
      this.$confirm(`确定删除 <span style="color:#356DF6">${row.organizationFullName}</span> 吗？`, '提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api.deleteTenantData({ id: row.id }).then((res) => {
            if (res.code === '00000') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getDataList();
            }
          });
        })
        .catch(() => {});
    },
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
