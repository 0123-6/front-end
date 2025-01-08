<template>
  <!--最外层-->
  <div class="user-role w-full h-full flex flex-col px-5">
    <!--上-->
    <div class="w-full h-[66px] flex-shrink-0 flex justify-between items-center">
      <!--左-->
      <title-comp :type="2" title="角色权限列表" class="" />
      <!--右-->
      <el-button type="primary" class="more-width" @click="showAddRoleDialog = true">+ 新增角色</el-button>
    </div>
    <!--下-->
    <div class="w-full flex flex-col pl-5 py-5 rounded-2xl bg-white flex-shrink-0"
      style="height: calc(100% - 66px - 20px);">
      <el-scrollbar height="100%">
        <!--表格最外层-->
        <div class="w-full pr-5 flex flex-col">
          <!--上-->
          <div class="w-full flex justify-between items-center">
            <!--左-->
            <el-input type="text" placeholder="请输入关键词搜索" clearable v-model="keyword" @clear="changeKeyword"
              @keyup.enter.native="changeKeyword" style="width: 270px;" />
          </div>
          <!--表格-->
          <el-table :data="dataList" tooltip-effect="dark" style="width: 100%" class="mt-[15px]">
            <!--角色-->
            <el-table-column prop="name" label="角色" align="left" min-width="100" show-overflow-tooltip
              fixed="left"></el-table-column>
            <!--角色说明-->
            <el-table-column prop="description" label="角色说明" align="left" min-width="160" show-overflow-tooltip />
            <!--创建时间-->
            <el-table-column prop="createTime" label="创建时间" align="left" width="120" show-overflow-tooltip>
              <template #default="{ row }">
                <span v-if="row.createTime" class="ddin-n f16">{{ row.createTime.substr(0, 10) }}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <!--操作-->
            <el-table-column label="操作" align="left" width="210" fixed="right">
              <template #default="{ row }">
                <div class="flex items-center gap-x-3.5">
                  <button-text @click="handleView(row)">
                    <person-svg class="mr-1" />
                    <span class="text-sm leading-5 select-none">成员</span>
                  </button-text>
                  <button-text @click="handleEdit(row)">
                    <svg-icon class="el-icon--left" icon-class="edit" width="16px" height="16px" />
                    <span class="text-sm leading-5 select-none">编辑</span>
                  </button-text>
                  <button-text v-if="row.userNum === 0" color="red" @click="handleDelete(row)">
                    <delete-svg class="mr-1" />
                    <span class="text-sm leading-5 select-none">删除</span>
                  </button-text>
                  <el-tooltip v-if="!(row.userNum === 0)" popper-class="tooltip-76 tooltip-x-14 tooltip-y-6" effect="dark"
                    placement="top">
                    <template #content>
                      <div class="w-full flex items-center">
                        <span class="text-white text-xs leading-[22px]">该角色下有成员，不可删除。</span>
                      </div>
                    </template>
                    <button-text v-if="!(row.userNum === 0)" :disabled="true" color="red">
                      <delete-svg class="mr-1" />
                      <span class="text-sm leading-5 select-none">删除</span>
                    </button-text>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-pagination v-show="totalNum > 10" v-model:current-page="pageNum" v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]" background layout="total, sizes, prev, pager, next, jumper" :total="totalNum"
            @size-change="changeSize" @current-change="changeNum" />
        </div>
      </el-scrollbar>
    </div>
    <!--弹窗-->
    <!--新增角色-->
    <el-dialog v-model="showAddRoleDialog" append-to-body draggable align-center destroy-on-close
      :close-on-click-modal="false" :close-on-press-escape="false" class="change-password-dialog" title="新增角色"
      width="452px">
      <add-role-dialog v-loading="saveLoading" @on-ok="addRoleDialogOnOk" @on-cancel="addRoleDialogOnCancel" />
    </el-dialog>
    <!--编辑角色信息-->
    <el-dialog v-model="showEditRoleDialog" append-to-body draggable align-center destroy-on-close
      :close-on-click-modal="false" :close-on-press-escape="false" class="change-password-dialog" title="编辑角色信息"
      width="452px">
      <add-role-dialog v-loading="saveLoading" :info="singleSelection" @on-ok="editRoleDialogOnOk"
        @on-cancel="editRoleDialogOnCancel" />
    </el-dialog>
    <!--成员抽屉-->
    <el-drawer ref="drawer" v-model="showDetailDrawer" :title="`成员-${singleSelection.name}`"
      modal-class="setting-drawer text-sm" direction="rtl" :size="796" destroy-on-close :close-on-click-modal="false"
      :close-on-press-escape="false">
      <role-detail-drawer :info="singleSelection" />
    </el-drawer>
    <!--删除角色-->
    <prompt-dialog v-model:show="showDeleteRoleDialog" content="是否确认删除角色？" @on-ok="deleteRoleDialogOnOk"
      @on-cancel="deleteRoleDialogOnCancel" />
  </div>
</template>

<script>
import TitleComp from "@/views/index/components/TitleComp";
import mixinList from '@/utils/mixinList';
import PersonSvg from "@/views/user-manage/user-role/icon/PersonSvg";
import DeleteSvg from "@/views/user-manage/user-role/icon/DeleteSvg";
import AddRoleDialog from "@/views/user-manage/user-role/components/AddRoleDialog";
import RoleDetailDrawer from "@/views/user-manage/user-role/components/RoleDetailDrawer";
import PromptDialog from "@/views/user-manage/user-role/components/PromptDialog";
import ButtonText from "@/views/user-manage/user-role/components/ButtonText.vue";
import * as api from '@/api/admin/sysRole.js'

export default {
  name: "UserRole",
  mixins: [mixinList],
  components: {
    ButtonText,
    PromptDialog,
    DeleteSvg,
    PersonSvg,
    TitleComp,
    AddRoleDialog,
    RoleDetailDrawer,
  },
  data() {
    return {
      showAddRoleDialog: false,
      showEditRoleDialog: false,
      showDetailDrawer: false,
      showDeleteRoleDialog: false,
      pageSize: 10,
      pageNum: 1,
      dataList: [],
      saveLoading: false,
      singleSelection: {}
    };
  },
  methods: {
    handleView(row) {
      this.singleSelection = row;
      this.showDetailDrawer = true;
    },
    handleEdit(row) {
      this.singleSelection = row;
      this.showEditRoleDialog = true;
    },
    handleDelete(row) {
      this.singleSelection = row;
      this.showDeleteRoleDialog = true;
    },
    deleteRoleDialogOnOk() {
      api.sysRole_delete({ id: this.singleSelection.id }).then(({ success, message }) => {
        if (success) {
          this.showDeleteRoleDialog = false;
          this.$message.success('删除角色成功')
          this.current = 1;
          this.getData();
        } else {
          this.$message.error(message)
        }
      }).catch(() => {
      })
    },
    deleteRoleDialogOnCancel() {
      this.showDeleteRoleDialog = false;
    },
    // 搜索
    getData() {
      const params = {
        keyword: this.keyword,
        current: this.pageSize,
        size: this.pageNum
      };
      this.loading = true;
      api.sysRole_list(params).then(({ result }) => {
        const { records, total } = result
        this.dataList = records
        this.totalNum = total
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      })
    },
    addRoleDialogOnOk(params) {
      console.log('addRoleDialogOnOk');
      this.saveLoading = true
      api.sysRole_add(params).then(({ success, message }) => {
        if (success) {
          this.showAddRoleDialog = false;
          this.$message.success('新增角色成功')
          this.current = 1;
          this.getData();
        } else {
          this.$message.error(message)
        }
        this.saveLoading = false;
      }).catch(() => {
        this.saveLoading = false;
      })
    },
    addRoleDialogOnCancel() {
      console.log('addRoleDialogOnCancel');
      this.showAddRoleDialog = false;
    },
    editRoleDialogOnOk(params) {
      console.log('editRoleDialogOnOk');
      this.saveLoading = true
      api.sysRole_edit(params).then(({ success, message }) => {
        if (success) {
          this.showEditRoleDialog = false;
          this.$message.success('编辑角色成功')
          this.current = 1;
          this.getData();
        } else {
          this.$message.error(message)
        }
        this.saveLoading = false;
      }).catch(() => {
        this.saveLoading = false;
      })
    },
    editRoleDialogOnCancel() {
      console.log('editRoleDialogOnCancel');
      this.showEditRoleDialog = false;
    },
  },
}
</script>

<style lang="scss">
.user-role {
  .more-width.el-button {
    padding-left: 13px;
    padding-right: 13px;
  }

  .el-button+.el-button {
    margin-left: 0px;
  }
}
</style>
