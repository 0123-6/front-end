<template>
  <div class="home-container">
    <div class="main-container">
      <el-container>
        <el-main>
          <div v-show="showOrgInfo" class="detail">
            <div class="image">
              <div class="image-container">
                <img v-if="iep_platform_USER_INFO.logoPath" :src="iep_platform_USER_INFO.logoPath" class="avatar" />
                <svg-icon v-else icon-class="user" width="80px" height="40px"></svg-icon>
              </div>
            </div>
            <div class="form">
              <div class="form-item">
                <div class="title">组织机构全称:</div>
                <div class="content">{{ orgInfo?.organizationFullName || '-' }}</div>
              </div>
              <div class="form-item">
                <div class="title">所属地区:</div>
                <div class="content">{{ orgInfo?.provinceName }}{{ orgInfo?.cityName }}{{ orgInfo?.districtName }}</div>
              </div>
              <div class="form-item">
                <div class="title">详细地址:</div>
                <div class="content">{{ orgInfo?.districtName }}{{ orgInfo?.address || '-' }}</div>
              </div>
              <div class="form-item">
                <div class="title">服务周期:</div>
                <div class="content">{{ replaceStr(orgInfo?.serviceStartTime, '-', '.') }} - {{ replaceStr(orgInfo?.serviceEndTime, '-', '.') }}</div>
              </div>
            </div>
          </div>
          <div v-show="showOrgJoin" class="join-wrap d-flex flex-y ai-center jc-center">
            <template v-if="showJoin">
              <img src="@/assets/icons/empty-org.svg" />
              <div class="tip">您还未加入任何机构</div>
              <el-button type="primary" plain @click="showJoin = false">立即加入</el-button>
            </template>
            <template v-else>
              <el-form ref="form" :model="form" :rules="rules" style="width: 300px">
                <el-form-item label="请输入机构验证码" prop="code">
                  <el-input v-model="form.code" clearable=""></el-input>
                </el-form-item>
                <div>
                  <el-button type="primary" @click="handleSubmit()" style="margin-top: 0">提交</el-button>
                </div>
              </el-form>
            </template>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import { mapGetters } from 'vuex';
import { commonApis } from '@/api/common';
import { replaceStr } from '@/utils';

export default {
  name: 'PersonCompany',
  data() {
    return {
      orgInfo: {},
      showJoin: true,
      form: {
        code: ''
      },
      rules: {
        code: [
          {
            required: true,
            message: '请输入'
          }
        ]
      },
      showOrgInfo: false,
      showOrgJoin: false
    };
  },
  computed: {
    ...mapGetters(['iep_platform_USER_INFO'])
  },
  mounted() {
    this.getOrgData();
  },
  methods: {
    replaceStr,
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          commonApis
            .addUsers({
              userIds: [this.iep_platform_USER_INFO.id],
              verificationCode: this.form.code
            })
            .then(({ code }) => {
              if (code === '00000') {
                this.$message({
                  type: 'success',
                  message: '加入机构成功，请重新登录！'
                });
                this.$store.commit('Common/CLEAR_STORE');
                this.$router.replace('/login');
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          return false;
        }
      });
    },
    getOrgData() {
      commonApis
        .getOrgInfo()
        .then((result) => {
          this.orgInfo = result.data || {};
          this.showOrgInfo = this.orgInfo.remark !== '1';
          this.showOrgJoin = !this.showOrgInfo;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    beforeUpload(file) {
      const typeArr = file.name.split('.');

      const isImage =
        typeArr[typeArr.length - 1] === 'jpg' ||
        typeArr[typeArr.length - 1] === 'jpeg' ||
        typeArr[typeArr.length - 1] === 'png' ||
        typeArr[typeArr.length - 1] === 'svg';
      const isLt5M = file.size / 1024 < 500;
      console.log(isImage, isLt5M, '12314', file.size / 1024 / 1024);
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
              tenantId: this.iep_platform_USER_INFO.tenantId,
              logoPath: res.data
            };
            commonApis
              .saveAdminUserInfo(params)
              .then((result) => {
                if (result.data === true) {
                  const user = { ...this.iep_platform_USER_INFO, ...{ avatar: this.avatar } };
                  this.$store.commit('Common/ADD_USER_INFO', user);
                  this.$message({
                    type: 'success',
                    message: '更新成功'
                  });
                  this.$router.go(0);
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
          .image-container {
            max-width: 286px;
            max-height: 40px;
            > img {
              height: 40px;
              object-fit: cover;
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
        }
      }
      .join-wrap {
        height: calc(100vh - 110px);
        .el-button {
          margin-top: 50px;
        }
        .tip {
          margin-top: -70px;
          color: #86909c;
        }
      }
    }
  }
}
</style>
