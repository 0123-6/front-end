<template>
  <div class="sidebar flex-y-center jc-around pdb4 full-h y-auto">
    <svg-icon icon-class="logo" width="72px" height="22px" color="#fff" />
    <div class="menus flex-y-center full-w">
      <div v-for="n in menus" :key="n.name" :class="{ 'is-active': activeMenu === n.name }"
        class="menus-item flex-y-center mt16 pointer" @click="handleRoute(n)">
        <svg-icon :icon-class="n.icon" width="34px" height="34px" color="#fff" />
        <div class="menus-item__name mt4 f500">{{ n.title }}</div>
      </div>
    </div>
    <div class="userbar flex-y-center mt4 full-w">
      <div v-if="hasPermission('message_notify')" class="tool relative pd4 pointer radius4"
        @click="$router.push('/message')">
        <svg-icon icon-class="bell" width="28px" height="28px" color="#fff" />
        <div v-if="unreadNum > 0" class="dot text-center ddin">{{ unreadNum > 9 ? '9+' : unreadNum }}</div>
      </div>
      <div class="tool relative mt24 pd4 pointer radius4" @click="$router.push('/help')">
        <svg-icon icon-class="help" width="28px" height="28px" color="#fff" />
      </div>
      <div class="mt24 flex-y-center">
        <el-popover placement="right" :width="100" trigger="hover" popper-class="pd0 mine-popover">
          <template #reference>
            <img class="avatar" :src="info.url || defaultAvatar">
          </template>
          <el-menu class="border0" style="--el-menu-item-height:30px;--el-menu-base-level-padding:12px;padding:4px 0;">
            <el-menu-item @click="$router.push('/person-center')">
              <svg-icon icon-class="mine" width="14px" height="14px" />
              <span class="ml4">个人中心</span>
            </el-menu-item>
            <el-menu-item
              v-if="hasPermission('flow_template') || hasPermission('user_list') || hasPermission('role_auth')" index="2"
              @click="goManage">
              <svg-icon icon-class="manage" width="14px" height="14px" />
              <span class="ml4">管理中心</span>
            </el-menu-item>
            <el-menu-item @click="handleLogout">
              <svg-icon icon-class="logout" width="14px" height="14px" />
              <span class="ml4">退出登录</span>
            </el-menu-item>
          </el-menu>
        </el-popover>
        <div class="username mt4 f16 f500 ell">{{ info.realName }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import useUserStore from '@/store/modules/user'
import useMessageStore from '@/store/modules/message'
import defaultAvatar from '@/assets/images/avatar.svg'

const baseMenus = [
  { name: 'home', title: '首页', icon: 'home', path: '/index' },
  { name: 'project_manage', title: '项目管理', icon: 'project', path: '/project' },
  { name: 'project_analysis', title: '项目态势', icon: 'trend', path: '/analysis' },
  { name: 'performence', title: '绩效管理', icon: 'kpi', path: '/check' },
  { name: 'knowledge', title: '知识库', icon: 'policy-fill', path: '/policy' },
]

export default {
  name: 'Sidebar',
  data() {
    return {
      defaultAvatar
    }
  },
  computed: {
    ...mapState(useMessageStore, ['unreadNum']),
    ...mapState(useUserStore, ['info', 'permissions']),
    activeMenu() {
      return this.menus.find(n => this.$route.path.indexOf(n.path) > -1)?.name
    },
    menus() {
      return baseMenus.filter(n => this.permissions.findIndex(p => p.code === n.name) > -1)
    }
  },
  methods: {
    hasPermission(code) {
      return this.permissions.findIndex(p => p.code === code) > -1
    },
    handleRoute(obj) {
      this.$router.push(obj.path)
    },
    goManage() {
      this.$router.push({
        path: this.hasPermission('flow_template') ? '/flow' : this.hasPermission('user_list') ? '/user/list' : '/user/role'
      })
    },
    handleLogout() {
      this.$confirm(
        '确认退出登录吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          useUserStore().logOut().then(() => {
            this.$router.replace('/login')
          })
        })
        .catch(() => { })
    }
  }
}
</script>

<style lang="scss">
.sidebar {
  width: 120px;
  background: #3478A9;

  .menus {
    &-item {
      padding: 8px 0;
      width: 80px;
      color: #fff;
      opacity: 0.5;
      transition: all .2s;

      &:hover,
      &.is-active {
        opacity: 1;
      }
    }
  }

  .userbar {
    .tool {
      transition: all .2s;
      font-size: 0;

      &:hover {
        background: rgba(255, 255, 255, .1);
      }

      .dot {
        position: absolute;
        top: 0;
        right: 0;
        width: 18px;
        height: 18px;
        line-height: 18px;
        border-radius: 100%;
        background: #EA5455;
        font-size: 12px;
        color: #fff;
      }
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 100%;
    }

    .username {
      padding: 0 5px;
      color: #FFF;
      max-width: 120px;
    }
  }
}

.mine-popover {
  min-width: 104px !important;
  border: none !important;
  box-shadow: 0px 0px 16px rgba(20, 38, 82, 0.07) !important;

  .el-menu {
    border-radius: 8px !important;

    &-item {
      color: #1a262c;

      &:hover {
        background: #F8F8F8;
      }
    }
  }
}

@media screen and (max-height: 700px) {
  .sidebar {
    .menus-item__name {
      display: none;
    }
  }
}
</style>
