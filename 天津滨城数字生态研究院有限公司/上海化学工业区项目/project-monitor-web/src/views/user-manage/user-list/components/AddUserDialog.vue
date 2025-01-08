<template>
  <!--最外层-->
  <div class="add-user-dialog w-full h-[232px] flex flex-col pr-8">
    <el-form :model="form" ref="form" :rules="rules" label-width="88px" label-suffix="：" class="mt-5">
      <div class="w-full flex flex-col">
        <!--1-->
        <div class="flex justify-between items-center">
          <!--姓名-->
          <el-form-item class="flex-1" label="姓名" prop="realName">
            <el-input v-model="form.realName" placeholder="请输入姓名" auto-complete="off"></el-input>
          </el-form-item>
          <!--账号-->
          <el-form-item class="flex-1" label="账号" prop="userName">
            <div class="d-flex ai-center flex-1">
              <el-input class="flex-1" :disabled="info && !!info.id" v-model="form.userName" placeholder="请输入账号"
                auto-complete="off" @change="changeUserName"></el-input>
              <el-tooltip popper-class="milestone-tooltip" effect="dark" placement="top" trigger="hover"
                content="初始密码为：scip666">
                <el-icon class="ml8" color="#BABABA">
                  <InfoFilled />
                </el-icon>
              </el-tooltip>
            </div>
          </el-form-item>
        </div>
        <!--2-->
        <div class="flex justify-between items-center">
          <!--角色-->
          <el-form-item class="flex-1" label="角色" prop="roleId">
            <el-select v-model="form.roleId" placeholder="请选择角色" style="width: 100%;">
              <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <!--所属部门-->
          <el-form-item class="flex-1" label="所属部门" prop="deptId">
            <el-cascader ref="cascader" v-model="form.deptId" :props="cascaderProps" :options="departmentList"
              placeholder="请选择所属部门" clearable collapse-tags style="width: 100%;">
            </el-cascader>
          </el-form-item>
        </div>
        <!--3-->
        <div class="flex justify-between items-center">
          <!--手机号-->
          <el-form-item class="flex-1" label="手机号" prop="mobile">
            <el-input v-model="form.mobile" placeholder="请输入手机号" auto-complete="off"></el-input>
          </el-form-item>
          <!--邮箱-->
          <el-form-item class="flex-1" label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" auto-complete="off"></el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <!--底部按钮-->
    <div class="flex justify-end items-center">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" style="margin-left: 8px;" @click="onOk">确定</el-button>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "AddUserDialog",
  props: {
    info: {
      type: Object,
      required: false
    },
    repeat: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateUserName = (rule, value, callback) => {
      if (value && this.repeat) {
        callback(new Error('账号重复'))
      } else {
        callback()
      }
    }
    return {
      form: {
        // 账号
        userName: '',
        // 姓名
        realName: '',
        // 角色
        roleId: '',
        // 所属部门
        deptId: [],
        // 手机号
        mobile: '',
        // 邮箱
        email: '',
      },
      // 表单验证规则
      rules: {
        realName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { pattern: /^[a-zA-Z\u4e00-\u9fa5]{1,50}$/, message: '英文字母/中文，不超过50个字符', trigger: 'blur' },
        ],
        userName: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9_]{1,20}$/, message: '数字/中文/英文字母/下划线，不超过20个字符', trigger: 'blur' },
          { validator: validateUserName, trigger: 'blur' },
        ],
        roleId: [
          { required: true, message: '请选择角色', trigger: 'change' },
        ],
        deptId: [
          { required: true, message: '请选择所属部门', trigger: 'change' },
        ],
        mobile: [
          { required: false, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^(?:(?:\+|00)86)?1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' },
        ],
        email: [
          { required: false, message: '请输入邮箱', trigger: 'blur' },
          { pattern: /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/, message: '请输入正确的邮箱', trigger: 'blur' },
        ],
      },
      roleList: [],
      departmentList: [],
      cascaderProps: {
        multiple: false,
        value: 'id',
        label: 'name',
        emitPath: true,
        checkStrictly: false
      },
    };
  },
  watch: {
    repeat() {
      this.$refs.form.validateField('userName')
    }
  },
  created() {
    this.getRoleList();
    this.getOrganization();
    if (this.info) {
      this.form = JSON.parse(JSON.stringify(this.info));
    }
  },
  methods: {
    changeUserName() {
      this.$emit('changeUserName')
    },
    async getRoleList() {
      const { result } = await request({
        url: '/admin/sysRole/getAll',
        method: 'get',
      });
      this.roleList = result;
    },
    // 获取组织架构
    async getOrganization() {
      const { result } = await request({
        url: '/admin/sysDepartment/getAll',
        method: 'get',
      });
      for (let i = 0; i < result.length; i++) {
        result[i].label = result[i].name;
        result[i].children = result[i].children.map((item) => {
          item.label = item.name;
          return item;
        });
      }
      this.departmentList = result;
      if (this.info) {
        for (let i = 0; i < this.departmentList.length; i++) {
          if (this.departmentList[i]?.children && this.departmentList[i].children.length) {
            const index = this.departmentList[i].children.findIndex((item) => item.id == this.info.deptId);
            if (index > -1) {
              this.form.deptId = [this.departmentList[i].id, this.departmentList[i].children[index].id];
              break;
            }
          }
        }
      }
    },
    onOk() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.form));
          params.deptId = params.deptId[params.deptId.length - 1];
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
.add-user-dialog {
  .el-form--inline .el-form-item {
    margin-right: 0 !important;
  }
}
</style>
