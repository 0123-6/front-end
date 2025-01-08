<template>
  <div class="app-wrapper">
    <div class="right-content">
      <navbar ref="navBar" />
    </div>
    <div class="left-content" :class="{ 'is-collapse': isCollapse }">
      <div class="top-nav">
        <i class="left-collapse el-icon-s-fold" @click="handleCollapse"></i>
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <span class="avatar-name">{{ USER_INFO?.nickname || 'admin' }}</span>
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <el-dropdown-item @click.native="logout">
              <span style="display: block">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <!--      <div class="tag-container">-->
      <!--        <el-tag size="large" v-for="tag in ROUTER_TAGS" :key="tag.path" @click="handleTagClick(tag)" @close="handleTagClose(tag, $event)" closable>-->
      <!--          {{ tag.title }}-->
      <!--        </el-tag>-->
      <!--      </div>-->
      <app-main />
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex';
import { AppMain, Navbar } from '@/layout/components';
import { logout } from '@/api/common';

export default {
  name: 'Layout-page',
  components: {
    Navbar,
    AppMain
  },
  data() {
    return {
      isCollapse: false
    };
  },
  computed: {
    ...mapGetters(['ROUTER_TAGS', 'USER_INFO', 'TOKEN'])
  },
  mounted() {
    // console.log(this.ROUTER_TAGS, 'ROUTER_TAGS');
  },
  methods: {
    handleCollapse() {
      this.isCollapse = !this.isCollapse;
      this.$refs.navBar.isCollapse = this.isCollapse;
    },
    logout() {
      // this.$store.commit('Common/ADD_TOKEN', '');
      // sessionStorage.clear();
      // this.$router.push('/login');
      // this.$message.success('退出成功');
      logout().then((res) => {
        if (res.code === '00000') {
          this.$store.commit('Common/ADD_TOKEN', '');
          this.$store.commit('Common/ADD_USER_INFO', {});
          this.$store.commit('Common/CLEAR_ROUTER_TAG');
          sessionStorage.clear();
          this.$router.push('/login');
          // this.$message.success('退出成功');
        }
      });
    },
    handleTagClick(tag) {
      if (tag.path === this.$route.path) return;
      this.$router.push(tag.path);
    },
    handleTagClose(tag, event) {
      if (this.ROUTER_TAGS.length === 1) return;
      event.stopPropagation();
      this.$store.commit('Common/REMOVE_ROUTER_TAG', tag);
      if (this.ROUTER_TAGS[this.ROUTER_TAGS.length - 1].path === this.$route.path) return;
      this.$router.push(this.ROUTER_TAGS[this.ROUTER_TAGS.length - 1].path);
    }
  }
};
</script>
<style lang="less" scoped>
@import '~@/styles/variables.less';
.app-wrapper {
  display: flex;
  flex-direction: row;
  width: 100vw;
  min-width: 1300px;
  min-height: 600px;
  overflow-x: auto;
  position: relative;
  background: @background-color;
  .left-collapse {
    padding: 8px;
    margin-left: 16px;
    font-size: 20px;
    cursor: pointer;
    transition: transform 0.5s;
  }
  .left-content {
    width: calc(100% - 244px);
    background: #f8f9fb;
    transition: width 0.2s;
    &.is-collapse {
      width: calc(100vw - 80px);
      .left-collapse {
        transform: rotate(180deg);
      }
    }
    .top-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60px;
      background: #fff;
      box-shadow: 0 0 16px 0 rgba(20, 38, 82, 0.07);
      .avatar-container {
        margin-right: 20px;
        .avatar-wrapper {
          display: flex;
          align-items: center;
          cursor: pointer;
          .avatar-name {
            margin-right: 10px;
          }
        }
      }
    }
    .tag-container {
      margin: 16px 24px 24px;
      ::v-deep .el-tag {
        color: #356df6;
        font-size: 14px;
        font-family: PingFang SC;
        font-style: normal;
        font-weight: 400;
        margin-right: 10px;
        background-color: #fff;
        border-color: #e9eef3;
        border-radius: 6px;
        box-shadow: 0 0 8px 0 rgba(20, 38, 82, 0.07);
        cursor: pointer;
        .el-tag__close {
          color: #bfbfbf;
          font-size: 14px;
          font-family: PingFang SC;
          font-style: normal;
          font-weight: 400;
          &:hover {
            color: #bfbfbf;
          }
        }
      }
    }
  }
}
</style>
