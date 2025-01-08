<template>
  <div class="home-container">
    <div class="main-container">
      <el-container>
        <el-main>
          <div class="detail">
            <div class="image">
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :http-request="uploadLogoFile"
                :before-upload="beforeUpload"
                :multiple="false"
                :limit="1">
                <div>
                  <img v-if="iep_platform_USER_INFO.avatar" :src="iep_platform_USER_INFO.avatar" class="avatar" />
                  <svg-icon v-else icon-class="user"></svg-icon>
                </div>
                <el-button type="text">上传头像</el-button>
              </el-upload>
            </div>
            <div class="form">
              <div class="form-item">
                <div class="title">账号:</div>
                <div class="content">{{ iep_platform_USER_INFO.username }}</div>
              </div>
              <div class="form-item">
                <div class="title">昵称:</div>
                <div class="content">{{ iep_platform_USER_INFO.nickname || iep_platform_USER_INFO.username }}</div>
                <div class="operation">
                  <el-button type="text" @click="openMessageDialog('nick')">更改昵称</el-button>
                </div>
              </div>
              <div class="form-item">
                <div class="title">个人邮箱:</div>
                <div class="content">{{ iep_platform_USER_INFO.email || '-' }}</div>
                <div class="operation">
                  <el-button type="text" @click="openMessageDialog('email')">更改邮箱</el-button>
                </div>
              </div>
              <div class="form-item">
                <div class="title">手机号:</div>
                <div class="content">{{ iep_platform_USER_INFO.mobile || '-' }}</div>
              </div>
              <div class="form-item">
                <div class="title">密码:</div>
                <div class="content">已设置</div>
                <div class="operation">
                  <el-button type="text" @click="openMessageDialog('password')">更改密码</el-button>
                </div>
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
    </div>
    <MessageDialog v-if="messageDialogVisible" :title="messageDialogTitle" :width="640" @save="saveMessage" @cancel="cancelMessage">
      <template slot="content">
        <el-form ref="editFormEL" :model="editForm" label-width="100px" :rules="rules">
          <el-form-item label="昵称：" v-if="messageDialogType === 'nick'" prop="nickName">
            <el-input v-model="editForm.nickName" placeholder="请输入昵称"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" v-if="messageDialogType === 'email'" prop="email">
            <el-input v-model="editForm.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="原始密码：" v-if="messageDialogType === 'password'" prop="oldPassword">
            <el-input v-model="editForm.oldPassword" placeholder="请输入旧密码" type="password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码：" v-if="messageDialogType === 'password'" prop="newPassword">
            <el-input
              v-model="editForm.newPassword"
              placeholder="请输入新密码(至少包含字母，符号或数字中的两项且，长度超过8位)"
              type="password"
              autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码：" v-if="messageDialogType === 'password'" prop="newPassword1">
            <el-input v-model="editForm.newPassword1" placeholder="再次输入密码" type="password" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </MessageDialog>
  </div>
</template>

<script>
/*eslint-disable*/
import { mapGetters } from 'vuex';
import { validateEmail, validatePassword } from '@/utils/validate';
import { personApis } from '@/api/person-message';
import { commonApis } from '@/api/common';
import MessageDialog from '@/components/MessageDialog';

export default {
  name: 'PersonMessage',
  computed: {
    ...mapGetters(['iep_platform_USER_INFO'])
  },
  components: {
    MessageDialog
  },
  data() {
    return {
      editForm: {
        nickName: '',
        email: '',
        oldPassword: '',
        newPassword: ''
      },
      rules: {
        nickName: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        oldPassword: [{ required: true, message: '请输入原始密码', trigger: 'blur' }],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!validatePassword(value)) {
                callback(new Error('请输入合法的密码'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        newPassword1: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!validatePassword(value)) {
                callback(new Error('请输入合法的密码'));
              } else if (value !== this.editForm.newPassword) {
                callback(new Error('两次输入密码不一致'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ]
      },
      messageDialogVisible: false, // 信息提示框显隐
      messageDialogTitle: '', // 信息提示框标题
      messageDialogType: '' // 信息提示框类型
    };
  },
  mounted() {},
  methods: {
    beforeUpload(file) {
      const typeArr = file.name.split('.');

      const isImage =
        typeArr[typeArr.length - 1] === 'jpg' ||
        typeArr[typeArr.length - 1] === 'jpeg' ||
        typeArr[typeArr.length - 1] === 'png' ||
        typeArr[typeArr.length - 1] === 'svg';
      const isLt5M = file.size / 1024 < 500;
      if (!isImage) {
        this.$message({
          type: 'warning',
          message: '只能上传后缀名为JPG/JPEG/PNG/SVG的文件'
        });
      }
      if (!isLt5M) {
        this.$message({
          type: 'warning',
          message: '上传文件大小不能超过 500kb!'
        });
      }
      return isImage && isLt5M;
    },
    uploadLogoFile(data) {
      const formData = new FormData();
      formData.append('type', 'avatar');
      formData.append('file', data.file);
      commonApis
        .uploadFile(formData)
        .then((res) => {
          if (res.code === '00000') {
            this.avatar = res.data;
            const params = {
              url: res.data
            };
            personApis
              .editAvatar(params)
              .then((result) => {
                if (result.data === true) {
                  const user = { ...this.iep_platform_USER_INFO, ...{ avatar: this.avatar } };
                  this.$store.commit('Common/ADD_USER_INFO', user);
                  this.$message({
                    type: 'success',
                    message: '更新成功'
                  });
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    openMessageDialog(type) {
      this.messageDialogVisible = true;
      this.messageDialogType = type;
      if (type === 'nick') {
        this.messageDialogTitle = '更改昵称';
        this.editForm.nickName = '';
      } else if (type === 'email') {
        this.messageDialogTitle = '更改邮箱';
        this.editForm.email = '';
      } else if (type === 'password') {
        this.messageDialogTitle = '更改密码';
        this.editForm.oldPassword = '';
        this.editForm.password = '';
      }
    },
    saveMessage() {
      this.$refs.editFormEL.validate((valid) => {
        if (valid) {
          if (this.messageDialogType === 'nick') {
            const params = {
              nickname: this.editForm.nickName
            };
            personApis
              .editNick(params)
              .then((result) => {
                if (result.data === true) {
                  const user = { ...this.iep_platform_USER_INFO, ...{ nickname: this.editForm.nickName } };
                  this.$store.commit('Common/ADD_USER_INFO', user);
                  this.$message({
                    type: 'success',
                    message: '更新成功'
                  });
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } else if (this.messageDialogType === 'email') {
            const params = {
              email: this.editForm.email
            };
            personApis
              .editEmail(params)
              .then((result) => {
                if (result.data === true) {
                  const user = { ...this.iep_platform_USER_INFO, ...{ email: this.editForm.email } };
                  this.$store.commit('Common/ADD_USER_INFO', user);
                  this.$message({
                    type: 'success',
                    message: '更新成功'
                  });
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } else if (this.messageDialogType === 'password') {
            const params = {
              oldPassword: this.editForm.oldPassword,
              newPassword: this.editForm.newPassword
            };
            personApis
              .editPassword(params)
              .then((result) => {
                if (result.data === true) {
                  this.$store.commit('Common/ADD_USER_INFO', {});
                  sessionStorage.clear();
                  this.$router.push('/login');
                  this.$message({
                    type: 'success',
                    message: '更新成功'
                  });
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
          this.messageDialogVisible = false;
        } else {
          console.log('error submit!!');
          return false;
        }
        return true;
      });
    },
    cancelMessage() {
      this.messageDialogVisible = false;
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
      padding: 24px;
      .detail {
        display: flex;
        background: #fff;
        padding: 64px 72px;
        gap: 64px;
        box-shadow: 0px 0px 14px rgba(19, 38, 82, 0.08);
        min-height: calc(100vh - 110px);
        box-sizing: border-box;
        .image {
          width: 120px;
          .avatar-uploader {
            .avatar {
              width: 120px;
              height: 120px;
              border-radius: 50%;
              border: 1px solid #d9d9d9;
            }
            .svg-icon {
              width: 120px;
              height: 120px;
              //border: 1px solid #D9D9D9;
            }
          }
        }
        .form {
          flex: auto;
          .form-item + .form-item {
            margin-top: 32px;
          }
          .title {
            font-size: 14px;
            color: #86909c;
            border-bottom: 1px solid #e5e6eb;
            height: 32px;
            line-height: 32px;
          }
          .content {
            font-size: 16px;
            color: #1a262c;
            height: 32px;
            line-height: 32px;
          }
          .operation {
            .el-button {
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}
</style>
