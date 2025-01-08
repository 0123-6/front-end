<template>
  <el-dialog
    v-dialogDrag
    :title="type"
    visible
    :width="'740px'"
    :top="'100px'"
    :custom-class="'dialog'"
    :close-on-click-modal="false"
    append-to-body
    :before-close="cancel"
  >
    <div class="role-text" style="width: 100%;" :class="{'isWatch': type==='查看'}">
      <el-form
        ref="form"
        label-width="120px"
        style="width: 100%;"
        class="margin-top-20"
        :rules="rules"
        :model="per"
      >
        <!-- 角色 -->
        <el-form-item prop="roleName" style="width: 590px;font-weight: 400;margin-left:75px;" label-suffix=":">
          <span slot="label"><span style="font-weight: 400;">角色名称：</span></span>
          <el-input v-if="type==='创建'" v-model="per.roleName" placeholder="请输入角色名称" prop="roleName" />
          <span v-else-if="type==='查看'">{{ person.roleName }}</span>
          <el-input v-else v-model="per.roleName" placeholder="请输入角色名称" prop="roleName" />
        </el-form-item>
        <!-- 描述 -->
        <el-form-item prop="remark" style="width: 590px;font-weight: 400;margin-left:75px;">
          <span slot="label"><span style="font-weight: 400;">角色描述：</span></span>
          <el-input
            v-if="type==='创建'"
            v-model="per.remark"
            resize="none"
            type="textarea"
            :rows="4"
            placeholder="请输入描述信息"
            prop="remark"
          />
          <span v-else-if="type==='查看'">{{ person.remark }}</span>
          <el-input
            v-else
            v-model="per.remark"
            style="display:inline-block;border-radius:5px;"
            resize="none"
            type="textarea"
            :rows="4"
            prop="remark"
          />
        </el-form-item>
        <el-form-item prop="menuIds" style="width: 590px;font-weight: 400;margin-left:75px;">
          <span slot="label"><span style="font-weight: 400;">功能权限：</span></span>
          <!-- 展开和全选按钮 -->
          <span>
            <el-checkbox v-model="checkedPush" @change="expandAll">展开/折叠</el-checkbox>
            <el-checkbox v-if="type!=='查看'" v-model="checkedAll" @change="chooseAll">全选/全不选</el-checkbox>
          </span>
          <!-- 树形控件 -->
          <div
            v-loading="loading"
            class="flex flex-direction"
          >
            <el-tree
              ref="tree"
              style="overflow:auto; height: 300px"
              :data="type==='查看'?data:data"
              show-checkbox
              node-key="menuId"
              :props="defaultProps"
              @check="getChange"
            />
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="type!=='查看'" slot="footer" class="dialog-footer">
      <el-button class="white-btn" @click="cancel">取 消</el-button>
      <el-button class="blue-btn" @click="ok">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getRoleManagementTree, getRoleIdTree } from '@/api/role-management';
export default {
  name: 'Normal',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    person: {
      type: Object
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    const validateMenuIds = (rule, value, callback) => {
      this.per.menuIds = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys());
      if (this.per.menuIds.length === 0) {
        callback(new Error('功能权限不能为空'));
      } else {
        callback();
      }
    };
    return {
      per: {
        roleName: '',
        remark: '',
        menuIds: [],
        loading: false
      },
      data: [],
      formData: {},
      rules: {
        roleName: [{ required: true, message: '角色名称不能为空', trigger: ['blur', 'change'] }],
        remark: [{ required: true, message: '角色描述不能为空', trigger: ['blur', 'change'] }],
        menuIds: [{ validator: validateMenuIds, trigger: 'change', required: true }]
      },
      defaultProps: {
        children: 'children',
        label: 'menuName'
      },
      checkedPush: false,
      checkedAll: false,
      defaultChecked: []
    };
  },
  created() {
    if (this.type !== '创建') {
      this.getTreeMessage();// 获取到的树数据和结构
    } else this.getTree();// 获取树结构

    // console.log('传过来的person',this.person,'this.type',this.type);
    if (this.type === '编辑') {
      this.per = JSON.parse(JSON.stringify(this.person));
    }
  },
  methods: {
    // 勾选时的点击事件
    getChange(checkedNode, checkedData) {
      // console.log('getChange', checkedNode, checkedData.checkedKeys);
      // 审核管理勾选的同时，上线管理也被勾选了（产品要求的）
      if (checkedNode.menuId === 11) {
        if (!this.$refs.tree.getCheckedKeys().includes(11)) {
          return;
        } else {
          this.$refs.tree.setChecked(12, true);
        }
      }
      this.per.menuIds = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys());
      this.defaultChecked = checkedData.checkedKeys;
    },
    getTreeMessage() {
      // 获取树的数据
      this.loading = true;
      getRoleIdTree(this.person.roleId).then((res) => {
        const arr = res.data.checkedKeys;
        this.data = res.data.menus;
        arr.forEach(e => {
          this.defaultChecked.push(e);
          this.$nextTick(() => {
            this.$refs.tree.setChecked(e, true);
          });
        });
        this.per.menuIds = this.defaultChecked;
        // 这里是树形控件在查看的时候变为不可选的状态
        if (this.type === '查看') { this.makeDisabled(this.data); }
        this.loading = false;
      });
    },
    // 变为不可选的状态方法
    makeDisabled(val) {
      val.forEach((item) => {
        item['disabled'] = true;
        if (item.hasOwnProperty('children')) {
          this.makeDisabled(item['children']);
        }
      });
    },
    // 只获取树的结构
    getTree() {
      this.loading = true;
      getRoleManagementTree().then(res => {
        this.data = res.data;
        this.loading = false;
      });
    },
    ok() {
      // 如果名称和描述为空，则不进行操作
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.per.menuIds.length === 0) {
            return false;
          } else this.$emit('ok', this.per, this.defaultChecked);
        } else {
          return false;
        }
      });
    },
    cancel() {
      this.$emit('cancel', this.person);
    },
    // 全部选中
    chooseAll() {
      this.roleList = '';
      // 判断按钮的状态
      if (this.checkedAll) {
        // 设置
        this.$refs.tree.setCheckedNodes(this.data);
        for (let i = 0; i < this.$refs.tree.getCheckedNodes().length; i++) {
          this.roleList += this.$refs.tree.getCheckedNodes()[i].id + ',';
        }
        this.roleList = this.roleList.slice(0, this.roleList.length - 1);
      } else {
        this.$refs.tree.setCheckedNodes([]);
        this.roleList = '';
      }
      this.per.menuIds = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys());
    },
    // 全部展开
    expandAll() {
      if (this.checkedPush) {
        for (const i in this.$refs.tree.store.nodesMap) {
          this.$refs.tree.store.nodesMap[i].expanded = true;
        }
      } else {
        for (const j in this.$refs.tree.store.nodesMap) {
          this.$refs.tree.store.nodesMap[j].expanded = false;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.el-tree{
  width: 100%;
  border: 1px solid rgba(207,213,222,1);
  border-radius: 4px;
}

::v-deep {
  .dialog {
    border-radius: 4px;
    .el-dialog__header {
      height: 40px;
      line-height: 40px;
      padding: 0 24px;
      border-bottom: 1px solid rgba(242,242,242,1);
      .el-dialog__title {
        font-family: SourceHanSansSC-Bold;
        font-size: 14px;
        color: #262626;
        letter-spacing: 0;
        line-height: 1px;
        font-weight: 700;
      }
    }
    .el-dialog__body {
      padding: 0;
    }
    .el-dialog__footer {
      padding-bottom: 24px;
    }
    .isWatch {
      &.role-text {
        padding-bottom: 24px;
      }
      .el-form-item {
        margin-bottom: 0px;
      }
    }
    .el-checkbox {
      font-weight: 400;
    }
  }
  .role-text{
    .el-textarea__inner{
      border-radius:4px !important;
    }
  }
  .el-form-item__label {
    font-weight: 400;
  }
}

</style>
