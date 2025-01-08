<template>
  <!--最外层-->
  <div class="flex flex-direction bgc-main" style="width: 100vw;">
    <!--头部-->
    <ai-header />
    <!--主体-->
    <div class="flex justify-center bgc-main" style="width: 100%;min-height: calc(100vh - 110px);">
      <!--内容-->
      <div
        class="flex flex-direction margin-top-16 margin-bottom-12 bgc-white box-shadow-1"
        style="width: 67.5%;min-width: 600px;padding-left: 24px;padding-right: 24px;"
      >
        <!--上-->
        <div class="flex justify-between align-center border-bottom" style="width: 100%;height: 50px;min-height: 50px;">
          <!--左-->
          <div class="flex font-size-16 color-title font-weight">
            个人中心
          </div>
          <el-button class="return-btn" icon="el-icon-caret-left" @click="goBack">返回</el-button>
        </div>
        <!--头像模块-->
        <div class="flex align-center border-bottom" style="width: 100%;height: 128px;min-height: 128px;">
          <!--头像模块-->
          <div class="flex align-center padding-left-8" style="width: 100%;height: 70px;">
            <!--左-->
            <el-upload
              class="avatar-uploader"
              :action="''"
              :http-request="uploadSectionFile"
              :before-upload="beforeUpload"
              :show-file-list="false"
              accept=".jpg,.jpeg,.png,.bmp"
            >
              <div style="width: 66px;height: 66px;position:relative;" class="flex hand">
                <div
                  class="flex justify-center align-center img-circle"
                  style="background: #D8D8D8;overflow:hidden;border: 2px solid rgba(236,236,236,1);width: 100%;height: 100%;"
                >
                  <img :src="form.avatar" style="width: 100%;height: 100%;">
                </div>
                <div
                  class="flex justify-center align-center bgc-white img-circle"
                  style="position:absolute;bottom: 0;right: 0;width: 24px;height: 24px;border: 0.6px solid rgba(215,215,215,1);"
                >
                  <img src="../../assets/images/profile/xiangji.svg" alt="" width="16" height="16">
                </div>
              </div>
            </el-upload>
            <!--右-->
            <div class="flex flex-direction justify-around margin-left-16" style="height: 100%;">
              <span class="flex font-size-16 color-title font-weight">{{ form.nickName }}</span>
              <div>
                <span class="flex font-size-14 color-content">到期时间: {{ moment(form.endDate).format('YYYY-MM-DD') }}</span>
              </div>
            </div>
          </div>
        </div>
        <!--主体内容-->
        <div class="flex flex-direction" style="width: 100%;">
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            label-width="146px"
            style="width: 100%;"
            label-suffix=":"
            class="margin-top-24"
          >
            <el-form-item label="账号" prop="userName" style="width: 466px;">
              <el-input v-model="form.userName" disabled placeholder="请输入账号" />
            </el-form-item>
            <el-form-item label="密码" prop="password" style="width: 574px;">
              <div class="flex align-center" style="width: 100%;">
                <el-input v-model="form.password" disabled type="password" placeholder="请输入密码" style="width: 320px;" />
                <el-button
                  class="edit-button"
                  @click="showChangePassword = true"
                >修改密码</el-button>
              </div>
            </el-form-item>
            <el-form-item label="姓名" prop="nickName" style="width: 466px;">
              <el-input v-model="form.nickName" placeholder="请输入姓名" maxlength="20" />
            </el-form-item>
            <el-form-item label="单位" prop="company" style="width: 466px;">
              <el-input v-model="form.company" placeholder="请输入单位" />
            </el-form-item>
            <el-form-item label="角色" prop="roleName" style="width: 466px;">
              <el-input v-model="form.roleName" disabled />
            </el-form-item>
            <div class="flex border-bottom margin-bottom-24" style="width: 100%;" />
            <el-form-item label="手机号码" prop="phonenumber" style="width: 466px;">
              <el-input v-model="form.phonenumber" placeholder="请输入手机号码" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email" style="width: 466px;">
              <el-input v-model="form.email" placeholder="请输入邮箱" />
            </el-form-item>
            <el-form-item label="创建时间" prop="createTime" style="width: 466px;">
              <el-input v-model="form.createTime" disabled />
            </el-form-item>
            <el-form-item>
              <el-button style="border-radius: 4px;" type="primary" @click="save">
                保存
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <!--备案-->
    <div class="flex justify-center align-center"
         style="width: 100%;height: 50px;min-height: 50px;">
      <record-com></record-com>
    </div>
    <!--修改密码弹窗-->
    <change-password
      v-if="showChangePassword"
      @ok="changePasswordOk"
      @cancel="changePasswordCancel"
    />
  </div>
</template>

<script>
import _debounce from 'lodash/debounce';
import AiHeader from '@/layout/components/AiHeader';
import ChangePassword from '@/views/PersonalCenter/ChangePassword';
import axios from 'axios';
import { getProfile, updateUserInfo, updatePw } from '@/api/user';
import moment from 'moment';
import RecordCom from "@/components/RecordCom";

export default {
  name: 'Index',
  components: { ChangePassword, AiHeader, RecordCom },
  data() {
    var validatePhoneNumber = (rule, value, callback) => {
      if (value === '') {
        callback();
      } else if (!/^1[3456789]\d{9}$/.test(value)) {
        callback(new Error('请输入正确格式的手机号码'));
      } else {
        callback();
      }
    };
    var validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback();
      } else if (!/^[A-Za-z0-9\u4e00-\u9fa5]+[- | a-z0-9A-Z . _]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
        callback(new Error('请输入正确格式的邮箱'));
      } else {
        callback();
      }
    };
    return {
      actionUrl: process.env.NODE_ENV === 'development' ? '/api/user/sysUser/profile/avatar?signature=AppWeb00123' : '/user/sysUser/profile/avatar?signature=AppWeb00123',
      uploadFrom: null,
      form: {},
      rules: {
        userName: [
          {
            required: true
          }
        ],
        password: [
          {
            required: true
          }
        ],
        nickName: [
          {
            required: true,
            message: '姓名不能为空',
            trigger: 'blur'
          },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        roleName: [
          {
            required: true
          }
        ],
        company: [
          {
            required: true,
            message: '单位不能为空',
            trigger: 'blur'
          }
        ],
        phonenumber: [
          {
            validator: validatePhoneNumber,
            trigger: 'blur'
          }
        ],
        email: [
          {
            validator: validateEmail,
            trigger: 'blur'
          }
        ]

      },
      showChangePassword: false
    };
  },
  mounted() {
    this.getProfile();
  },
  methods: {
    moment,
    getProfile() {
      getProfile().then((res) => {
        this.form = res.data.user;
        if (this.form.avatar === '') {
          this.form.avatar = require('@/assets/images/profile/person.svg');
        }
        this.form.createTime = moment(this.form.createTime).format('YYYY-MM-DD');
      }).catch((err) => {
        console.log(err);
      });
    },
    goBack() {
      this.$router.back();
    },
    save: _debounce(function() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const { nickName, company, phonenumber, email } = this.form;
          updateUserInfo({ nickName, company, phonenumber, email }).then((res) => {
            if (res.code === '000000') {
              this.$message.success('修改成功');
              this.$store.commit('user/SET_NAME', nickName);
            }
          });
        } else {
          return false;
        }
      });
    }, 300),
    changePasswordOk(value) {
      const { oldPassword, newPassword } = value;
      updatePw({ oldPassword, newPassword }).then((res) => {
        if (res.code === '000000') {
          this.$message.success('修改成功');
          this.changePasswordCancel();
        }
      });
    },
    changePasswordCancel() {
      this.showChangePassword = false;
    },
    /** 上传模型格式校验 */
    beforeUpload(file) {
      console.log(file)
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG,PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      this.uploadFrom = new FormData();
      this.uploadFrom.append('avatarfile', file);
      return isJPG && isLt2M;
    },
    uploadSectionFile() {
      axios.post(this.actionUrl, this.uploadFrom, {
        headers: { 'content-type': 'multipart/form-data' }
      }).then(res => {
        if (res.data.code === '000000') {
          this.$message.success('修改成功');
          this.form.avatar = res.data.data.imageUrl;
          this.$store.commit('user/SET_AVATAR', this.form.avatar);
        }
      })
        .catch((err) => {
          console.log(err);
        });
    }
  }

};
</script>

<style lang="scss" scoped>
.edit-button {
  position: relative;
  left: 18px;
  height: 36px;
  color: #0164FF;
}
::v-deep {
  .el-form-item__label {
    font-weight: 400;
  }
}
</style>
