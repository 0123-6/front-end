<template>
  <!-- 个人中心 -->
  <div class="person-center w-full h-full px-6 flex flex-col relative text-sm">
    <!-- 个人中心标题 -->
    <title-comp title="个人中心" :type="1" class="mt-6" />
    <!-- 个人中心内容 -->
    <div class="mt-[19px] mb-6 flex-1 w-full flex flex-col bg-white rounded-2xl">
      <!--头像-->
      <div class="mt-[50px] flex items-center">
        <span class="w-[120px] flex justify-end items-center text-black-three">头像：</span>
        <div class="ml-6 flex items-center">
          <div class="w-[52px] h-[52px] flex justify-center items-center border border-[#ACBAC7] rounded-full">
            <img :src="userInfo?.url ? userInfo?.url : DefaultAvatarSvg" alt="" class="w-full h-full rounded-full">
          </div>
          <el-button type="primary" link style="margin-left: 59px;" @click="updateAvatar">更换头像</el-button>
        </div>
      </div>
      <!--姓名-->
      <div class="mt-8 flex items-center">
        <span class="w-[120px] flex justify-end items-center text-black-three">姓名：</span>
        <span class="ml-6 text-base text-black">{{ userInfo?.realName ? userInfo.realName : '-' }}</span>
      </div>
      <div class="mt-8 flex items-center">
        <span class="w-[120px] flex justify-end items-center text-black-three">账号：</span>
        <span class="ml-6 text-base text-black">{{ userInfo?.userName ? userInfo.userName : '-' }}</span>
      </div>
      <!--密码-->
      <div class="mt-8 flex items-center">
        <span class="w-[120px] flex justify-end items-center text-black-three">密码：</span>
        <span class="ml-6 text-base text-black">******</span>
        <el-button type="primary" link style="margin-left: 62px;"
          @click="showChangePasswordDialog = true">修改密码</el-button>
      </div>
      <!--所属部门-->
      <div class="mt-8 flex items-center">
        <span class="w-[120px] flex justify-end items-center text-black-three">所属部门：</span>
        <span class="ml-6 text-base text-black">{{ userInfo?.deptName ? userInfo.deptName : '-' }}</span>
      </div>
      <!--角色权限-->
      <div class="mt-8 flex items-center">
        <span class="w-[120px] flex justify-end items-center text-black-three">角色权限：</span>
        <span class="ml-6 text-base text-black">{{ userInfo?.roleName ? userInfo.roleName : '-' }}</span>
      </div>
      <!--手机号码-->
      <div class="mt-8 flex items-center">
        <span class="w-[120px] flex justify-end items-center text-black-three">手机号码：</span>
        <span class="ml-6 text-base text-black">{{ userInfo?.mobile ? userInfo.mobile : '-' }}</span>
      </div>
      <!--邮箱-->
      <div class="mt-8 flex items-center">
        <span class="w-[120px] flex justify-end items-center text-black-three">邮箱：</span>
        <span class="ml-6 text-base text-black">{{ userInfo?.email ? userInfo.email : '-' }}</span>
      </div>
    </div>
    <!--弹框-->
    <!--修改密码弹框-->
    <el-dialog v-model="showChangePasswordDialog" append-to-body draggable destroy-on-close :close-on-click-modal="false"
      :close-on-press-escape="false" class="change-password-dialog" title="修改密码" width="460px">
      <change-password-dialog @on-ok="changePasswordDialogOnOk" @on-cancel="changePasswordDialogOnCancel"
        @go-forget-password="goForgetPassword" />
    </el-dialog>
    <!--忘记密码弹框-->
    <el-dialog v-model="showForgetPasswordDialog" append-to-body draggable destroy-on-close :close-on-click-modal="false"
      :close-on-press-escape="false" class="change-password-dialog" title="忘记密码" width="460px">
      <forget-password-dialog @on-ok="forgetPasswordDialogOnOk" @on-cancel="forgetPasswordDialogOnCancel" />
    </el-dialog>
  </div>
</template>

<script>
import md5 from 'js-md5'
import TitleComp from "@/views/index/components/TitleComp";
import DefaultAvatarSvg from './icon/DefaultAvatarSvg.svg';
import ChangePasswordDialog from "@/views/person-center/components/ChangePasswordDialog";
import ForgetPwd from "@/views/ForgetPwd";
import ForgetPasswordDialog from "@/views/person-center/components/ForgetPasswordDialog";
import request from "@/utils/request";
import { knowledgeBase_uploadFile } from "@/api/repository/knowledgeBase";
import useUserStore from "@/store/modules/user";

export default {
  name: "PersonCenter",
  components: {
    ForgetPasswordDialog,
    ChangePasswordDialog,
    TitleComp,
    ForgetPwd,
  },
  data() {
    return {
      loading: false,
      // 用户信息
      userInfo: {
        // 头像
        url: '',
        // 姓名
        userName: '',
        // 账号ID
        accountId: '',
        // 所属部门
        deptName: '',
        // 角色权限
        roleName: '',
        // 手机号码
        mobile: '',
        // 邮箱
        email: '',
      },
      DefaultAvatarSvg,
      // 修改密码弹框
      showChangePasswordDialog: false,
      // 忘记密码弹框
      showForgetPasswordDialog: false,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      this.loading = true;
      const { result } = await request({
        url: '/admin/sysUser/personalCenterInfo',
        method: 'get',
      });
      console.log('result: ', result);
      this.userInfo = result;
      this.loading = false;
    },
    // 更新头像
    updateAvatar() {
      // 创建一个input，从input中获取图片
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const formData = new FormData();
          formData.append('file', file);
          formData.bucketName = 'cip-admin';
          // 上传文件本身
          const { result } = await knowledgeBase_uploadFile(formData);
          // 关联用户和头像
          await request({
            url: '/admin/sysUser/avatarReplace',
            method: 'put',
            data: {
              fileUrl: result.fileUrl,
            },
          });
          this.$message({
            message: '上传图片成功',
            type: 'success',
          });
          // 更新头像
          this.userInfo.url = result.fileUrl;
          // 更新全局用户信息
          await useUserStore().getInfo();
        };
      };
      input.click();
    },
    // 修改密码弹框ok
    async changePasswordDialogOnOk(params) {
      console.log('changePasswordDialogOnOk, params: ', params);
      await request({
        url: '/admin/sysUser/changePassword',
        method: 'put',
        data: {
          oldPassword: md5(params.oldPassword),
          newPassword: md5(params.newPassword),
        },
      });
      // 修改密码成功
      this.$message({
        message: '修改密码成功，请重新登录',
        type: 'success',
      });
      this.showChangePasswordDialog = false;
      // 退出登录
      await useUserStore().logOut();
      // 跳转到登录页面
      this.$router.push('/login');
    },
    // 修改密码弹框cancel
    changePasswordDialogOnCancel() {
      this.showChangePasswordDialog = false;
    },
    // 跳转到忘记密码页面
    goForgetPassword() {
      this.showChangePasswordDialog = false;
      this.showForgetPasswordDialog = true;
    },
    // 忘记密码弹框ok
    async forgetPasswordDialogOnOk(params) {
      console.log('forgetPasswordDialogOnOk, params: ', params);
      this.showForgetPasswordDialog = false;
      this.$message({
        message: '修改密码成功',
        type: 'success',
      });
    },
    // 忘记密码弹框cancel
    forgetPasswordDialogOnCancel() {
      console.log('forgetPasswordDialogOnCancel');
      this.showForgetPasswordDialog = false;
    },
  },
}
</script>

<style lang="scss">
.person-center {}
</style>
