<!--
* @Author: srcheng 17755456856@163.com
* @Date: 2023-07-18 14:04:17
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2023-07-19 10:44:23
* @FilePath: \industrial-economic-platform\src\views\person-center-page\index.vue
* @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="home-container">
    <div class="main-container">
      <el-container>
        <el-aside width="240px">
          <el-menu :default-active="setDefaultActive()" router>
            <el-menu-item v-for="item of menuList" :index="item.path" :key="item.path">
              <svg-icon :icon-class="setDefaultActive() === item.path ? item.icon + '-active' : item.icon"></svg-icon>
              {{ item.menuName }}</el-menu-item
            >
          </el-menu>
        </el-aside>
        <el-main style="height: calc(100vh - 62px)">
          <router-view></router-view>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PersonCenter',
  data() {
    return {
      menuList: [
        { menuName: '个人信息', path: '/person-center/person-message', icon: 'person-message' },
        { menuName: '所属机构', path: '/person-center/person-company', icon: 'person-company' },
        { menuName: '关注企业', path: '/person-center/follow-company', icon: 'follow-company' }
        // { menuName: '用户管理', path: '/person-center/user-manager', icon: 'user-manager' },
        // { menuName: '角色管理', path: '/person-center/role-manager', icon: 'role-manager' }
      ]
    };
  },
  mounted() {},
  methods: {
    setDefaultActive() {
      return this.$route.path;
    }
  }
};
</script>

<style lang="less" scoped>
@import '~@/styles/variables.less';
.home-container {
  min-height: 100%;
  .main-container {
    .el-aside {
      background-color: #ffffff;
      box-shadow: 5px 0px 16px rgba(20, 38, 82, 0.07);
      ::v-deep {
        .el-menu {
          height: calc(100vh - 64px);
          & > .el-menu-item {
            color: #1a262c;
            margin-top: 10px;
            font-size: 14px;
            font-weight: 500;
            height: 36px;
            line-height: 36px;
            padding-left: 20px;
            &.is-active {
              color: @primary-color;
              background-color: rgba(53, 109, 246, 0.2);
              border-right: 2px solid @primary-color;
            }
            .svg-icon {
              margin-right: 10px;
            }
          }
        }
      }
    }
    .el-main {
      padding: 0;
    }
  }
}
</style>
