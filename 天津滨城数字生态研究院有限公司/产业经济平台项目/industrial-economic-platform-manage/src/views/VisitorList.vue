<template>
  <div class="MemberList">
    <div class="ee-form--list d-flex ai-center jc-between">
      <div class="ee-form-item">
        <el-input
          class="ee-input"
          v-model="form.keywords"
          placeholder="请输入用户名/手机号/企业单位"
          size="small"
          @keydown.enter.native="handleSearch"
          style="width: 300px">
          <i slot="suffix" class="el-icon el-icon-search" @click="handleSearch"></i>
        </el-input>
      </div>
      <div>
        已选<span style="color: #356df6">
          {{ selectedList.length }}
        </span>
        项
      </div>
    </div>
    <el-table
      ref="elTable"
      v-loading="loading"
      :data="dataList"
      height="calc(80vh - 150px)"
      tooltip-effect="dark"
      stripe
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" width="55"> </el-table-column>
      <el-table-column label="序号" prop="$index" width="80" show-overflow-tooltip />
      <el-table-column label="用户名" prop="username" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column label="手机号" prop="mobile" width="120" show-overflow-tooltip> </el-table-column>
      <el-table-column label="注册时间" prop="createTime" width="170" show-overflow-tooltip></el-table-column>
      <el-table-column label="企业单位" prop="organization" show-overflow-tooltip> </el-table-column>
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
    <div class="text-center" style="padding: 20px 0">
      <el-button @click="$emit('close')">取消</el-button>
      <el-button type="primary" :disabled="selectedList.length == 0" @click="handleConfirm">确认</el-button>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import { mapGetters } from 'vuex';
import * as api from '@/api/tenant-manage';

export default {
  name: 'VisitorList',
  components: {},
  mixins: [],
  props: {
    orgInfo: {}
  },
  data() {
    return {
      loading: false,
      form: {
        keywords: ''
      },
      dataList: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      selectedList: []
    };
  },
  computed: {
    ...mapGetters([])
  },
  created() {
    this.getDataList();
  },
  mounted() {},
  methods: {
    getDataList() {
      this.loading = true;
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        ...this.form
      };
      api.getVisitorUsers(params).then(({ data }) => {
        this.dataList = data.list.map((n, i) => {
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
    handleAdd() {},
    handleRemove(row) {
      this.$confirm(`确定移出【${row.name}】吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api
            .removeUser({
              userId: row.id,
              tenantId: this.orgInfo.id
            })
            .then(({ code }) => {
              if (code === '00000') {
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                });
              }
            });
        })
        .catch(() => {});
    },
    handleDetail(row) {
      this.$router.push(`/tenant/detail/${row.id}`);
    },
    handleAuth() {},
    changeSize() {
      this.handleSearch();
    },
    changePage(val) {
      this.currentPage = val;
      this.getDataList();
    },
    handleConfirm() {
      this.loading = true;
      api
        .addUsers({
          userIds: this.selectedList.map((n) => n.id),
          tenantId: this.orgInfo.id
        })
        .then(({ code }) => {
          if (code === '00000') {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
            this.selectedList = [];
            this.handleSearch();
            this.$emit('close');
            this.$emit('success');
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleSelectionChange(val) {
      this.selectedList = val;
    }
  }
};
</script>
<style lang='less'>
</style>
