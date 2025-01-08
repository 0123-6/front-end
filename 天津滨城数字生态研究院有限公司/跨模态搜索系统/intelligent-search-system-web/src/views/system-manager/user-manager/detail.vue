<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-11-14 15:38:43
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-11-22 17:40:13
 * @FilePath: \intelligent-search-system-web\src\views\system-manager\user-manager\detail.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="user-detail-container">
    <div class="user-detail-header">
      <label>查看</label>
      <div class="buttons-container">
        <el-button class="back" type="text" @click="goBack" icon="el-icon-caret-left">返回</el-button>
      </div>
    </div>
    <!--头像模块-->
    <div class="user-detail-avatar">
      <el-upload
        disabled
        class="avatar-uploader"
        :action="''"
        :http-request="uploadSectionFile"
        :before-upload="beforeUpload"
        :show-file-list="false"
        accept=".jpg,.jpeg,.png,.bmp"
      >
        <div class="camera-tip">
          <svg-icon class-name="camera-icon" icon-class="camera"/>
        </div>
        <div style="width: 62px;height: 62px;border-radius: 1000px;background: #D0DADD;overflow: hidden;
             border: 2px solid rgb(236, 236, 236);">
          <img v-if="ruleForm?.avatar" :src="ruleForm.avatar" style="width: 100%;height: 100%;"/>
          <img v-else src="/img/person.svg" alt="" style="width: 100%;height: 100%;">
        </div>
      </el-upload>
      <!--右-->
      <span class="ml-4">{{ ruleForm.nickName }}</span>
    </div>
    <div class="user-detail-main">
      <el-form
        ref="ruleFormEL"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        label-suffix=":"
      >
        <el-form-item label="账号" prop="userName">
          <el-input v-model="ruleForm.userName" disabled placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" disabled type="password" placeholder="请输入密码" />
          <el-button class="cancel" @click="openPasswordDialog">修改密码</el-button>
        </el-form-item>
        <el-form-item label="姓名" prop="nickName">
          <el-input v-model="ruleForm.nickName" placeholder="请输入姓名" maxlength="20" />
        </el-form-item>
        <el-form-item label="单位" prop="company">
          <el-input v-model="ruleForm.company" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
        <el-select v-model="ruleForm.roleId" disabled placeholder="请选择角色">
          <el-option
            v-for="item in roleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phonenumber">
          <el-input v-model="ruleForm.phonenumber" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-input v-model="ruleForm.createTime" disabled />
        </el-form-item>
        <el-form-item>
          <el-button class="primary" @click="save">
            保存
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <PasswordDialog
      v-if="passwordDialogVisible"
      @save="savePassWord"
      @cancel="cancelPassWord"
    />
  </div>
</template>

<script>
import PasswordDialog from '@/views/system-manager/user-manager/components/PasswordDialog';
import { getUserDetail, updateUser, modifyPassword } from '@/api/user-manage';

export default {
  name: 'user-detail',
  components: {
    PasswordDialog
  },
  data() {
    return {
      roleOptions: [
        { label: '超级管理员', value: 1 },
        { label: '普通用户', value: 2 }
      ],
      ruleForm: {
        id: '',
        userName: 'demo',
        avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
      },
      rules: {},
      passwordDialogVisible: false,
      canPassword: true
    };
  },
  mounted() {
    this.ruleForm.id = this.$route.params.id;
    this.getUserDetail();
  },
  methods: {
    // 返回
    goBack() {
      this.$router.push('/system/user');
    },
    // 获取详情
    getUserDetail() {
      getUserDetail(this.ruleForm).then((result) => {
        this.ruleForm = result.data;
      }).catch((err) => {
      });
    },
    // 保存
    save() {
      delete this.ruleForm.password;
      updateUser(this.ruleForm).then((result) => {
        if (result.code === '000000') {
          this.$message({
            type: 'success',
            message: '修改成功'
          });
          this.goBack();
        }
      }).catch((err) => {
      });
    },
    // 打开修改密码弹框
    openPasswordDialog() {
      this.passwordDialogVisible = true;
    },
    // 保存修改密码弹框
    savePassWord(value) {
      if (!this.canPassword) {
        this.$message({
          type: 'warning',
          message: '修改密码功能暂未开发'
        });
      } else {
        this.cancelPassWord();
        const { newPassword, oldPassword } = value;
        const params = { newPassword, oldPassword };
        params.userId = this.ruleForm.id;
        modifyPassword(params).then((result) => {
          if (result.code === '000000') {
            this.$message({
              type: 'success',
              message: '修改密码成功'
            });
            this.cancelPassWord();
          }
        });
      }
    },
    // 取消修改密码弹框
    cancelPassWord() {
      this.passwordDialogVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
@import '@/styles/variables.less';
.user-detail-container {
  background-color: #FFFFFF;
  padding: 12px 24px;
  height: 100%;
  min-height: 700px;
  border-radius: 4px;
  box-shadow: 0px 9px 15px 0px #E5ECF1;
  .user-detail-header {
    height: 40px;
    line-height: 40px;
    margin-bottom: 12px;
    label {
      font-size: 16px;
      color: @text-primary-dark;
      font-weight: 600;
    }
    .buttons-container {
      float: right;
    }
  }
  .user-detail-avatar {
    display: flex;
    align-items: center;
    height: 64px;
    position: relative;
    padding: 0 16px;
    margin-bottom: 16px;
    .camera-tip {
      position: absolute;
      bottom: 0;
      left: 64px;
      background: #fff;
      padding: 4px;
      border-radius: 50%;
      border: 1px solid rgba(215,215,215,1);
    }
    .el-avatar {
      height: 64px;
      width: 64px;
      line-height: 64px;
    }
    .avatar-message {
      display: inline-block;
      line-height: 64px;
      height: 64px;
      position: absolute;
      margin-left: 16px;
      font-size: 16px;
      color: @text-primary-dark;
    }
  }
  .user-detail-main {
    padding: 16px 32px;
    border-top: 1px solid #eceef5;
    .el-input,.el-select {
      width: 320px;
    }
    .el-button {
      &.cancel {
        margin-left: 8px;
        padding: 8px !important;
      }
    }
  }
}
</style>
