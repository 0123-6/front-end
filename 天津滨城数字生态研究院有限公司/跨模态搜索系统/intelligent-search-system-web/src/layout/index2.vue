<template>
  <!--最外层-->
  <div class="w-screen h-screen flex flex-col overflow-auto"
       style="min-width: 1200px;">
    <!--导航栏-->
    <div class="w-full flex justify-between items-center"
         style="height: 60px;background-color:rgba(255,255,255,0.69);border-bottom: 1px solid rgba(228,229,229,1);">
      <!--左和中-->
      <div class="h-full flex">
        <!--左-->
        <div class="flex h-full ml-9" style="width: 314px;" @click="returnHome">
          <img src="@/assets/logo.svg" class="hover:cursor-pointer" style="width: 100%;height: 100%;">
        </div>
        <!--中-->
        <div style="margin-left: 165px;"
             class="h-full flex">
          <!--菜单项-->
          <div style="height: calc(100% - 2px);"
               class="box-content mr-7 pl-6 pr-6 flex items-center text-sm font-semibold hover:cursor-pointer hover:text-blue"
               v-for="(item,index) in menuList"
               :class="[index === activeMenuIndex ? 'text-blue border-b-[2px]' : 'text-black-dark']"
               :key="index"
               @click.stop="changeActiveMenuIndex(index)"
          >
            {{item.title}}
          </div>
        </div>
      </div>
      <!--右-->
      <div style="margin-right: 69px;"
           class="h-full flex items-center">
        <el-popover
          placement="bottom"
          width="90"
          trigger="hover">
          <div class="h-full flex items-center"
               slot="reference">
            <!--图片-->
            <div class="flex outline outline-2 outline-white rounded-full" style="width: 36px;height: 36px;background: #D0DADD;">
              <img src="/img/person.svg" alt="" style="width: 100%;height: 100%;">
            </div>
            <!--文字-->
            <div class="ml-2 flex font-semibold text-sm text-black-dark">
              {{userInfo.nickName}}
            </div>
          </div>
          <!--悬浮内容-->
          <div style="width: 90px;" class="mt-2 flex flex-col text-sm text-black">
            <!--个人中心-->
            <div class="w-full flex justify-center p-2 hover:text-blue hover:bg-color3 hover:cursor-pointer"
                 @click="toPersonCenter">
              个人中心
            </div>
            <!--分割线-->
            <div style="height: 1px;"
                 class="w-full bg-white-divide mt-1 mb-1"></div>
            <!--退出登录-->
            <div class="w-full mb-2 flex justify-center p-2 hover:text-blue hover:bg-color3 hover:cursor-pointer"
                 @click="logout">
              退出登录
            </div>
          </div>
        </el-popover>

      </div>
    </div>
    <!--内容区-->
    <div style="height: calc(100% - 60px);"
         class="w-full bg-white-bg-type2 relative overflow-auto">
      <transition name="fade-transform" mode="out-in">
        <router-view :key="key" />
      </transition>
    </div>
  </div>
</template>

<script>
import { getAllDictData, logout } from '@/api/common';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'index2',
  data() {
    return {
      // 菜单列表
      menuList: [
        { title: '首页', link: '/home/index' },
        { title: '高级搜索', link: '/search/index' },
        { title: '模型库', link: '/library' },
        { title: '管理', link: '/system' }
      ],
      // 激活的菜单项
      activeMenuIndex: 0,
      // 用户信息
      userInfo: {
        roleId: 1
      },
      // 待修改
      circleUrl: '/img/person.svg'
    };
  },
  computed: {
    key() {
      return this.$route.path;
    }
  },
  created() {
    this.getUserInfo();
  },
  mounted() {
    this.setMenuActiveIndex();
    this.getAllDictData();
  },
  // updated() {
  //   this.getUserInfo();
  //   this.setMenuActiveIndex();
  // },
  methods: {
    // 获取用户信息
    getUserInfo() {
      this.userInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
      if (this.userInfo.roleId !== 1) {
        this.menuList.pop();
      }
    },
    // 设置导航栏activeIndex
    setMenuActiveIndex() {
      const routePath = this.$route.path;
      if (routePath.indexOf('/home/index') !== -1) {
        this.activeMenuIndex = 0;
      } else if (routePath.indexOf('/search/index') !== -1) {
        this.activeMenuIndex = 1;
      } else if (routePath.indexOf('/library') !== -1) {
        this.activeMenuIndex = 2;
      } else if (routePath.indexOf('/system') !== -1) {
        this.activeMenuIndex = 3;
      } else {
        this.activeMenuIndex = -1;
      }
    },
    // 返回首页
    returnHome() {
      if (this.$route.path !== '/home/index') {
        this.$router.replace({
          name: 'HomePage'
        });
      }
    },
    // 修改activeIndex值
    changeActiveMenuIndex(index) {
      if (this.activeMenuIndex !== index) {
        // 通过点击菜单栏进入高级搜索，不带入历史记录
        this.activeMenuIndex = index;
        this.$router.replace(this.menuList[this.activeMenuIndex].link);
      }
    },
    getAllDictData() {
      getAllDictData().then((res) => {
        if (res.code === '000000') {
          res.data.forEach((item) => {
            if (item.dictCode === 'location') {
              this.$store.commit('Common/ADD_LOCATION_DICT', item.itemList);
            }
            if (item.dictCode === 'orientation') {
              this.$store.commit('Common/ADD_ORIENTATION_DICT', item.itemList);
            }
            if (item.dictCode === 'device_type') {
              this.$store.commit('Common/ADD_DEVICE_TYPE_DICT', item.itemList);
            }
            if (item.dictCode === 'protocol_type') {
              this.$store.commit('Common/ADD_PROTOCOL_TYPE_DICT', item.itemList);
            }
          });
        } else {
          //
        }
      });
    },
    // 待修改
    toPersonCenter() {
      this.$router.replace('/personal-center');
    },
    logout() {
      const params = {};
      logout(params).then((res) => {
        if (res.code === '000000') {
          sessionStorage.clear();
          this.$router.replace('/login');
        }
      });
    }
  }
};
</script>

<style scoped>

</style>
