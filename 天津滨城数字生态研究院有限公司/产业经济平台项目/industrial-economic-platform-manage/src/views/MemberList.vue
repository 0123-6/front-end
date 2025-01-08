<template>
  <div class="MemberList">
    <div class="ee-form--list">
      <div class="ee-form-item">
        <el-input
          class="ee-input"
          v-model="form.keywords"
          placeholder="请输入用户名/手机号"
          size="small"
          @keydown.enter.native="handleSearch"
          style="width: 300px">
          <i slot="suffix" class="el-icon el-icon-search" @click="handleSearch"></i>
        </el-input>
      </div>
    </div>
    <div class="ee-buttons text-right">
      <el-button type="primary" icon="el-icon-plus" :disabled="orgInfo.remark === '1'" @click="dialogVisible = true">添加</el-button>
    </div>
    <el-table ref="elTable" v-loading="loading" :data="dataList" tooltip-effect="dark" stripe @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" align="center" fixed="left" width="55"> </el-table-column> -->
      <el-table-column label="序号" prop="$index" width="80" fixed="left" />
      <el-table-column label="用户名" prop="username" show-overflow-tooltip></el-table-column>
      <el-table-column label="手机号" prop="mobile" show-overflow-tooltip> </el-table-column>
      <el-table-column label="注册时间" prop="createTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="角色" prop="roleName" show-overflow-tooltip> </el-table-column>
      <!-- <el-table-column label="备注" prop="remark" show-overflow-tooltip></el-table-column> -->
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" :disabled="orgInfo.remark === '1'" @click="handleDetail(scope.row)">查看</el-button>
          <el-button type="text" :disabled="scope.row.roleName === '管理员' || orgInfo.remark === '1'" @click="handleRemove(scope.row)"
            >移出</el-button
          >
          <!-- <el-button type="text" @click="handleAuth(scope.row)">授权</el-button> -->
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
    <el-dialog title="添加成员" top="10vh" :visible.sync="dialogVisible" :close-on-click-modal="false" width="900px">
      <visitor-list :orgInfo="orgInfo" @close="dialogVisible = false" @success="handleSearch" />
    </el-dialog>
  </div>
</template>

<script>
/*eslint-disable*/
import { mapGetters } from 'vuex';
import { getTimeDiff } from '@/utils';
import * as api from '@/api/tenant-manage';
import VisitorList from './VisitorList.vue';

export default {
  name: 'MemberList',
  components: {
    VisitorList
  },
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
      selectedList: [],
      dialogVisible: false
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
        ...this.form,
        tenantId: this.orgInfo.id
      };
      api.getUserListData(params).then(({ data }) => {
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
      this.$confirm(`确定移出 <span style="color:#356DF6">${row.username}</span> 吗？`, '提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确认',
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
                this.handleSearch();
              }
            });
        })
        .catch(() => {});
    },
    handleDetail(row) {
      this.$router.push(`/tenant/user/${this.orgInfo.id}/${row.id}`);
    },
    handleAuth() {},
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
