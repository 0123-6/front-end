<script>
/*eslint-disable*/
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import { createRoleData, deleteRoleData, getRoleDetailData, getRoleListData, updateRoleData } from '@/api/role-manage';

export default defineComponent({
  name: 'RoleList',
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      name: '',
      tableData: [],
      dialogRoleVisible: false,
      dialogRoleTitle: '',
      RoleForm: {
        name: '',
        description: '',
        menuIds: []
      },
      RoleRules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      treeProps: {
        label: 'menuName',
        children: 'children'
      },
      checkKeyCodes: []
    };
  },
  computed: {
    ...mapGetters(['MENU_TREE', 'USER_INFO'])
  },
  mounted() {
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
      this.getRoleList();
    },
    // 分页
    changePage(val) {
      this.currentPage = val;
      this.getRoleList();
    },
    // 获取角色列表
    getRoleList() {
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        name: this.name
      };
      getRoleListData(params).then((res) => {
        this.tableData = res.data.list;
        this.total = res.data.total;
      });
    },
    // 重置
    reset() {
      this.name = '';
      this.getRoleList();
    },
    // 编辑角色
    editRole(row) {
      this.getRoleDetail(row);
      this.dialogRoleVisible = true;
      this.dialogRoleTitle = '编辑角色';
    },
    // 创建角色
    createRole() {
      this.dialogRoleVisible = true;
      this.handleInitRuleData();
      this.dialogRoleTitle = '创建角色';
    },
    // 获取角色详情
    getRoleDetail(row) {
      getRoleDetailData({ roleId: row.id }).then((res) => {
        this.RoleForm = res.data;
        this.checkKeyCodes = res.data.permission.checked;
      });
    },
    // 初始化数据
    handleInitRuleData() {
      this.RoleForm = {
        name: '',
        description: '',
        menuIds: []
      };
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedKeys([]);
      }
      if (this.$refs.RoleForm) {
        this.$refs.RoleForm.resetFields();
      }
    },
    // 确定
    dialogRoleConfirm() {
      this.$refs.RoleForm.validate((valid) => {
        if (valid) {
          this.RoleForm.menuIds = this.$refs.tree.getCheckedKeys();
          if (this.dialogRoleTitle === '创建角色') {
            createRoleData(this.RoleForm).then((res) => {
              if (res.code === '00000') {
                this.$message({
                  type: 'success',
                  message: '创建成功!'
                });
                this.dialogRoleVisible = false;
                this.getRoleList();
              }
            });
          } else {
            updateRoleData(this.RoleForm).then((res) => {
              if (res.code === '00000') {
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                this.dialogRoleVisible = false;
                this.getRoleList();
              }
            });
          }
        }
      });
    },
    // 删除角色
    deleteRole(row) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteRoleData({ id: row.id }).then((res) => {
            if (res.code === '00000') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getRoleList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    }
  }
});
</script>

<template>
  <div class="role-container">
    <div class="role-search" style="margin-top: 24px">
      <span>角色名称：</span>
      <el-input type="text" v-model="name" placeholder="请输入角色名称" />
      <el-button type="primary" plain @click="reset">重置</el-button>
      <el-button type="primary" @click="getRoleList()">搜索</el-button>
    </div>
    <div class="role-table">
      <div class="role-btn">
        <div>角色列表</div>
        <el-button type="primary" icon="el-icon-plus" @click="createRole">创建角色</el-button>
      </div>
      <el-table :data="tableData" stripe style="margin: 0 24px; width: auto">
        <el-table-column label="序号" type="index" width="80" :index="indexMethod" />
        <el-table-column prop="name" label="角色" min-width="180"></el-table-column>
        <el-table-column prop="description" label="角色描述" min-width="180"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="180"></el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="editRole(scope.row)">编辑</el-button>
            <el-button type="text" @click="deleteRole(scope.row)" style="color: #ff4d4f">删除</el-button>
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
    <el-dialog :title="dialogRoleTitle" :visible.sync="dialogRoleVisible" :close-on-click-modal="false">
      <el-form ref="RoleForm" :model="RoleForm" :rules="RoleRules">
        <el-form-item class="half-item" label="角色名称" label-width="120px" prop="name">
          <el-input v-model="RoleForm.name" autocomplete="off" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item class="half-item" label="角色描述" label-width="120px">
          <el-input v-model="RoleForm.description" placeholder="请输入角色描述"> </el-input>
        </el-form-item>
        <el-form-item label="权限设置" label-width="120px">
          <el-tree
            ref="tree"
            :data="MENU_TREE"
            :props="treeProps"
            :default-checked-keys="checkKeyCodes"
            show-checkbox
            node-key="id"
            :render-after-expand="false">
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogRoleConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.role-container {
  .role-search {
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
      width: 200px;
      margin-right: 10px;
    }
  }
  .role-table {
    margin: 10px 24px 24px;
    padding-bottom: 24px;
    border-radius: 4px;
    background: #fff;
    box-shadow: 0 0 16px 0 rgba(20, 38, 82, 0.07);

    .role-btn {
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
  .half-item {
    display: inline-block;
    width: 50%;
  }
  .role-limit {
    > div {
      border: 1px solid #ccc;
      border-bottom: 0;
      &:last-child {
        border-bottom: 1px solid #ccc;
      }
      > span {
        display: inline-block;
        width: calc(50% - 20px);
        padding: 10px;
      }
      .el-checkbox {
        display: inline-block;
        width: calc(50% - 40px);
        ::v-deep .el-checkbox__label {
          width: 90%;
          text-align: start;
        }
      }
    }
  }
}
</style>
