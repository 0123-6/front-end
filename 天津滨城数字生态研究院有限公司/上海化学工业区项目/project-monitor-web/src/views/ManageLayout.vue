<template>
  <el-container class="ManageLayout full-vh">
    <el-aside class="ManageLayout__aside" width="224px">
      <div class="ee-title mt20 ml20">
        <span class="ee-title__text">管理中心</span>
      </div>
      <div class="mt24"></div>
      <el-menu :default-active="activeIndex" router>
        <template v-for="n in menus" :key="n.index">
          <el-sub-menu v-if="n.children && n.children.length > 0" :index="n.index">
            <template #title>
              <svg-icon :icon="n.icon" width="16px" height="16px" />
              <span class="ml4">{{ n.title }}</span>
            </template>
            <el-menu-item v-for="c in n.children" :key="c.index" :index="c.index">{{ c.title
            }}</el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="n.index">
            <svg-icon :icon="n.icon" width="16px" height="16px" />
            <span class="ml4">{{ n.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>
    <el-main class="ManageLayout__main">
      <router-view v-slot="{ Component }">
        <keep-alive :include="include">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </el-main>
  </el-container>
</template>

<script>
import useUserStore from '@/store/modules/user'
const config = {
  'FlowList': '/flow',
  'FlowDetail': '/flow',
  'UserList': '/user/list',
  'UserRole': '/user/role',
}
let baseMenus = [
  {
    title: '流程模板',
    index: '/flow',
    icon: 'flow',
    name: 'flow_template'
  },
  {
    title: '成员列表',
    index: '/user/list',
    name: 'user_list',
    icon: 'manage',
  },
  {
    title: '角色权限',
    index: '/user/role',
    name: 'role_auth',
    icon: 'role',
  }
]
export default {
  name: 'ManageLayout',
  data() {
    return {
      include: [
        'FlowList',
        'UserList',
        'RoleList',
      ],
    }
  },
  computed: {
    activeIndex() {
      return config[this.$route.name]
    },
    menus() {
      const permissions = useUserStore().permissions
      const menus = baseMenus.filter(n => permissions.findIndex(p => p.code === n.name) > -1)
      menus.forEach(m => {
        if (m.children)
          m.children = m.children.filter(n => permissions.findIndex(p => p.code === n.name) > -1)
      })
      return menus
    }
  },
}

</script>
<style lang='scss'>
.ManageLayout {
  &__aside {
    background: #fff;
    box-shadow: 0px 0px 16px rgba(20, 38, 82, 0.07);

    .el-menu {
      border-right: none;
    }
  }

  &__main {
    padding: 0;
  }

  .el-menu-item,
  .el-sub-menu__title {
    --el-menu-item-height: 36px;
    margin-top: 8px;
    margin-left: 20px;
    border-top-left-radius: 18px;
    border-bottom-left-radius: 18px;


    &:hover {
      background: rgba(2, 173, 236, 0.1);
    }

    &.is-active {
      border-right: 2px solid #02ADEC;
      background: rgba(2, 173, 236, 0.1);
    }
  }

  .el-sub-menu {
    .el-menu-item {
      --el-menu-sub-item-height: 36px;
    }
  }
}
</style>