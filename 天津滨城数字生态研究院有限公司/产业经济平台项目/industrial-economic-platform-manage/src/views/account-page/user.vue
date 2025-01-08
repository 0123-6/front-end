<script>
/*eslint-disable*/
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import { addUserData, deleteUserData, getUserDetailData, getUserListData, startUserData, stopUserData, updateUserData } from '@/api/user-manage';
import { validateEmail, validateName, validatePhone } from '@/utils/validate';
import role from '@/views/account-page/role.vue';
import { getRoleListAllData } from '@/api/role-manage';

export default defineComponent({
  name: 'UserList',
  computed: {
    role() {
      return role;
    },
    ...mapGetters(['USER_INFO'])
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      keywords: '',
      tableData: [],
      dialogUserVisible: false,
      dialogUserTitle: '',
      UserForm: null,
      UserRules: {
        username: [{ required: true, message: '请输入账户名称', trigger: 'blur' }],
        nickname: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        roleId: [{ required: true, message: '请选择角色', trigger: 'blur' }]
      },
      roleOptions: []
    };
  },
  mounted() {
    this.getUserList();
    this.getRoleList();
  },
  methods: {
    // 序号排序
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    // 每页选择
    changeSize(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getUserList();
    },
    // 分页
    changePage(val) {
      this.currentPage = val;
      this.getUserList();
    },
    // 获取用户列表
    getUserList() {
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        keywords: this.keywords
      };
      getUserListData(params).then((res) => {
        this.tableData = res.data.list;
        this.total = res.data.total;
      });
    },
    // 获取角色列表
    getRoleList() {
      getRoleListAllData().then((res) => {
        this.roleOptions = res.data;
      });
    },
    // 重置
    reset() {
      this.keywords = '';
      this.getUserList();
    },
    // 编辑用户
    editUser(row) {
      this.getUserDetail(row);
      this.dialogUserVisible = true;
      this.$refs.UserForm?.resetFields();
      this.dialogUserTitle = '编辑用户';
    },
    getUserDetail(row) {
      getUserDetailData({ userId: row.id }).then((res) => {
        this.UserForm = res.data;
        this.UserForm.roleId = res.data.role.id;
      });
    },
    // 创建用户
    createUser() {
      this.dialogUserVisible = true;
      this.UserForm = {};
      this.$refs.UserForm?.resetFields();
      this.dialogUserTitle = '创建用户';
    },
    dialogUserConfirm() {
      this.$refs.UserForm.validate((valid) => {
        if (valid) {
          if (this.dialogUserTitle === '创建用户') {
            addUserData(this.UserForm).then((res) => {
              if (res.code === '00000') {
                this.$message({
                  type: 'success',
                  message: '创建成功!'
                });
                this.dialogUserVisible = false;
                this.getUserList();
              }
            });
          } else {
            updateUserData(this.UserForm).then((res) => {
              if (res.code === '00000') {
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                this.dialogUserVisible = false;
                this.getUserList();
              }
            });
          }
        }
      });
    },
    changeStatus(row) {
      if (row.status === 0) {
        this.startUser(row);
      } else {
        this.stopUser(row);
      }
    },
    // 停用用户
    stopUser(row) {
      this.$confirm('此操作将停用该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          stopUserData({ id: row.id }).then((res) => {
            if (res.code === '00000') {
              this.$message({
                type: 'success',
                message: '停用成功!'
              });
              this.getUserList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消停用'
          });
        });
    },
    // 启用用户
    startUser(row) {
      this.$confirm('此操作将启用该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          startUserData({ id: row.id }).then((res) => {
            if (res.code === '00000') {
              this.$message({
                type: 'success',
                message: '启用成功!'
              });
              this.getUserList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消启用'
          });
        });
    },
    // 删除用户
    deleteUser(row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteUserData({ id: row.id }).then((res) => {
            if (res.code === '00000') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getUserList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    toPath(path) {
      this.$router.push(`${path}`);
    }
  }
});
</script>

<template>
  <div class="user-container">
    <div class="user-search" style="margin-top: 24px">
      <span>关键词搜索</span>
      <el-input type="text" v-model="keywords" placeholder="请输入账号/姓名/手机号/所属单位" />
      <el-button type="primary" plain @click="reset">重置</el-button>
      <el-button type="primary" @click="getUserList()">搜索</el-button>
    </div>
    <div class="user-table">
      <div class="user-btn">
        <div>用户列表</div>
        <el-button type="primary" icon="el-icon-plus" @click="createUser">创建用户</el-button>
      </div>
      <el-table :data="tableData" stripe style="margin: 0 24px; width: auto">
        <el-table-column label="序号" type="index" width="80" :index="indexMethod" />
        <el-table-column prop="username" label="账号" min-width="180"></el-table-column>
        <el-table-column prop="nickname" label="姓名" min-width="180"></el-table-column>
        <el-table-column prop="mobile" label="手机号" min-width="180"></el-table-column>

        <el-table-column prop="organization" label="所属单位" min-width="180"></el-table-column>
        <el-table-column prop="role.name" label="角色" min-width="180"></el-table-column>

        <el-table-column prop="status" label="账号状态" min-width="180">
          <template slot-scope="scope">
            <span>
              <span :class="scope.row.status === 1 ? 'successDot' : 'dangerDot'"></span>
              {{ scope.row.status === 1 ? '已启用' : '已停用' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="180"></el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-switch
              class="switch"
              :value="Boolean(scope.row.status)"
              active-text="✓"
              inactive-text="×"
              active-color="#356DF6"
              inactive-color="#BFBFBF"
              @change="changeStatus(scope.row)">
            </el-switch>
            <el-button class="ml8" type="text" @click="editUser(scope.row)">编辑</el-button>
            <el-button v-if="USER_INFO.id !== scope.row.id" type="text" style="color: #ff4d4f" @click="deleteUser(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="display: flex; justify-content: flex-end; padding: 24px 24px 50px"
        v-show="total > 0 && tableData.length > 10"
        background
        layout="total, prev, pager, next, sizes"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        :total="total"
        @size-change="changeSize"
        @current-change="changePage">
      </el-pagination>
    </div>
    <el-dialog
      class="userFormDialog"
      v-if="UserForm !== null"
      :title="dialogUserTitle"
      :visible.sync="dialogUserVisible"
      :close-on-click-modal="false">
      <el-form ref="UserForm" :model="UserForm" :rules="UserRules">
        <el-form-item class="half-item" label="账号" label-width="120px" prop="username">
          <el-input v-model="UserForm.username" autocomplete="off" placeholder="请输入账号名称"></el-input>
        </el-form-item>
        <el-form-item class="half-item" label="姓名" label-width="120px" prop="nickname">
          <el-input v-model="UserForm.nickname" placeholder="请输入姓名"> </el-input>
        </el-form-item>
        <el-form-item class="half-item" label="手机号" label-width="120px" prop="mobile">
          <el-input v-model="UserForm.mobile" placeholder="请输入手机号"> </el-input>
        </el-form-item>
        <el-form-item class="half-item" label="所属单位" label-width="120px">
          <el-input v-model="UserForm.organization" placeholder="请输入所属单位"> </el-input>
        </el-form-item>
        <el-form-item class="half-item" label="邮箱" label-width="120px">
          <el-input v-model="UserForm.email" placeholder="请输入邮箱"> </el-input>
        </el-form-item>
        <el-form-item class="half-item" label="角色" label-width="120px" prop="roleId">
          <el-select v-model="UserForm.roleId" placeholder="请选择角色" style="width: 100%">
            <el-option v-for="item of roleOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="roleOptions.length === 0" label-width="120px">
          <div>还未创建角色，请前往 <span style="color: #0d7cdb" @click="toPath('role')">角色管理</span>页面，先创建角色，再新增用户</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogUserConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.user-container {
  .user-search {
    height: 80px;
    margin: 0 24px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-radius: 4px;
    background: #fff;
    box-shadow: 0 0 16px 0 rgba(20, 38, 82, 0.07);
    > span {
      margin-left: 24px;
      display: inline-block;
      width: 70px;
      color: #1a262c;
      font-size: 14px;
      font-family: PingFang SC;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;
      margin-right: 10px;
    }
    > .el-input {
      width: 240px;
      margin-right: 10px;
    }
  }
  .user-table {
    margin: 10px 24px 24px;
    padding-bottom: 24px;
    border-radius: 4px;
    background: #fff;
    box-shadow: 0 0 16px 0 rgba(20, 38, 82, 0.07);
    .user-btn {
      padding: 34px 24px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      > div {
        color: #1d2129;
        font-size: 22px;
        font-family: PingFang SC;
        font-style: normal;
        font-weight: 600;
        line-height: 24px;
      }
    }
  }
  .userFormDialog {
    .half-item {
      display: inline-block;
      width: 50%;
    }
  }
}
</style>
