<template>
  <div class="home-container">
    <div class="main-container">
      <el-container>
        <el-main>
          <div class="header">
            <div class="title">角色列表</div>
            <div class="operation">
              <el-input placeholder="请输入角色名称" v-model="searchWord" clearable @clear="searchTable" class="search-input">
                <el-button slot="append" icon="el-icon-search" @click="searchTable"></el-button>
              </el-input>
              <el-button class="primary" @click="openDialog('create')">创建角色</el-button>
            </div>
          </div>
          <div class="table">
            <el-table :data="tableData" stripe border>
              <el-table-column label="序号" type="index" :index="indexMethod" width="80" align="center" />
              <el-table-column show-overflow-tooltip label="角色" prop="name" min-width="60" align="center" />
              <el-table-column show-overflow-tooltip label="角色描述" prop="description" min-width="80" align="center" />
              <el-table-column show-overflow-tooltip label="创建时间" prop="createTime" min-width="80" align="center" />
              <el-table-column show-overflow-tooltip label="操作" min-width="80" align="center">
                <template slot-scope="scope">
                  <span class="text-button" @click="handleLimitDialog(scope.row.id)">权限设置</span>
                  <template v-if="scope.row.code !== 'admin'">
                    <span class="text-button" @click="getRoleDetail(scope.row.id)">编辑</span>
                    <el-popover placement="top" width="240" :ref="'popover-delete-' + scope.row.id">
                      <p><i class="el-icon-warning" style="color: #f8aa50; margin: 8px"></i>确定要删除该角色吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" @click="closePopover(scope.row.id)">取消</el-button>
                        <el-button class="primary" size="mini" @click="confirmPopover(scope.row.id)">确定</el-button>
                      </div>
                      <span class="text-button danger" slot="reference">删除</span>
                    </el-popover>
                  </template>
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
    <MessageDialog v-if="messageDialogVisible" :title="messageDialogTitle" :width="400" @save="saveMessage" @cancel="cancelMessage">
      <template slot="content">
        <el-form ref="createFormEL" :model="createForm" label-width="100px" :rules="rules">
          <el-form-item label="角色名称：" prop="name">
            <el-input v-model="createForm.name" placeholder="请输入角色名称"></el-input>
          </el-form-item>
          <el-form-item label="角色描述：" prop="description">
            <el-input v-model="createForm.description" placeholder="请输入角色描述"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </MessageDialog>

    <el-dialog title="添加/修改权限" :visible.sync="dialogVisible" :close-on-click-modal="false" width="50%">
      <div class="limit">
        <div class="left">
          <el-tree
            ref="tree"
            :data="metaMenu"
            :props="treeProps"
            :default-checked-keys="checkedTreeData"
            show-checkbox
            node-key="id"
            :render-after-expand="false"
            @check="handleCheck">
          </el-tree>
        </div>
        <div class="right">
          <el-form ref="limitForm" :model="limitForm" label-width="100px">
            <div v-for="item of metaMenu" :key="item.id">
              <div v-for="childItem of item.children" :key="childItem.id">
                <div v-if="!(!childItem.allowsDataRange || !childItem.relationType === 'none') && childItem.checked">
                  <IconTitle :title="childItem.menuName"></IconTitle>
                  <el-form-item
                    v-if="childItem.allowsDataRange"
                    label="数据范围："
                    placeholder="请选择"
                    :prop="childItem.perms"
                    :field="childItem.perms"
                    :rules="[{ required: true, message: '请选择数据范围' }]">
                    <MultipleRegionCascader
                      v-if="childItem.perms !== 'cyzhdb'"
                      style="width: 100%"
                      :props="regionTreeProps"
                      :regionOptions="childItem.data ? childItem.data.regionTree : []"
                      v-model="limitForm[childItem.perms]"
                      @getCurrentKey="(value) => getCurrentKey(value, childItem.perms)">
                    </MultipleRegionCascader>
                    <MultipleRegionCascader
                      v-else
                      style="width: 100%"
                      :regionOptions="allAreaCode"
                      v-model="limitForm[childItem.perms]"
                      @getCurrentKey="(value) => getCurrentKey(value, childItem.perms)">
                    </MultipleRegionCascader>
                  </el-form-item>
                  <el-form-item
                    v-if="childItem.relationType === 'index'"
                    label="其它："
                    :prop="childItem.perms + 'index'"
                    :field="childItem.perms + 'index'"
                    :rules="[{ required: true, message: '请选择指标' }]">
                    <el-select multiple v-model="limitForm[childItem.perms + 'index']" placeholder="请选择">
                      <el-option
                        v-for="indexItem in childItem.data ? childItem.data.indexes : []"
                        :key="indexItem.id"
                        :label="indexItem.name"
                        :value="indexItem.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    v-if="childItem.relationType === 'chain'"
                    label="产业链："
                    :prop="childItem.perms + 'chain'"
                    :field="childItem.perms + 'chain'"
                    :rules="[{ required: true, message: '请选择产业链' }]">
                    <el-tree
                      :ref="childItem['perms'] + 'chain'"
                      :data="childItem.data ? childItem.data.chains : []"
                      :props="chainTreeProps"
                      :default-checked-keys="limitForm[childItem.perms + 'chain']"
                      show-checkbox
                      node-key="id"
                      :render-after-expand="false"
                      @check-change="handleCheckChange($event, childItem.perms)">
                    </el-tree>
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitLimitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { roleApis } from '@/api/role-manager';
import MessageDialog from '@/components/MessageDialog';
import MultipleRegionCascader from '@/components/MultipleRegionLimitCascader/index.vue';
import IconTitle from '@/components/IconTitle/index.vue';
import { commonApis } from '@/api/common';

export default {
  name: 'RoleManager',
  data() {
    return {
      searchWord: '',
      tableData: [],
      tableListTotal: 0,
      currentPage: 1,
      createForm: {
        id: '',
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      messageDialogVisible: false,
      messageDialogType: '',
      messageDialogTitle: '',
      dialogVisible: false,
      metaMenu: [],
      metaMenuDict: new Map(),
      dataScopeDict: new Map(),
      allAreaCode: [],
      treeProps: {
        label: 'menuName',
        children: 'children'
      },
      regionTreeProps: {
        label: 'label',
        children: 'children'
      },
      chainTreeProps: {
        label: 'name',
        children: 'children'
      },
      limitForm: {},
      limitShowForm: {},
      tenantForm: {},
      checkedTreeData: [],
      checkedMenuList: [],
      checkedMenuMap: new Map(),
      checkedRegionMap: new Map(),
      checkedOtherMap: new Map()
    };
  },
  components: {
    MessageDialog,
    IconTitle,
    MultipleRegionCascader
  },
  computed: {
    ...mapGetters([])
  },
  mounted() {
    this.searchTable();
    this.metaMenu = JSON.parse(localStorage.getItem('iep_platform_menu_meta')).menu;
    this.getMenuDataScopeData();
    this.handleMetaMenuDict(this.metaMenu);
    this.getRegionData(this.metaMenu[0]);
    this.getAllRegions();
  },
  methods: {
    getMenuDataScopeData() {
      commonApis.getMenuDataScopeData().then((res) => {
        if (res.code === '00000') {
          this.handleDataScopeDict(res.data);
        }
      });
    },
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
        name: this.searchWord,
        pageSize: 10,
        pageNum: this.currentPage
      };
      roleApis
        .roleTable(params)
        .then((result) => {
          this.tableData = result.data.list;
          this.tableListTotal = result.data.total;
          if (this.tableListTotal > 0 && result.data.list.length === 0 && this.currentPage > 1) {
            this.currentPage -= 1;
            this.getTableData();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getRoleDetail(id) {
      roleApis
        .roleDetail({ roleId: id })
        .then((result) => {
          this.createForm.id = id;
          this.createForm.name = result.data.name;
          this.createForm.description = result.data.description;
          this.openDialog('edit');
        })
        .catch((err) => {
          console.log(err);
        });
    },
    openDialog(type) {
      this.messageDialogType = type;
      if (type === 'create') {
        this.messageDialogTitle = '创建角色';
        this.messageDialogVisible = true;
        this.createForm.id = '';
        this.createForm.name = '';
        this.createForm.description = '';
      } else if (type === 'edit') {
        this.messageDialogTitle = '编辑角色';
        this.messageDialogVisible = true;
      }
    },
    saveMessage() {
      this.$refs.createFormEL.validate((valid) => {
        if (valid) {
          if (this.messageDialogType === 'create') {
            const { name, description } = this.createForm;
            roleApis
              .createRole({
                name,
                description
              })
              .then((result) => {
                if (result.data) {
                  this.$message({
                    type: 'success',
                    message: '创建成功'
                  });
                }
                this.changeTablePage(1);
                this.messageDialogVisible = false;
              })
              .catch((err) => {
                console.log(err);
              });
          } else if (this.messageDialogType === 'edit') {
            const { id, name, description } = this.createForm;
            roleApis
              .editRole({
                id,
                name,
                description
              })
              .then((result) => {
                if (result.data) {
                  this.$message({
                    type: 'success',
                    message: '更新成功'
                  });
                }
                this.changeTablePage(1);
                this.messageDialogVisible = false;
              })
              .catch((err) => {
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
    confirmPopover(id) {
      roleApis
        .deleteRole({ id })
        .then((result) => {
          if (result.data) {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
          }
          this.closePopover(id);
          this.getTableData();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    closePopover(id) {
      this.$refs[`popover-delete-${id}`].doClose();
    },

    handleLimitDialog(id) {
      this.tenantForm.roleId = id;
      this.getRolePermission(id);
      this.dialogVisible = true;
    },
    getAllRegions() {
      roleApis
        .getAllRegionsData()
        .then((result) => {
          this.allAreaCode = result.data;
          this.allAreaCode[0].children = undefined;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getRolePermission(id) {
      roleApis
        .getRolePermissionData({ id })
        .then((result) => {
          this.checkedMenuMap = new Map(result.data.checkedMenu?.map((item) => [item, item]));
          this.checkedRegionMap = new Map(result.data.checkedRegion?.map((item) => [item.menuId, item.regionCode]));
          this.checkedOtherMap = new Map(result.data.checkedOther?.map((item) => [item.menuId, item.otherId]));
          this.handleLimitModuleData(this.metaMenu);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleMetaMenuDict(data) {
      data.forEach((item) => {
        if (item.children && item.children.length > 0) {
          this.metaMenuDict.set(item.perms, item);
          this.handleMetaMenuDict(item.children);
        } else {
          this.metaMenuDict.set(item.perms, item);
        }
      });
    },
    handleDataScopeDict(sourceData) {
      sourceData.forEach((item) => {
        const data = {};
        if (item.regionTree) {
          data.regionTree = item.regionTree;
          this.handleCityData(data.regionTree);
        }
        if (item.chains) {
          data.chains = item.chains;
        }
        if (item.indexs) {
          data.indexs = item.indexs;
        }
        this.dataScopeDict.set(item.menuId, data);
      });
    },
    handleCityData(data) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < data.length; i++) {
        if (data[i].children && data[i].children.length > 0) {
          this.handleCityData(data[i].children);
        } else {
          // eslint-disable-next-line no-param-reassign
          data[i].children = undefined;
        }
      }
    },
    getRegionData(node) {
      if (node.children && node.children.length > 0) {
        node.children.forEach((item) => {
          this.getRegionData(item);
        });
        if (this.dataScopeDict.has(node.id)) {
          this.$set(node, 'data', this.dataScopeDict.get(node.id));
        }
      } else if (this.dataScopeDict.has(node.id)) {
        this.$set(node, 'data', this.dataScopeDict.get(node.id));
      }
    },
    handleLimitModuleData(data) {
      data.forEach((item) => {
        if (this.checkedMenuMap.has(item.id)) {
          if (item.children && item.children.length > 0) {
            item.children.forEach((child) => {
              this.$set(child, 'checked', false);
              if (this.checkedMenuMap.has(child.id)) {
                this.$set(child, 'checked', true);
                // 最终的数据项
                const finalItem = {};
                finalItem.id = child.id;
                // 添加数据范围
                if (child.allowsDataRange && this.checkedRegionMap.has(child.id)) {
                  this.limitForm[child.perms] = this.checkedRegionMap.get(child.id);
                }
                // 添加其他
                if (child.relationType === 'index' && this.checkedOtherMap.has(child.id)) {
                  this.limitForm[`${child.perms}index`] = this.checkedOtherMap.get(child.id);
                } else if (child.relationType === 'chain' && this.checkedOtherMap.has(child.id)) {
                  this.limitForm[`${child.perms}chain`] = this.checkedOtherMap.get(child.id).map((other) => other);
                }

                this.checkedMenuList.push(finalItem);
              }
            });
          } else {
            this.checkedMenuList.push({
              id: item.id
            });
          }
        }
      });
      this.checkedTreeData = this.checkedMenuList.map((item) => item.id);
      console.log(this.checkedTreeData, 'this.checkedMenu', this.checkedMenuList);
    },
    handleCheck(node, check) {
      let checkedMenu = [];
      checkedMenu = [...check.checkedKeys];
      if (check.halfCheckedKeys.length > 0) {
        checkedMenu.push(...check.halfCheckedKeys);
      }
      this.checkedTreeData = [...check.checkedKeys];
      const checkedMenuMap = new Map(checkedMenu.map((item) => [item, item]));
      this.metaMenu.forEach((item) => {
        item.children.forEach((child) => {
          this.$set(child, 'checked', false);
          if (checkedMenuMap.has(child.id)) {
            this.$set(child, 'checked', true);
          }
        });
      });
      this.getRegionData(node);
    },
    submitLimitForm() {
      this.$refs.limitForm.validate((valid) => {
        if (valid) {
          const reginCodes = [];
          const otherIds = [];
          const menuIds = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys());
          this.metaMenuDict.forEach((value, key) => {
            // if (this.limitForm[key]) {
            //   reginCodes.push({
            //     menuId: value.id,
            //     regionCode: this.limitForm[key]
            //   });
            // }

            if (this.limitShowForm[key]?.length > 0) {
              reginCodes.push({
                menuId: value.id,
                regionCode: this.limitShowForm[key]
              });
              // 修改表格的数据
            }
          });
          this.metaMenuDict.forEach((value, key) => {
            if (this.limitForm[`${key}index`]) {
              otherIds.push({
                menuId: value.id,
                otherId: this.limitForm[`${key}index`]
              });
            }
            if (this.$refs[`${key}chain`] && this.$refs[`${key}chain`].length > 0) {
              otherIds.push({
                menuId: value.id,
                otherId: this.$refs[`${key}chain`][0].getCheckedKeys()?.map((item) => Number(item))
              });
            }
          });
          this.tenantForm.menuIds = menuIds;
          this.tenantForm.reginCodes = reginCodes;
          this.tenantForm.otherIds = otherIds;
          roleApis
            .editRolePermission(this.tenantForm)
            .then((result) => {
              if (result.data) {
                this.$message({
                  type: 'success',
                  message: '更新成功'
                });
              }
              this.changeTablePage(1);
              this.dialogVisible = false;
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    },
    handleCheckChange(checkedKeys, item) {
      if (this.$refs[`${item}chain`][0].getCheckedKeys().length > 0) {
        // 启动校验
        this.$set(this.limitForm, `${item}chain`, '1');
      } else {
        // 关闭校验
        this.$set(this.limitForm, `${item}chain`, undefined);
      }
    },
    getCurrentKey(path, value) {
      this.limitShowForm[value] = [];
      path.forEach((item) => {
        this.limitShowForm[value].push({
          regionNode: item,
          regionLevel: item[0] === 'china' ? item.length - 1 : item.length
        });
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
          color: #1d2129;
        }
        .operation {
          .search-input {
            width: 300px;
            margin-right: 16px;
          }
        }
      }
      .table {
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

  .limit {
    display: flex;
    .left {
      width: 30%;
      height: 500px;
      border-right: 1px solid #ebe9f1;
      .el-tree {
        height: 100%;
        overflow: auto;
      }
    }
    .right {
      width: 70%;
      height: 500px;
      overflow: auto;
      padding: 16px 24px;
      .el-select {
        width: 100%;
      }
    }
  }
}
</style>
