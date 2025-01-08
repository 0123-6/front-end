<template>
  <div
    id="AiHeader-container"
    class="flex justify-between align-center"
    style="
      width: 100%;
      height: 60px;
      min-height: 60px;
      background: #19233e;
      box-shadow: 0 4px 8px 0 rgba(232, 236, 240, 1);
    "
  >
    <!--左-->
    <div
      class="flex align-center margin-left-20 hand"
      style="height: 100%"
      @click="returnHome"
    >
      <img src="../../assets/pic/logo_cai.svg" alt="">
      <span
        class="font-size-16 font-weight margin-left-8"
        style="color: #e4eaf3"
      >智能模型操作系统
      </span>
    </div>
    <!--右-->
    <div class="flex align-center" style="height: 100%; margin-right: 36px">
      <!--右正常-->
      <div class="flex align-center hand header-right-menu">
        <div
          class="flex justify-center align-center img-circle header-right-menu"
          style="
            background: #d8d8d8;
            border: 2px solid rgba(233, 233, 233, 1);
            width: 36px;
            height: 36px;
            overflow: hidden;
          "
        >
          <img
            :src="avatar"
            alt=""
            class="header-right-menu"
            style="width: 100%; height: 100%"
          >
        </div>
        <span
          class="font-size-14 font-weight-500 margin-left-8 header-right-menu"
          style="color: #d6d9dc"
        >{{ name }}
        </span>
        <span
          v-if="!showProfile"
          class="el-icon-caret-bottom header-right-menu"
          style="color: #d8d8d8"
        />
        <span
          v-if="showProfile"
          class="el-icon-caret-top header-right-menu"
          style="color: #d8d8d8"
        />
      </div>
      <!--右悬浮-->
      <div
        v-if="showProfile"
        class="flex flex-direction color-white bgc-white"
        style="
          position: absolute;
          top: 68px;
          right: 16px;
          width: 210px;
          box-shadow: 0 2px 17px 0 rgba(161, 151, 151, 0.5);
          border-radius: 4px;
          z-index: 9999;
        "
      >
        <!--头像-->
        <div
          class="
            flex
            align-center
            margin-top-16
            padding-left-16 padding-right-16
          "
          style="width: 100%; height: 50px"
        >
          <div
            style="
              width: 48px;
              height: 48px;
              background: #d8d8d8;
              border: 2px solid rgba(233, 233, 233, 1);
              overflow: hidden;
            "
            class="flex justify-center align-center img-circle"
          >
            <img
              :src="avatar"
              alt=""
              style="width: 100%; height: 100%"
            >
          </div>
          <div
            class="flex flex-direction justify-around margin-left-16"
            style="height: 100%"
          >
            <span class="flex font-size-14 color-content">{{ name }}</span>
            <div
              class="flex justify-center align-center"
              style="
                width: 74px;
                height: auto;
                line-height: 18px;
                background: #efefef;
                border-radius: 8.5px;
              "
            >
              <span class="flex font-size-12 color-title-2">{{ roleName }}</span>
            </div>
          </div>
        </div>
        <!--个人中心-->
        <div
          class="flex align-center margin-top-8 hand hover-bgc-1"
          style="width: 100%; height: 32px"
          @click="goPersonCenter"
        >
          <span
            class="flex font-size-14 color-content"
            style="margin-left: 18px"
          >个人中心
          </span>
        </div>
        <!--退出-->
        <div
          class="
            flex
            align-center
            margin-top-8 margin-bottom-8
            hand
            hover-bgc-1
          "
          style="width: 100%; height: 32px"
          @click="logout"
        >
          <span
            class="flex font-size-14 color-content"
            style="margin-left: 18px"
          >退出
          </span>
        </div>
      </div>
    </div>
    <generator-dialog v-if="isMessageDialog" :width="400" title="提示" @ok="saveLogout" @cancel="cancelLogout">
      <template slot="content">
        <div style="width: 100%;height: 110px;" class="flex justify-center align-center">确定退出系统吗?</div>
      </template>
    </generator-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import GeneratorDialog from '@/views/permission-management/user-management/components/GeneratorDialog';
export default {
  name: 'AiHeader',
  components: { GeneratorDialog },
  data() {
    return {
      showProfile: false, // 展示个人中心
      isMessageDialog: false
    };
  },
  computed: {
    ...mapGetters(['name', 'avatar', 'roleName'])
  },
  mounted() {
    // 绑定enter事件
    this.enterKeyup();
  },
  destroyed() {
    // 销毁enter事件
    this.enterKeyupDestroyed();
  },
  methods: {
    // 退出
    logout() {
      this.showProfile = false;
      this.isMessageDialog = true;
      // this.$confirm('确定注销并退出系统吗？', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   this.$store.dispatch('user/logout').then(() => {
      //     this.$router.push('/login');
      //   });
      // });
    },
    saveLogout() {
      this.$store.dispatch('user/logout').then(() => {
        this.isMessageDialog = false;
        this.$router.push('/login');
      });
    },
    cancelLogout() {
      this.isMessageDialog = false;
    },
    returnHome() {
      this.$router.push('/model-base');
    },
    // 去个人中心
    goPersonCenter() {
      this.$router.push('/personal-center');
    },
    // enter事件销毁
    enterKeyupDestroyed() {
      document.removeEventListener('click', (ev) => { this.enterKey(ev); });
    },
    // enter事件注册
    enterKeyup() {
      document.addEventListener('click', (ev) => { this.enterKey(ev); });
    },
    enterKey(e) {
      const classList = e.target.classList;
      if (classList.contains('header-right-menu')) {
        this.showProfile = !this.showProfile;
      } else {
        this.showProfile = false;
      }
    }
  }
};
</script>

<style scoped>
.hover-bgc-1:hover {
  background-color: #f5f7fa;
}
</style>
