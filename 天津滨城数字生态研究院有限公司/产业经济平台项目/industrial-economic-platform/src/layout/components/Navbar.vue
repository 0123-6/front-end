<template>
  <div class="navbar">
    <div class="tw-flex tw-items-center" style="padding-left: 60px">
      <div class="left-menu" @click="returnHome">
        <img :src="logoSrc" style="height: 100%; width: 100%; cursor: pointer" />
      </div>
      <div class="center-menu" style="padding-left: 40px">
        <el-menu :default-active="setDefaultActive()" mode="horizontal" @select="handleSelectMenu">
          <template v-for="item of menuList">
            <el-submenu :index="item.path" :key="item.id" v-if="item.children?.length > 0">
              <template slot="title">
                <span>{{ item.menuName }}</span>
              </template>
              <el-menu-item v-for="innerItem of item.children" :index="innerItem.path" :key="innerItem.id">{{ innerItem.menuName }}</el-menu-item>
            </el-submenu>
            <el-menu-item v-else :index="item.path" :key="item.id">{{ item.menuName }}</el-menu-item>
            <!--          <el-menu-item-->
            <!--              :index="item.path"-->
            <!--              :key="item.id"-->
            <!--          >{{item.menuName}}</el-menu-item>-->
          </template>
        </el-menu>
      </div>
    </div>
    <div class="right-menu tw-flex tw-items-center">
      <div class="tw-mr-2 tw-h-[30px] tw-min-w-[75px] tw-flex tw-justify-center tw-items-center tw-rounded-lg tw-cursor-pointer" @click="goChatPage">
        <img src="../icon/ChatSvg.svg" alt="" />
        <span class="tw-ml-2.5 tw-text-sm tw-text-[#356EF5] tw-font-medium">问答</span>
      </div>
      <el-dropdown v-if="isLogin" class="avatar-container tw-ml-[6.3vw]" trigger="hover">
        <div class="avatar-wrapper d-flex ai-center">
          <img class="avatar" v-if="iep_platform_USER_INFO?.avatar" :src="iep_platform_USER_INFO?.avatar" />
          <svg-icon class="avatar" v-else icon-class="user"></svg-icon>
          <span class="avatar-name ell" :title="iep_platform_USER_INFO?.nickname || iep_platform_USER_INFO?.username">
            {{ iep_platform_USER_INFO?.nickname || iep_platform_USER_INFO?.username }}
          </span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <div class="dropdown">
            <img class="avatar" v-if="iep_platform_USER_INFO?.avatar" :src="iep_platform_USER_INFO?.avatar" />
            <svg-icon class="avatar" v-else icon-class="user"></svg-icon>
            <span class="avatar-name hpj-text-hidden" :title="iep_platform_USER_INFO?.nickname || iep_platform_USER_INFO?.username">
              {{ iep_platform_USER_INFO?.nickname || iep_platform_USER_INFO?.username }}
            </span>
          </div>
          <el-dropdown-item @click.native="person">
            <span style="display: block">个人中心</span>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout">
            <span style="display: block">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div v-else class="login-or-regist d-flex ai-center">
        <el-button class="eee-button" type="primary" @click="goLoginPage">登录</el-button>
        <el-button class="eee-button" type="text" @click="goRegisterPage" style="margin-left: 10px">注册</el-button>
      </div>
    </div>
    <!--弹框-->
    <login-dialog v-if="showLoginDialog" @close="closeLoginDialog" @goRegister="goRegister" @goFindPassword="goFindPassword"></login-dialog>
    <register-dialog v-if="showRegisterDialog" @close="closeRegisterDialog" @goLogin="goLogin"></register-dialog>
    <find-password-dialog v-if="showFindPasswordDialog" @close="closeFindPasswordDialog" @goLogin="goLogin"></find-password-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex';
import { commonApis } from '@/api/common';
import defaultLogo from '@/assets/icons/logo.svg';
import { menus } from '@/api/menu';
import LoginDialog from '@/layout/components/LoginDialog';
import RegisterDialog from '@/layout/components/RegisterDialog';
import FindPasswordDialog from '@/layout/components/FindPasswordDialog';

export default {
  name: 'navbar-page',
  components: { FindPasswordDialog, RegisterDialog, LoginDialog },
  computed: {
    ...mapGetters(['iep_platform_TOKEN', 'iep_platform_USER_INFO', 'iep_platform_ROUTERS_INFO']),
    isLogin() {
      return this.iep_platform_TOKEN?.token || false;
    },
    menuList() {
      return this.iep_platform_ROUTERS_INFO?.filter((item) => item.menuName !== '其他' && item.menuName !== '首页');
    },
    logoSrc() {
      return this.isLogin ? this.iep_platform_USER_INFO.logoPath || defaultLogo : defaultLogo;
    }
  },
  data() {
    return {
      showLoginDialog: false,
      showRegisterDialog: false,
      showFindPasswordDialog: false
    };
  },
  created() {
    if (!this.isLogin) {
      this.$store.commit('Common/ADD_ROUTERS_INFO', menus);
    }
  },
  mounted() {
    // console.log(this.iep_platform_USER_INFO, '12312');
  },
  methods: {
    goLoginPage() {
      this.$router.replace('/login');
    },
    goRegisterPage() {
      this.$router.replace('/login?isRegister=true');
    },
    handleSelectMenu(index) {
      if (this.isLogin) {
        this.$router.push(index);
      } else {
        // this.$router.push('/login');
        // 不是跳转到登录页，而是弹出登录框
        this.showLoginDialog = true;
      }
    },
    setDefaultActive() {
      if (this.$route.path.indexOf('/industry-map/detail') === 0) {
        return '/industry-map';
      }
      if (this.$route.path.indexOf('/policy-list') === 0) {
        return '/policy-inquiries';
      }
      if (this.$route.path.indexOf('/policy-matching') === 0) {
        return '/policy-documents';
      }
      return this.$route.path;
    },
    logout() {
      this.$store.commit('Common/CLEAR_STORE');
      this.$router.replace('/login');
    },
    person() {
      this.$router.push('/person-center');
    },
    returnHome() {
      this.$router.push('/');
    },
    goChatPage() {
      // 如果已登录，跳转到聊天页面，否则弹出登录框
      if (!this.isLogin) {
        this.showLoginDialog = true;
        return;
      }
      this.$router.push('/chat');
    },
    closeLoginDialog() {
      this.showLoginDialog = false;
    },
    closeRegisterDialog() {
      this.showRegisterDialog = false;
    },
    goLogin() {
      this.showRegisterDialog = false;
      this.showFindPasswordDialog = false;
      this.showLoginDialog = true;
    },
    goRegister() {
      this.showLoginDialog = false;
      this.showRegisterDialog = true;
    },
    goFindPassword() {
      this.showLoginDialog = false;
      this.showFindPasswordDialog = true;
    },
    closeFindPasswordDialog() {
      this.showFindPasswordDialog = false;
    }
  }
};
</script>

<style lang="less" scoped>
@import '~@/styles/variables.less';
.navbar {
  display: flex;
  justify-content: space-between;
  height: 62px;
  overflow: hidden;
  position: relative;
  background: white;
  box-sizing: border-box;

  .login-or-regist {
    margin: 0 90px;
    font-size: 14px;

    span {
      padding: 3px;
      cursor: pointer;
    }
    .to-login {
      margin-right: 10px;
      padding: 0 20px;
      height: 32px;
      line-height: 32px;
      border-radius: 5px;
      background: #eaf0fe;
      color: rgba(53, 109, 246, 1);
    }
  }

  .left-menu {
    margin: 0 10px;
    height: 100%;
    max-width: 286px;
    max-height: 40px;
  }

  .center-menu {
    //width: calc(100% - 500px);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 62px;
    min-width: 550px;

    ::v-deep {
      .el-menu--popup .el-menu-item {
        color: red;
      }
      .el-menu--horizontal > .el-submenu .el-submenu__icon-arrow {
        margin-top: 0;
      }
      .el-menu {
        & > .el-menu-item {
          color: #333333;
          font-size: 16px;
          font-weight: 500;
          width: 160px;
          height: 62px;
          line-height: 62px;
          text-align: center;
          &.is-active {
            color: @primary-color;
            background-color: white;
          }
        }
        & > .el-submenu {
          .el-submenu__title {
            color: #333333;
            font-size: 16px;
            font-weight: 500;
            width: 130px;
            text-align: center;
            height: 62px;
            line-height: 62px;
            padding: 0 15px;
            &:hover {
              background: transparent;
            }
            .el-submenu__icon-arrow {
              color: #333333;
            }
          }
          &.is-active {
            background-color: white;
            .el-submenu__title {
              color: @primary-color;
              border-bottom: none;
              .el-submenu__icon-arrow {
                color: @primary-color;
              }
            }
          }
        }
      }
    }
  }

  .right-menu {
    height: 100%;
    line-height: 62px;
    //min-width: 374px;

    &:focus {
      outline: none;
    }
    .avatar-container {
      margin-right: 70px;
      min-width: 110px;

      .avatar {
        flex-shrink: 0;
        height: 30px;
        width: 30px;
        border-radius: 50%;
        margin-right: 6px;
      }

      .avatar-wrapper {
        max-width: 200px;
        height: 32px;
        line-height: 32px;
      }
    }
    .login-button {
      line-height: 80px;
      > button:nth-child(2) {
        margin-right: 20px;
      }
    }
  }
}
.dropdown {
  width: 160px;
  display: flex;
  align-items: center;
  margin: 16px 20px;
  .avatar {
    flex-shrink: 0;
    height: 30px;
    width: 30px;
    border-radius: 50%;
    margin-right: 16px;
  }

  .avatar-wrapper {
    max-width: 200px;
    height: 32px;
    line-height: 32px;
  }
}
</style>

<style lang="less">
@import '~@/styles/variables.less';
.el-menu--popup {
  min-width: inherit;
  padding: 0;
  .el-menu-item {
    width: 160px;
    height: 40px !important;
    color: @text-lighter;
    padding: 0 21px !important;
    &:hover {
      background: rgba(53, 110, 245, 0.06) !important;
    }
    &.is-active {
      background-color: white !important;
      color: @primary-color !important;
      padding: 0 21px !important;
    }
  }
}
</style>
