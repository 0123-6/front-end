<template>
  <!--最外层-->
  <div class="user-list w-full h-full flex flex-col px-5">
    <!--上-->
    <div class="w-full h-[66px] flex-shrink-0 flex justify-between items-center">
      <!--左-->
      <title-comp :type="2" title="成员列表" class="" />
      <!--右-->
      <el-button type="primary" class="more-width" @click="showAddUserDialog = true">+ 新增成员</el-button>
    </div>
    <!--下-->
    <div class="w-full flex rounded-2xl bg-[#F6F6F6]" style="height: calc(100% - 66px - 20px);">
      <!--左-->
      <div v-loading="loading" element-loading-background="transparent" element-loading-spinner="none"
        class="w-[215px] h-full flex flex-col pl-5 py-5 flex-shrink-0" style="border-radius: 16px 0 0 16px;">
        <el-scrollbar height="100%">
          <span class="text-black text-sm font-medium">组织架构</span>
          <el-tree class="mr10" :data="data" ref="tree" node-key="id" @node-click="handleNodeClick"
            :highlight-current="true" :default-expand-all="true" :expand-on-click-node="false" :indent="20">
            <template #default="{ node, data }">
              <div class="d-flex ai-center flex-1" style="min-width: 0;">
                <div class="flex-1 ell" :title="data.name" style="min-width: 0;">{{ data.name }}</div>
                <div>（{{ data.num }}）</div>
              </div>
            </template>
          </el-tree>
        </el-scrollbar>
      </div>
      <!--右-->
      <div class="h-full flex flex-col pl-5 py-5 bg-white rounded-2xl flex-shrink-0" style="width: calc(100% - 215px);">
        <el-scrollbar height="100%">
          <!--表格最外层-->
          <div class="w-full pr-5 flex flex-col">
            <!--上-->
            <div class="w-full flex justify-between items-center">
              <!--左-->
              <el-input type="text" placeholder="请输入关键词搜索" clearable v-model="keyword" style="width: 270px;"
                @clear="changeKeyword" @keyup.enter.native="changeKeyword" />
              <!--右-->
              <el-dropdown popper-class="user-list" @command="handleCommand">
                <el-button class="is-light" type="primary">
                  批量操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="begin" :disabled="multipleSelection.length === 0">启用</el-dropdown-item>
                    <el-dropdown-item command="stop" :disabled="multipleSelection.length === 0">停用</el-dropdown-item>
                    <el-dropdown-item command="delete" :disabled="multipleSelection.length === 0">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <ee-checker class="mt12" :value="multipleSelection.length" @cancel="$refs.table.clearSelection()" />
            <!--表格-->
            <el-table ref="table" :data="list" tooltip-effect="dark" style="width: 100%" :row-class-name="rowClassName"
              @selection-change="selectionChange" class="mt-[15px]">
              <!--复选框，固定在左侧,请copilot补充代码-->
              <el-table-column type="selection" width="40" />
              <!--姓名，固定在左侧-->
              <el-table-column prop="realName" label="姓名" align="left" min-width="90" show-overflow-tooltip
                fixed="left" />
              <!--账号-->
              <el-table-column prop="userName" label="账号" align="left" min-width="110" show-overflow-tooltip />
              <!--手机号-->
              <el-table-column prop="mobile" label="手机号" align="left" min-width="110" show-overflow-tooltip>
                <template #default="{ row }">
                  <span class="ddin-n f16">{{ row.mobile || '-' }}</span>
                </template>
              </el-table-column>
              <!--邮箱-->
              <el-table-column prop="email" label="邮箱" align="left" min-width="160" show-overflow-tooltip>
                <template #default="{ row }">
                  <span class="ddin-n f16">{{ row.email || '-' }}</span>
                </template>
              </el-table-column>
              <!--角色-->
              <el-table-column prop="roleName" label="角色" align="left" min-width="100" show-overflow-tooltip />
              <!--用户状态-->
              <el-table-column prop="statusCode" label="用户状态" align="center" width="80">
                <template #default="{ row }">
                  <ee-tag v-if="row.statusCode == 0" type="primary" shape="round-rect">使用中</ee-tag>
                  <ee-tag v-else-if="row.statusCode == 1" type="info" shape="round-rect">已停用</ee-tag>
                </template>
              </el-table-column>
              <!--所属部门-->
              <el-table-column prop="deptName" label="所属部门" align="left" min-width="150" show-overflow-tooltip>
                <template #default="{ row }">
                  <span>{{ row.deptName }}</span>
                </template>
              </el-table-column>
              <!--创建时间-->
              <el-table-column prop="createTime" label="创建时间" align="left" width="100" show-overflow-tooltip>
                <template #default="{ row }">
                  <span class="ddin-n f16">{{ row.createTime.substr(0, 10) }}</span>
                </template>
              </el-table-column>
              <!--操作-->
              <el-table-column label="操作" align="center" width="80" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click="handleEdit(row)">
                    <svg-icon class="el-icon--left" icon-class="edit" width="16px" height="16px" />编辑
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--分页-->
            <el-pagination v-show="totalNum > 10" :current-page="current" :page-size="size"
              :page-sizes="[10, 20, 50, 100]" background layout="total, sizes, prev, pager, next, jumper"
              :total="totalNum" @size-change="changeSize" @current-change="changeNum" />
          </div>
        </el-scrollbar>
      </div>
    </div>
    <!--弹窗-->
    <!--新增成员-->
    <el-dialog v-model="showAddUserDialog" append-to-body draggable destroy-on-close :close-on-click-modal="false"
      :close-on-press-escape="false" class="change-password-dialog" title="新增成员" width="750px">
      <add-user-dialog :repeat="userNameRepeat" @changeUserName="userNameRepeat = false" @on-ok="addUserDialogOnOk"
        @on-cancel="addUserDialogOnCancel" />
    </el-dialog>
    <!--编辑成员信息-->
    <el-dialog v-model="showEditUserDialog" append-to-body draggable destroy-on-close :close-on-click-modal="false"
      :close-on-press-escape="false" class="change-password-dialog" title="编辑成员信息" width="750px">
      <add-user-dialog :info="singleSelection" @on-ok="editUserDialogOnOk" @on-cancel="editUserDialogOnCancel" />
    </el-dialog>
    <!--删除弹框-->
    <prompt-dialog v-model:show="showDeleteDialog" content="确认批量删除用户吗?" @on-ok="deleteDialogOnOk"
      @on-cancel="deleteDialogOnCancel" />
    <!--启用弹框-->
    <prompt-dialog v-model:show="showStartDialog" content="确认批量启用用户吗?" @on-ok="startDialogOnOk"
      @on-cancel="startDialogOnCancel" />
    <!--停用弹框-->
    <prompt-dialog v-model:show="showStopDialog" content="确认批量停用用户吗?" @on-ok="stopDialogOnOk"
      @on-cancel="stopDialogOnCancel" />
  </div>
</template>

<script>
import TitleComp from "@/views/index/components/TitleComp";
import AddUserDialog from "./components/AddUserDialog";
import mixinList from '@/utils/mixinList';
import request from "@/utils/request";
import PromptDialog from "@/views/user-manage/user-role/components/PromptDialog.vue";
import EeChecker from '@/components/EeChecker.vue'
export default {
  name: "UserList",
  mixins: [mixinList],
  components: {
    PromptDialog,
    TitleComp,
    AddUserDialog,
    EeChecker
  },
  data() {
    return {
      autoGetData: false,
      data: [],
      // 弹框
      // 展示新增成员弹框
      showAddUserDialog: false,
      // 展示编辑成员信息弹框
      showEditUserDialog: false,
      // 展示删除弹框
      showDeleteDialog: false,
      // 展示启用弹框
      showStartDialog: false,
      // 展示停用弹框
      showStopDialog: false,
      allList: [],
      filterDepartment: [],
      // 选中的组织架构
      selectedOrgItem: null,
      userNameRepeat: false
    };
  },
  created() {
    this.getOrganization();
  },
  methods: {
    rowClassName({ row }) {
      return this.multipleSelection.findIndex(n => row.id === n.id) > -1 ? 'is-checked' : ''
    },
    // 获取组织架构
    async getOrganization(setDefault = true) {
      const { result } = await request({
        url: '/admin/sysDepartment/getAll',
        method: 'get',
      });
      this.data = result;
      if (setDefault) {
        this.selectedOrgItem = result[0]
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(result[0].id);
        })
        this.getData()
      } else if (this.selectedOrgItem) {
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(this.selectedOrgItem.id);
        })
      }
    },
    handleNodeClick(data) {
      console.log(data);
      // data.label为类似'综合办公室 (12)'这种格式，取出括号前面的纯文字即可
      // const deptName = data.label.split(' ')[0];
      // if (deptName === '上海化学工业区管理委员会') {
      // 	this.filterDepartment = [];
      // } else {
      // 	this.filterDepartment = [deptName];
      // }
      if (this?.selectedOrgItem?.id === data.id) {
        this.selectedOrgItem = null;
        // 清空tree的选中状态
        this.$refs.tree.setCurrentKey(null);
      } else {
        this.selectedOrgItem = data;
      }
      this.current = 1;
      this.getData();
    },
    handleCommand(val) {
      if (val === 'begin') {
        this.showStartDialog = true;
      } else if (val === 'stop') {
        this.showStopDialog = true;
      } else if (val === 'delete') {
        this.showDeleteDialog = true;
      }
    },
    // 搜索
    async getFalseData() {
      this.loading = true;
      const allList = this.allList.filter((item) => {
        if (this.filterDepartment.length === 0) {
          return true;
        }
        return this.filterDepartment.includes(item.deptName);
      });
      // this.list为根据pageNum和pageSize分页后的数据，数据来源于this.allList,请在下面补充代码，根据this.allList和this.pageNum和this.pageSize计算this.list
      this.list = allList.slice((this.current - 1) * this.size, this.current * this.size);
      this.totalNum = allList.length;
      this.loading = false;
    },
    async getData() {
      const params = {
        keyword: this.keyword,
        current: this.current,
        size: this.size,
        deptId: this.selectedOrgItem ? this.selectedOrgItem.id : null,
      }
      this.loading = true;
      const { result } = await request({
        url: '/admin/sysUser/list',
        method: 'get',
        params,
      });
      console.log('result', result);
      this.list = result.userList;
      this.totalNum = result.total;
      this.loading = false;
    },
    // 添加用户ok
    async addUserDialogOnOk(params) {
      this.userNameRepeat = false
      try {
        await request({
          url: '/admin/sysUser/add',
          method: 'post',
          data: params,
        });
        this.$message.success('新增成员成功');
        this.showAddUserDialog = false;
        this.current = 1;
        this.getData();
        this.getOrganization(false)
      } catch (error) {
        this.userNameRepeat = error.message.indexOf('重复') > -1
      }
    },
    // 添加用户cancel
    addUserDialogOnCancel() {
      console.log('添加用户cancel')
      this.showAddUserDialog = false;
    },
    handleEdit(row) {
      console.log('row: ', row);
      this.singleSelection = row;
      this.showEditUserDialog = true;
    },
    // 编辑用户ok
    async editUserDialogOnOk(params) {
      const newParams = {
        id: params.id,
        realName: params.realName,
        userName: params.userName,
        roleId: params.roleId,
        deptId: params.deptId,
        mobile: params.mobile,
        email: params.email,
      }
      await request({
        url: '/admin/sysUser/edit',
        method: 'put',
        data: newParams,
      });
      this.$message.success('修改用户信息成功');
      this.showEditUserDialog = false;
      this.getData();
      this.getOrganization(false)
    },
    handleUserNameRepeat(message) {
      if (message.indexOf('重复') > -1) {

      }
    },
    // 编辑用户cancel
    editUserDialogOnCancel() {
      console.log('编辑用户cancel')
      this.showEditUserDialog = false;
    },
    async deleteDialogOnOk() {
      const params = {
        ids: this.multipleSelection.map((item) => item.id),
      };
      await request({
        url: '/admin/sysUser/deleteBatch',
        method: 'post',
        data: params,
      });
      this.$message.success('批量删除成功');
      this.showDeleteDialog = false;

      this.cancelSelection();
      this.current = 1;
      this.getData();
      this.getOrganization()
    },
    deleteDialogOnCancel() {
      this.showDeleteDialog = false;
    },
    // 启用弹框ok
    async startDialogOnOk() {
      const params = {
        ids: this.multipleSelection.map((item) => item.id),
      };
      await request({
        url: '/admin/sysUser/enableBatch',
        method: 'post',
        data: params,
      });
      this.$message.success('批量启用成功');
      this.showStartDialog = false;

      this.cancelSelection();
      this.current = 1;
      this.getData();
    },
    startDialogOnCancel() {
      this.showStartDialog = false;
    },
    // 停用弹框ok
    async stopDialogOnOk() {
      const params = {
        ids: this.multipleSelection.map((item) => item.id),
      };
      await request({
        url: '/admin/sysUser/disableBatch',
        method: 'post',
        data: params,
      });
      this.$message.success('批量停用成功');
      this.showStopDialog = false;

      this.cancelSelection();
      this.current = 1;
      this.getData();
    },
    stopDialogOnCancel() {
      this.showStopDialog = false;
    },
  },
};
</script>

<style lang="scss">
.user-list {
  .more-width.el-button {
    padding-left: 13px;
    padding-right: 13px;
  }

  .el-tree {
    margin-top: 12px;
    background: #F6F6F6;

    --el-tree-node-hover-bg-color: #fff;
    --el-tree-text-color: #1A262C;

    .el-tree-node__content {
      height: 36px;

      // 悬浮
      &:hover {
        font-size: 14px;
        border-radius: 16px 0 0 16px;
      }
    }

    .el-tree-node__children {
      .el-tree-node__content {
        margin-left: 20px;
      }
    }

    .el-tree-node.is-current>.el-tree-node__content {
      color: #02ADEC;
      font-size: 14px;
      font-weight: 500;
      background: white;
      border-radius: 16px 0 0 16px;
    }

    .el-tree-node__expand-icon.is-leaf {
      display: none;
    }
  }

  .el-dropdown-menu__item {
    width: 97px;
  }

  .el-tag.tag-primary {
    background-color: rgba(2, 173, 236, 0.1);
  }
}
</style>
