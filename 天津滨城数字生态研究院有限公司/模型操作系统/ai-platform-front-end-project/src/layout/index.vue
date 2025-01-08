<template>
  <div :class="classObj" class="app-wrapper flex flex-direction">
    <!--头部-->
    <ai-header />
    <!--主体-->
    <div class="flex flex-1" style="width: 100%;">
      <!--左-->
      <div class="flex flex-direction bgc-white box-shadow-1" style="width: 205px;height: 100%;overflow: auto;">
        <!--        <sidebar class="sidebar-container" />-->
        <div class="flex flex-direction " style="width: 100%;min-height: 100%;">
          <!--          <el-scrollbar wrap-class="scrollbar-wrapper">-->
          <!--            <el-menu-->
          <!--              :default-active="activeMenu"-->
          <!--              :collapse="isCollapse"-->
          <!--              :text-color="variables.menuText"-->
          <!--              :active-text-color="variables.menuActiveText"-->
          <!--              :collapse-transition="false"-->
          <!--              mode="vertical"-->
          <!--            >-->

          <!--            </el-menu>-->
          <!--          </el-scrollbar>-->

          <el-menu
            style="border-right: none;"
            class="font-size-14 font-weight-500 my-1"
            text-color="#262626"
            active-text-color="#0164FF"
            :default-active="activeMenu"
            :default-openeds="defaultOpened"
            @open="handleOpen"
            @close="handleClose"
          >
            <sidebar-item v-for="route in menuList" :key="route.path" :item="route" :base-path="route.path" />
          </el-menu>
        </div>
      </div>
      <!--右-->
      <div class="flex flex-direction bgc-main"
           style="width: calc(100% - 205px);height: 100%;">
        <!--主体-->
        <div
          id="layout-container"
          ref="Systemcontains"
          v-loading="loading"
          style="width: 100%;height: calc(100% - 50px);overflow: auto;"
          @mousedown="mouseDownHandler"
          @mouseup="mouseUpHandler"
          @mousemove="mouseMoveHandler"
        >
          <transition name="fade-transform" mode="out-in">
            <!--            <keep-alive>-->
            <router-view />
            <!--            </keep-alive>-->
          </transition>
        </div>
        <!--备案-->
        <div class="flex justify-center align-center"
             style="width: 100%;height: 50px;min-height: 50px;">
          <record-com></record-com>
        </div>
      </div>
    </div>
    <!--  防止刷新后主题丢失  -->
    <Theme v-show="false" ref="theme" />
  </div>
</template>

<script>
import ResizeMixin from './mixin/ResizeHandler';
import { mapState } from 'vuex';
import Theme from '@/components/ThemePicker';
import Cookies from 'js-cookie';

import { mapGetters } from 'vuex';
import variables from '@/styles/variables.scss';
import SidebarItem from '@/layout/components/Sidebar/SidebarItem';
import AiHeader from '@/layout/components/AiHeader';
import RecordCom from '@/components/RecordCom';

export default {
  name: 'Layout',
  components: {
    RecordCom,
    AiHeader,
    Theme,
    SidebarItem
  },
  mixins: [ResizeMixin],
  data() {
    return {
      defaultOpened: [],
      loading: false,
      mouseFlag: false,
      mouseOffset: 0
    };
  },
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // },
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    ...mapGetters([
      'sidebar', 'menuList'
    ]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
    classObj() {
      return {
        // hideSidebar: !this.sidebar.opened,
        hideSidebar: false,
        // openSidebar: this.sidebar.opened,
        openSidebar: true,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      };
    }
  },
  watch: {
    $route(to, form) {
      if ((to.fullPath !== '/model-base-detail/index/99999999') && (form.fullPath === '/model/create-model/:id')) {
        // sessionStorage.removeItem('SET_PREVIEW_INFO')
        this.$store.commit('SET_PREVIEW_INFO', {});
      }
    }
  },
  mounted() {
    if (Cookies.get('theme')) {
      this.$refs.theme.theme = Cookies.get('theme');
      this.$store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: Cookies.get('theme')
      });
    }
    this.defaultOpened = [this.$route.matched[0].path];
  },
  methods: {
    // 页面鼠标按下滚动 开始
    // 按下鼠标记录鼠标位置
    mouseDownHandler(e) {
      this.mouseOffset = e.clientX;
      this.mouseFlag = true;
    },
    mouseUpHandler(e) {
      this.mouseFlag = false;
    },
    mouseMoveHandler(e) {
      if (!this.$refs.Systemcontains) return;
      const divData = this.$refs.Systemcontains;
      if (this.mouseFlag) {
        // 设置水平方向的元素的位置
        divData.scrollLeft -= (-this.mouseOffset + (this.mouseOffset = e.clientX));
      }
    },
    // 表格鼠标按下滚动 结束
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    }
    // handleClickOutside () {
    //   this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    // }
  }
};
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
    padding: 0;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
