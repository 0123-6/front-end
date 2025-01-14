<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <div class="flex align-center">
            <img :src="setImage(onlyOneChild, item)" alt="" class="margin-right-8">
            <span class="title-container">{{ onlyOneChild.meta.title }}</span>
          </div>
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <div v-if="item.meta" class="flex align-center">
          <img :src="item.meta && item.meta.icon" alt="" class="margin-right-8">
          <span>{{ item.meta.title }}</span>
        </div>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path';
import { isExternal } from '@/utils/validate';
import AppLink from './Link';
import FixiOSBug from './FixiOSBug';

export default {
  name: 'SidebarItem',
  components: { AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null;
    return {};
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false;
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item;
          return true;
        }
      });

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true;
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true };
        return true;
      }

      return false;
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath;
      }
      if (isExternal(this.basePath)) {
        return this.basePath;
      }
      return path.resolve(this.basePath, routePath);
    },
    setImage(onlyOneChild, item) {
      let iconImage = '';
      if (onlyOneChild.meta.icon) {
        iconImage = this.$route.fullPath === this.resolvePath(onlyOneChild.path) ? onlyOneChild.meta.activeIcon : onlyOneChild.meta.icon;
      } else {
        iconImage = this.$route.fullPath === this.resolvePath(onlyOneChild.path) ? item.meta && item.meta.activeIcon : item.meta && item.meta.icon;
      }
      return iconImage;
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep {
  .router-link-active {
    display:block;
    background: rgba(1,100,255,0.16);
    position: relative;
    .title-container {
      color: rgb(1, 100, 255);
    }
    &::after {
      content: " ";
      width: 2px;
      height: 50px;
      background: #0164FF;
      display: inline-block;
      position: absolute;
      right: 0;
      top: 0;
    }
    .el-menu-item:hover, .el-menu-item:focus {
      background-color: transparent;
    }
  }
}
</style>
