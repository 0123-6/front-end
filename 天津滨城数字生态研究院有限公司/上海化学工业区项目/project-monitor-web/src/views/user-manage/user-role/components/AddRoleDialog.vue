<template>
  <!--最外层-->
  <div class="add-role-dialog w-full h-[592px] flex flex-col justify-between pr-8">
    <el-form :model="form" ref="form" :rules="rules" :inline="true" label-width="114px" label-suffix="：" class="mt-5">
      <!--角色名称-->
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入角色名称" auto-complete="off" style="width: 306px;"></el-input>
      </el-form-item>
      <!--角色说明,textarea-->
      <el-form-item label="角色说明" prop="description">
        <el-input type="textarea" v-model="form.description" placeholder="请输入角色说明" auto-complete="off"
          style="width: 306px;" maxlength="100" :autosize="{ minRows: 3 }" show-word-limit></el-input>
      </el-form-item>
      <!--基本权限，树结构-->
      <el-form-item label="基本权限" prop="authIds" class="label-26">
        <el-tree ref="tree" :data="permissionList" :props="defaultProps" node-key="id" :default-expand-all="true"
          :expand-on-click-node="false" :show-checkbox="true" :indent="16" style="width: 306px;"
          :default-checked-keys="form.authIds" @check-change="handleCheckChange"></el-tree>
      </el-form-item>
    </el-form>
    <!--底部按钮-->
    <div class="mb-6 flex justify-end items-center">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" style="margin-left: 8px;" @click="onOk">确定</el-button>
    </div>
  </div>
</template>

<script>
import { sysAuthority_getAll } from '@/api/admin/sysAuthority.js'
import { sysRole_queryById } from '@/api/admin/sysRole.js'
import { flat } from '@/utils/index.js'
export default {
  name: "AddRoleDialog",
  props: {
    info: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      form: {
        // 角色名称,支持例如汉字、字母，最多20个字符
        name: '',
        // 基本权限
        authIds: [],
        // 角色说明,非必填，100字符以内
        description: '',
      },
      // 表单验证规则
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { max: 20, message: '最多输入20个字符', trigger: 'blur' },
        ],
        authIds: [
          { required: true, message: '请选择基本权限', trigger: 'blur' },
        ],
        description: [
          { max: 100, message: '最多输入100个字符', trigger: 'blur' },
        ],
      },
      permissionList: [

      ],
      defaultProps: {
        children: 'children',
        label: 'name',
      },
    };
  },
  created() {
    this.getMenus()
    if (this.info) {
      this.form = JSON.parse(JSON.stringify(this.info));
      this.getDetail()
    } else {
      this.form = {
        authIds: ['1'],
      };
    }
  },
  methods: {
    getDetail() {
      sysRole_queryById({ id: this.info.id }).then(({ result }) => {
        this.$nextTick(() => {
          const list = flat(result.authList || [])
          const authIds = list.filter(n => n.type == 1).map(n => n.id)
          this.$refs.tree.setCheckedKeys(authIds)
          this.form.authIds = authIds
          console.log('authIds', authIds)
        })
      })
    },
    getMenus() {
      sysAuthority_getAll().then(({ result }) => {
        result[0].disabled = true
        this.permissionList = [{
          id: 0,
          name: '全选',
          children: result
        }]
      })
    },
    handleCheckChange() {
      const checkedNodes = this.$refs.tree.getCheckedNodes();
      this.form.authIds = checkedNodes.map(item => item.id);
    },
    onOk() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const { id = 0, name, description, authIds } = this.form
          const params = JSON.parse(JSON.stringify({
            id,
            authIds: authIds.filter(n => n != 0),
            description,
            name
          }));
          this.$emit('on-ok', params);
        }
      });
    },
    onCancel() {
      this.$emit('on-cancel');
    },
  },
};
</script>

<style lang="scss">
.add-role-dialog {
  .label-26 {
    .el-form-item__label {
      height: 26px;
      line-height: 26px;
    }
  }

  .el-tree-node {
    margin-bottom: 1px;
  }
}
</style>
