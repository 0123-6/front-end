<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2023-01-04 14:10:59
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2023-06-12 15:44:41
 * @FilePath: \smart search web\src\views\home-page\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
<!--  <div class="home-container">-->
<!--    <div class="w-full " style="height: calc(100vh - 70px)">-->
<!--      <iframe-->
<!--        src="http://chat.zhishu-tech.com/chat"-->
<!--        frameborder="0"-->
<!--        style="width: 100%; height: 100%"/>-->
<!--    </div>-->
<!--  </div>-->
  <!--最外层-->
  <div class="chat-page tw-w-full tw-flex tw-bg-white">
    <!--左-->
    <div class="tw-w-[240px] tw-min-w-[240px] tw-h-full tw-flex tw-flex-col tw-items-center tw-box-border tw-pt-[16px] tw-bg-white"
         style="box-shadow: 0px 4px 16px 0px rgba(20,38,82,0.02);">
      <!--问经济-->
      <div id="card1"
           class="tw-w-[197px] tw-h-[67px] tw-box-border tw-rounded-lg tw-flex tw-items-center tw-pl-[13px] tw-cursor-pointer"
           @click="changeMenu('economy')">
        <img src="./icon/menu/问经济.svg" alt="" style="width: 42px;height: 42px;">
        <span class="tw-ml-[22px] tw-text-base tw-text-[#333333]">问经济</span>
      </div>
      <!--问企业-->
      <div id="card2"
           class="tw-mt-[7px] tw-w-[197px] tw-h-[67px] tw-box-border tw-rounded-lg tw-flex tw-items-center tw-pl-[13px] tw-cursor-pointer"
           @click="changeMenu('industrial')">
        <img src="./icon/menu/问企业.svg" alt="" style="width: 42px;height: 42px;">
        <span class="tw-ml-[22px] tw-text-base tw-text-[#333333]">问企业</span>
      </div>
      <!--问政策-->
      <div id="card3"
           class="tw-mt-[7px] tw-w-[197px] tw-h-[67px] tw-box-border tw-rounded-lg tw-flex tw-items-center tw-pl-[13px] tw-cursor-pointer"
           @click="changeMenu('policy')">
        <img src="./icon/menu/问政策.svg" alt="" style="width: 42px;height: 42px;">
        <span class="tw-ml-[22px] tw-text-base tw-text-[#333333]">问政策</span>
      </div>
    </div>
    <!--右-->
    <chat-right :key="menu" :type="menu"/>
  </div>
</template>

<script>
import ChatRight from '@/views/chat-page/ChatRight';

export default {
  name: 'ChatPage',
  components: {
    ChatRight
  },
  data() {
    return {
      // 问经济'economy' 问企业'industrial' 问政策'policy'
      menu: 'economy',
      beforePathToMenulist: [
        {
          key: 'economy',
          list: ['economy-monitor', 'economy-target', 'economy-index'],
        },
        {
          key: 'industrial',
          list: ['structural-analysis', 'industry-map', 'comprehensive-comparison', 'industrial-investment'],
        },
        {
          key: 'policy',
          list: ['policy-inquiries', 'policy-documents'],
        }
      ],
    };
  },
  mounted() {
    // 从localStorage中获取beforePath
    const beforePath = localStorage.getItem('beforePath');
    for (let i = 0; i < this.beforePathToMenulist.length; i += 1) {
      if (this.beforePathToMenulist[i].list.find((item) => beforePath.includes(item))) {
        this.menu = this.beforePathToMenulist[i].key;
        break;
      }
    }
    this.changeMenu(this.menu);
  },
  methods: {
    changeMenu(menu) {
      this.menu = menu;
      // 修改背景色,如果menu=economy，则修改card1的背景色；如果menu=industrial，则修改card2的背景色；如果menu=policy，则修改card3的背景色
      // 1.先将所有的背景色修改为白色
      document.getElementById('card1').style.background = 'white';
      document.getElementById('card2').style.background = 'white';
      document.getElementById('card3').style.background = 'white';
      // 2.再将当前点击的背景色修改为悬浮色
      if (menu === 'economy') {
        document.getElementById('card1').style.background = 'linear-gradient(171deg, rgba(255,100,0,0.05) 0%, rgba(255,255,255,0) 100%)';
      } else if (menu === 'industrial') {
        document.getElementById('card2').style.background = 'linear-gradient(171deg, rgba(162,182,255,0.18) 0%, rgba(255,255,255,0) 100%)';
      } else if (menu === 'policy') {
        document.getElementById('card3').style.background = 'linear-gradient(171deg, rgba(255,33,0,0.11) 0%, rgba(255,255,255,0) 100%)';
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import '~@/styles/variables.less';
//.home-container {
//  min-height: 100%;
//  .main-container {
//  }
//}
::v-deep {

}
.chat-page {
  /* 62 = navbar  */
  height: calc(100vh - 62px);
  #card1 {
    background: white;
    // 悬浮色
    &:hover {
      background: linear-gradient(171deg, rgba(255,100,0,0.05) 0%, rgba(255,255,255,0) 100%);
    }
  }
  #card2 {
    background: white;
    // 悬浮色
    &:hover {
      background: linear-gradient(171deg, rgba(162,182,255,0.18) 0%, rgba(255,255,255,0) 100%);
      box-shadow: 0px 2px 8px 0px #FFFFFF;
    }
  }
  #card3 {
    background: white;
    // 悬浮色
    &:hover {
      background: linear-gradient(171deg, rgba(255,33,0,0.11) 0%, rgba(255,255,255,0) 100%);
    }
  }
}
</style>
