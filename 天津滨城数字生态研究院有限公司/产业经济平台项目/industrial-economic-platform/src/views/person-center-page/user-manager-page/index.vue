<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2023-07-18 14:22:54
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2023-07-20 15:43:09
 * @FilePath: \industrial-economic-platform\src\views\person-center-page\user-manager-page\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="home-container">
    <div class="main-container">
      <el-container>
        <el-main>
          <div class="header">
            <div class="title">用户列表</div>
            <div class="operation">
              <el-input placeholder="请输入姓名" v-model="searchWord" clearable @clear="searchTable" class="search-input">
                <el-button slot="append" icon="el-icon-search" @click="searchTable"></el-button>
              </el-input>
              <el-button class="primary" @click="openDialog('create')">创建用户</el-button>
            </div>
          </div>
          <div class="table">
            <el-table
              :data="tableData"
              stripe
            >
              <el-table-column label="序号" type="index" :index="indexMethod" width="80" align="center" />
              <el-table-column show-overflow-tooltip label="账号" prop="username" min-width="60" align="center"/>
              <el-table-column show-overflow-tooltip label="姓名" prop="nickname" min-width="80" align="center" />
              <el-table-column show-overflow-tooltip label="手机号" prop="mobile" min-width="80" align="center" />
              <el-table-column show-overflow-tooltip label="所属单位" prop="organization" min-width="80" align="center" />
              <el-table-column show-overflow-tooltip label="角色" prop="role.name" min-width="80" align="center" />
              <el-table-column show-overflow-tooltip label="账户状态" prop="status" min-width="80" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.role.code === 'admin'">-</div>
                  <div v-else>
                    <span class="dot" :class="{success:scope.row.status === 1,error:scope.row.status !== 1}"></span>
                    {{ scope.row.status === 1?'已启用':'已停用' }}</div>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip label="创建时间" prop="createTime" min-width="80" align="center" />
              <el-table-column label="操作"  min-width="120" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.role.code === 'admin'">-</div>
                  <div v-else>
                    <el-switch
                      v-model="scope.row.status"
                      active-color="#356DF6"
                      active-icon-class="el-icon-close"
                      inactive-icon-class="el-icon-check"
                      :active-value="1"
                      :inactive-value="0"
                      @change="value => changeStatus(value, scope.row.id)">
                    </el-switch>
                    <el-button
                        class="text-button"
                        type="text"
                        style="padding: 0"
                        :disabled="scope.row.status !== 1 || iep_platform_USER_INFO.id === scope.row.id"
                        @click="getUserDetail(scope.row.id)">编辑</el-button>
                    <el-popover
                      placement="top"
                      width="240"
                      :disabled="iep_platform_USER_INFO.id === scope.row.id"
                      :ref="'popover-delete-' + scope.row.id">
                      <p><i class="el-icon-warning" style="color: #F8AA50; margin: 8px"></i>确定要删除该用户吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" @click="closePopover(scope.row.id)">取消</el-button>
                        <el-button class="primary" size="mini" @click="confirmPopover(scope.row.id)">确定</el-button>
                      </div>
                      <span class="text-button"
                            :style="{color: iep_platform_USER_INFO.id === scope.row.id ? '#b7b7b7' : '#CC4F47'}"
                            slot="reference">删除</span>
                    </el-popover>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              v-show="tableListTotal > 0"
              layout="prev, pager, next, jumper"
              :current-page.sync="currentPage"
              :page-size="10"
              background
              :total="tableListTotal"
              @current-change="changeTablePage">
            </el-pagination>
          </div>
        </el-main>
      </el-container>
    </div>
    <MessageDialog
      v-if="messageDialogVisible"
      :title="messageDialogTitle"
      :width="800"
      @save="saveMessage"
      @cancel="cancelMessage"
    >
      <template slot="content">
        <el-form ref="createFormEL" :model="createForm" label-width="100px" :rules="rules">
          <div>
            <el-form-item label="账号：" prop="username">
              <el-input v-model="createForm.username" placeholder="请输入账号" v-if="messageDialogType === 'create'"></el-input>
              <span v-else>{{ createForm.username }}</span>
              <span
                  style="text-align: left; display: inline-block; width: 100%; font-size: 14px; color: #8c939d"
              >可使用手机号，姓名创建账号，支持文字、数字、字母、不支持特殊字符和空格</span>
            </el-form-item>
            <el-form-item label="手机号：" prop="mobile">
              <el-input v-model="createForm.mobile" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" prop="email">
              <el-input v-model="createForm.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item label="姓名：" prop="nickname">
              <el-input v-model="createForm.nickname" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="所属单位：" prop="organization">
              <el-input v-model="createForm.organization" placeholder="请输入所属单位"></el-input>
            </el-form-item>
            <el-form-item label="角色：" prop="roleId">
              <el-select v-model="createForm.roleId" placeholder="请选择角色" style="width: 100%">
                <el-option
                    v-for="item in roleOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" v-if="roleOptions.length === 0" style="text-align: left">
              <div>
                <i class="el-icon-warning" style="color: #E6A23C"></i>
                还未创建角色，请前往
                <span style="color: #409EFF; cursor: pointer" @click="toRoleManager">角色管理</span>
                ，先创建角色，在新增用户。
              </div>
            </el-form-item>
          </div>
        </el-form>
      </template>
    </MessageDialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { userApis } from '@/api/user-manager';
import { roleApis } from '@/api/role-manager';
import { validateEmail, validateAccount, validatePhone } from '@/utils/validate';
import MessageDialog from '@/components/MessageDialog';

export default {
  name: 'UserManager',
  data() {
    return {
      searchWord: '',
      tableData: [],
      tableListTotal: 0,
      currentPage: 1,
      roleOptions: [],
      createForm: {
        id: '',
        username: '',
        mobile: '',
        email: '',
        nickname: '',
        organization: '',
        roleId: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入账户名称', trigger: 'blur' },
          { validator: validateAccount, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      },
      messageDialogVisible: false,
      messageDialogType: '',
      messageDialogTitle: ''
    };
  },
  components: {
    MessageDialog
  },
  computed: {
    ...mapGetters(['iep_platform_USER_INFO'])
  },
  mounted() {
    this.searchTable();
    this.getRoleOptions();
  },
  methods: {
    searchTable() {
      this.changeTablePage(1);
    },
    // 序号排序
    indexMethod(index) {
      return (this.currentPage - 1) * 10 + index + 1;
    },
    changeTablePage(val) {
      this.currentPage = val;
      this.getTableData();
    },
    getTableData() {
      const params = {
        keywords: this.searchWord,
        pageSize: 10,
        pageNum: this.currentPage
      };
      userApis.userTable(params).then((result) => {
        this.tableData = result.data.list;
        this.tableListTotal = result.data.total;
        if (
          this.tableListTotal > 0 && result.data.list.length === 0 && this.currentPage > 1
        ) {
          this.currentPage -= 1;
          this.getTableData();
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    getRoleOptions() {
      roleApis.allRoleTable().then((result) => {
        this.roleOptions = result.data;
      }).catch((err) => {
        console.log(err);
      });
    },
    getUserDetail(id) {
      userApis.userDetail({ userId: id }).then((result) => {
        this.createForm.id = id;
        this.createForm.username = result.data.username;
        this.createForm.mobile = result.data.mobile;
        this.createForm.email = result.data.email;
        this.createForm.nickname = result.data.nickname;
        this.createForm.organization = result.data.organization;
        this.createForm.roleId = result.data.role.id;
        this.openDialog('edit');
      }).catch((err) => {
        console.log(err);
      });
    },
    openDialog(type) {
      this.messageDialogType = type;
      if (type === 'create') {
        this.messageDialogTitle = '创建用户';
        this.messageDialogVisible = true;
        this.createForm.id = '';
        this.createForm.username = '';
        this.createForm.mobile = '';
        this.createForm.email = '';
        this.createForm.nickname = '';
        this.createForm.organization = '';
        this.createForm.roleId = '';
      } else {
        this.messageDialogTitle = '编辑用户';
        this.messageDialogVisible = true;
      }
    },
    saveMessage() {
      this.$refs.createFormEL.validate((valid) => {
        if (valid) {
          if (this.messageDialogType === 'create') {
            const {
              username, mobile, email, nickname, organization, roleId
            } = this.createForm;
            userApis.createUser({
              username, mobile, email, nickname, organization, roleId
            }).then((result) => {
              if (result.data) {
                this.$message({
                  type: 'success',
                  message: '创建成功'
                });
              }
              this.changeTablePage(1);
              this.messageDialogVisible = false;
            }).catch((err) => {
              console.log(err);
            });
          } else if (this.messageDialogType === 'edit') {
            const {
              id, mobile, email, nickname, organization, roleId
            } = this.createForm;
            userApis.editUser({
              id, mobile, email, nickname, organization, roleId
            }).then((result) => {
              if (result.data) {
                this.$message({
                  type: 'success',
                  message: '更新成功'
                });
              }
              this.changeTablePage(1);
              this.messageDialogVisible = false;
            }).catch((err) => {
              console.log(err);
            });
          }
        } else {
          console.log('error submit!!');
          return false;
        }
        return true;
      });
    },
    cancelMessage() {
      this.messageDialogVisible = false;
    },
    changeStatus(value, id) {
      if (value === 0) {
        userApis.banUser({ id }).then((result) => {
          if (result.data) {
            this.getTableData();
            this.$message({
              type: 'success',
              message: '更新成功'
            });
          }
        }).catch((err) => {
          console.log(err);
        });
      } else if (value === 1) {
        userApis.activeUser({ id }).then((result) => {
          if (result.data) {
            this.getTableData();
            this.$message({
              type: 'success',
              message: '更新成功'
            });
          }
        }).catch((err) => {
          console.log(err);
        });
      }
    },
    confirmPopover(id) {
      userApis.deleteUser({ id }).then((result) => {
        if (result.data) {
          this.$message({
            type: 'success',
            message: '删除成功'
          });
        }
        this.closePopover(id);
        this.getTableData();
      }).catch((err) => {
        console.log(err);
      });
    },
    closePopover(id) {
      this.$refs[`popover-delete-${id}`].doClose();
    },
    toRoleManager() {
      this.$router.push({
        path: '/person-center/role-manager'
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import '~@/styles/variables.less';
.home-container {
  min-height: 100%;
  .main-container {
    .el-main {
      margin: 24px;
      background: #fff;
      box-shadow: 0px 0px 14px rgba(19, 38, 82, 0.08);
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
        .title {
          font-size: 22px;
          color: #1D2129;
        }
        .operation {
          .search-input {
            width: 300px;
            margin-right: 16px;
          }
        }
      }
      .table {
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 4px;
          position: relative;
          top: -3px;
          &.success {
            background-color: @success-color;
          }
          &.error {
            background-color: @danger-color;
          }
        }

        ::v-deep {
          .el-switch__core {
            width: 44px;
            height: 20px;
            border-radius: 100px;
            border: none;
          }
          .el-switch__core::after {
            width: 18px;
            height: 18px;
          }
        .el-switch.is-checked .el-switch__core::after {
          margin-left: -21px;
        }
        /*关闭时文字位置设置*/
        .el-switch__label--right {
          position: absolute;
          z-index: 1;
          right: 5px;
          margin-left: 0px;
          color: #fff;
          span {
            font-size: 12px;
          }
        }
        /* 激活时另一个文字消失 */
        .el-switch__label.is-active {
          display: none;
        }
        /*开启时文字位置设置*/
        .el-switch__label--left {
          position: absolute;
          z-index: 1;
          left: 5px;
          margin-right: 0px;
          color: #fff;
          span {
            font-size: 12px;
          }
        }

        }
        .text-button {
          cursor: pointer;
          color: @primary-color;
          margin-left: 8px;
          &.danger {
            color: @danger-color;
          }
        }
      }
      .el-pagination {
        text-align: right;
        padding: 16px 0;
      }
    }
  }
}
</style>
