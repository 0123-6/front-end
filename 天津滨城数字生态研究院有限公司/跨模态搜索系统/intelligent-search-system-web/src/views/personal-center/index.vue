<template>
  <div class="personal-center-container">
    <div class="personal-center-detail">
      <div class="personal-center-header">
        <label>个人中心</label>
        <div class="buttons-container">
          <el-button class="back" type="text" @click="goBack" icon="el-icon-caret-left">返回</el-button>
        </div>
      </div>
      <div class="personal-center-content">
        <!--头像模块-->
        <div class="personal-center-avatar">
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
              <img v-if="imageUrl" :src="imageUrl" style="width: 100%;height: 100%;"/>
              <img v-else src="/img/person.svg" alt="" style="width: 100%;height: 100%;">
            </div>
          </el-upload>
          <!--右-->
          <div class="avatar-message">
            <span>{{ ruleForm.nickName }}</span>
          </div>
        </div>
        <div class="personal-center-main">
          <el-form
            ref="ruleFormEL"
            :model="ruleForm"
            :rules="rules"
            label-width="80px"
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
            <el-form-item label="角色" prop="role">
              <el-select v-model="ruleForm.roleId" disabled placeholder="请选择角色">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="手机号" prop="phoneNumber">
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
      </div>
    </div>
    <PasswordDialog
      v-if="isShowPasswordDialog"
      @save="savePassWord"
      @cancel="cancelPassWord"
    />
  </div>
</template>

<script>
import PasswordDialog from '@/views/system-manager/user-manager/components/PasswordDialog';
import { getUserInfo, modifyPassword, modifyUserInfo } from '@/api/common';

export default {
  name: 'personal-center',
  components: {
    PasswordDialog
  },
  data() {
    return {
      roleOptions: [
        { label: '超级管理员', value: 1 },
        { label: '普通用户', value: 2 }
      ],
      imageUrl: '',
      ruleForm: {
        nickName: '',
        password: '',
        userName: '',
        company: '',
        role: '',
        phonenumber: '',
        email: '',
        createTime: ''
      },
      rules: {
        userName: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        company: [
          { required: true, message: '请输入单位', trigger: 'blur' }
        ],
        role: [
          { message: '请选择角色', trigger: 'change' }
        ]
      },
      isShowPasswordDialog: false
    };
  },
  mounted() {
    this.getUserDetail();
  },
  methods: {
    // 返回
    goBack() {
      this.$router.replace('/home/index');
    },
    getUserDetail() {
      const userInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
      getUserInfo(userInfo.loginId).then((res) => {
        if (res.code === '000000') {
          this.ruleForm = res.data;
        }
      });
    },
    // 保存
    save() {
      const {
        id, company, email, phonenumber, nickName
      } = this.ruleForm;
      const params = {
        id, company, email, phonenumber, nickName
      };
      modifyUserInfo(params).then((res) => {
        if (res.code === '000000') {
          this.$message({
            type: 'success',
            message: '修改成功'
          });
        }
      });
    },
    uploadSectionFile() {

    },
    beforeUpload() {

    },
    // 打开修改密码弹框
    openPasswordDialog() {
      this.isShowPasswordDialog = true;
    },
    // 保存修改密码弹框
    savePassWord(value) {
      const { newPassword, oldPassword } = value;
      const params = { newPassword, oldPassword };
      params.userId = this.ruleForm.id;
      modifyPassword(params).then((res) => {
        if (res.code === '000000') {
          this.$message({
            type: 'success',
            message: '修改密码成功'
          });
          this.cancelPassWord();
        }
      });
    },
    // 取消修改密码弹框
    cancelPassWord() {
      this.isShowPasswordDialog = false;
    }
  }
};
</script>

<style lang="less" scoped>
@import '~@/styles/variables.less';
.personal-center-container {
  background: #f7fbfd;
  height: 100%;
  padding: 24px;
  .personal-center-detail {
    background: #ffffff;
    width: 1200px;
    height: 100%;
    margin: 0 auto;;
    border: 2px solid rgba(255,255,255,1);
    box-shadow: 0 7px 11px 0 rgba(229,236,241,1);
    border-radius: 4px;
    .personal-center-header {
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid rgba(236,238,245,1);
      padding: 0 32px;
      label {
        font-size: 16px;
        color: @text-primary-dark;
        font-weight: 600;
      }
      .buttons-container {
        float: right;
      }
    }
    .personal-center-content{
      height: calc(100% - 40px);
      overflow: auto;
      .personal-center-avatar {
        display: flex;
        align-items: center;
        padding: 32px;
        border-bottom: 1px solid rgba(236,238,245,1);
        .avatar-uploader {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: inline-block;
          position: relative;
          .camera-tip {
            position: absolute;
            bottom: 0;
            right: 0;
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
        }
        .avatar-message {
          display: inline-block;
          line-height: 64px;
          height: 64px;
          margin-left: 16px;
          font-size: 16px;
          color: @text-primary-dark;
        }
      }
      .personal-center-main {
        padding: 24px 32px;
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
  }
}
</style>
