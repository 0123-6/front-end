<template>
  <div class="app-navbar">
    <div class="left-menu" :class="{ 'is-collapse': isCollapse }">
      <div class="left-menu-title" @click="returnHome">
        <img class="logo" src="@/assets/icons/logo-square.svg" />
        <div class="sys-name ell">产业经济管理后台</div>
      </div>
      <el-menu class="my-menu" mode="vertical" :default-active="setDefaultActive()" :collapse="isCollapse" router unique-opened>
        <template v-for="item of USER_INFO?.menus">
          <el-submenu v-if="item.children.length !== 0" :index="item.path" :key="item.path">
            <template #title>
              <img v-if="item.icon" :src="icons[item.icon]" alt="" />
              <span slot="title" style="margin-left: 14px">{{ item.menuName }}</span>
            </template>
            <el-menu-item v-for="child of item.children" :key="child.path" :index="child.path">
              <span slot="title">{{ child.menuName }}</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item v-else :index="item.path" :key="item.path" style="font-weight: 600">
            <img v-if="item.icon" :src="icons[item.icon]" alt="" />
            <span slot="title" style="margin-left: 14px">{{ item.menuName }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import { mapGetters } from 'vuex';

export default {
  name: 'navbar-page',
  data() {
    return {
      isCollapse: false,
      icons: {
        tenant: require('@/assets/icons/tenant.svg'),
        company: require('@/assets/icons/company.svg'),
        index: require('@/assets/icons/index.svg'),
        industryChain: require('@/assets/icons/industryChain.svg'),
        policy: require('@/assets/icons/policy.svg'),
        question: require('@/assets/icons/question.svg'),
        org: require('@/assets/icons/org.svg')
      }
    };
  },
  computed: {
    ...mapGetters(['ROUTER_TAGS', 'USER_INFO']),
    isLogin() {
      return this.$store.getters.TOKEN?.token || false;
    }
  },
  mounted() {
    if (!this.isLogin) {
      this.$router.push('/login');
    }
    console.log(this.USER_INFO.menus, 'this.USER_INFO.menus');
  },
  methods: {
    setDefaultActive() {
      return this.$route.path;
    },
    returnHome() {
      if (this.$route.path === '/index') return;
      this.$router.push('/');
    }
  }
};
</script>

<style lang="less">
@import '~@/styles/variables.less';
.app-navbar {
  display: flex;
  height: 100%;
  .left-menu {
    color: #fff;
    background: #081728;
    width: 240px;
    transition: width 0.2s;
    &.is-collapse {
      width: 80px;
      .sys-name {
        display: none;
      }
      .el-menu {
        margin: 0 auto;
      }
      .el-menu-item,
      .el-submenu__title {
        text-align: center;
        white-space: pre-wrap;
      }
    }
    &-title {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 60px;
      line-height: 60px;
      font-size: 20px;
      text-align: center;
      cursor: pointer;
      .logo {
        width: 40px;
        height: 40px;
      }
      .sys-name {
        margin-left: 12px;
      }
    }
    .el-menu {
      border-right: 0;
      font-size: 14px;
      font-family: PingFang SC;
      line-height: normal;
      cursor: pointer;
      background-color: transparent;
      .el-submenu__title {
        font-weight: 600;
        color: #fff;
        &:hover {
          background-color: #356df6;
        }
        &.is-active {
          background-color: #356df6;
        }
      }
      .el-menu-item {
        font-weight: 400;
        color: #fff;

        &:hover {
          background-color: #356df6;
        }
        &.is-active {
          background-color: #356df6;
        }
      }
      .el-submenu {
        .el-menu-item {
          padding-left: 54px !important;
        }
      }
    }
  }
}
</style>
