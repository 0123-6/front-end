<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-11-11 09:07:54
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-11-22 15:03:43
 * @FilePath: \company-template\src\views\system-manager\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="system-manager-container">
    <el-container>
      <el-aside width="200px">
        <el-menu :default-active="setDefaultActive()" router :active-text-color="'#0C61AA'">
          <el-menu-item v-for="item of systemMenuList" :key="item.link" :index="item.link">
            <svg-icon
              :class-name="$route.path.indexOf(item.link) >= 0 ? item.iconClass + '-active-icon' : item.iconClass + '-normal-icon'"
              :icon-class="$route.path.indexOf(item.link) >= 0 ? item.iconClass + '-active': item.iconClass + '-normal'"
            />
            <span slot="title">{{item.title}}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>
<script>
export default {
  name: 'system-manger',
  data() {
    return {
      systemMenuList: [
        { title: '模型管理', link: '/system/model', iconClass: 'model' },
        { title: '监控点管理', link: '/system/device', iconClass: 'device' },
        { title: '用户管理', link: '/system/user', iconClass: 'user' }
      ]
    };
  },
  methods: {
    setDefaultActive() {
      if (this.$route.path.indexOf('/system/device') === 0) {
        return '/system/device';
      }
      if (this.$route.path.indexOf('/system/user') === 0) {
        return '/system/user';
      }
      return this.$route.path;
    }
  }
};
</script>
<style lang="less" scoped>
.system-manager-container {
  width: 100%;
  height: 100%;
  position: absolute;
  .el-container {
    height: 100%;
    .el-aside {
      border-right: 1px solid #E4E5E5;
      .el-menu {
        border: none;
        height: 100%;
        .el-menu-item {
          border-radius: 4px;
          height: 44px;
          line-height: 44px;
          width: 180px;
          margin: 0 auto;
          &:focus {
            border: none !important;
          }
          &.is-active {
            background-image: linear-gradient(116deg, rgba(12,97,170,0.13) 0%, rgba(12,97,170,0.01) 100%);
            border: 1px solid rgba(255,255,255,1);
          }
        }
        .svg-icon {
          display: inline-block !important;
          margin-right: 8px;
          position: relative;
          top: 1px;
        }
      }
    }
    .el-main {
      padding: 12px;
      background: #f7fbfd;
    }
  }
}
</style>
