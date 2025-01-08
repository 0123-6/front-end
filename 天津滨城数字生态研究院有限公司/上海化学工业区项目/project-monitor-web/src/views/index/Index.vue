<template>
  <!--最外层-->
  <div class="index w-full flex flex-col relative text-sm">
    <!--静态图片-->
    <img src="./icon/bg3.webp" alt="" class="w-full h-[300px] absolute top-0 object-cover">
    <!--悬浮设置按钮-->
    <div
      class="z-20 w-[42px] hover:w-[138px] h-[42px] absolute top-[92px] right-[40px] flex justify-center items-center bg-main border-2 border-white rounded-[24px] cursor-pointer group"
      style="transition: all 0.3s;" @click="showSettingDrawer = true">
      <img src="./icon/settingSvg.svg" alt="" class="px-1.5 flex-shrink-0">
      <span class="mr-3 text-white font-medium overflow-hidden whitespace-nowrap hidden group-hover:flex"
        style="transition: all 0.3s;">首页显示设置</span>
    </div>
    <!--正文-->
    <div class="flex flex-col items-center z-10">
      <!--标题-->
      <div class="mt-[50px] flex items-center flex-shrink-0">
        <svg-icon class-name="logo" icon-class="logo" width="106px" height="33px" color="#fff"
          style="margin-right: 19px;min-width: 106px;" />
        <span class="text-white font-medium text-[38px] leading-[53px]">建设项目全周期监测应用</span>
      </div>
      <!--搜索框-->
      <div class="mt-8 w-[57.36%] min-w-[826px] h-[76px] leading-[76px]">
        <el-input class="search-input w-full h-full" style="font-size: 18px;" v-model="keyword" type="text" size="large"
          auto-complete="off" :placeholder="searchMode === '搜项目' ? '请输入项目代码、项目名称、项目单位、项目联系人关键词' : '支持对政策标题和正文的关键词搜索'"
          @keydown.enter.native="handleSearch">
          <template #prefix>
            <el-dropdown @command="handleCommand">
              <span class="mr-2 flex justify-center items-center">
                <span class="text-[#373737] font-medium text-lg">{{ searchMode }}</span>
                <el-icon class="el-icon--right">
                  <arrow-down color="#373737" />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="搜项目">搜项目</el-dropdown-item>
                  <el-dropdown-item command="搜知识库">搜知识库</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template #suffix>
            <el-button type="primary" style="font-size: 18px;" size="large" @click.prevent="handleSearch">搜索
            </el-button>
          </template>
        </el-input>
      </div>
      <!--滚动预警区域-->
      <div v-if="data?.scrollingDataList && data?.scrollingDataList.length > 0 && false"
        class="mt-[31px] w-full h-[58px] px-5 flex justify-between items-center bg-[rgba(41,55,76,0.80)] hover:bg-[rgba(73,88,112,0.80)]"
        @mouseenter="clearScrollTimer" @mouseleave="startScrollTimer">
        <!--左,总共有3种情况，项目延期'4'，环节暂停'2'，环节正常推进'1'-->
        <div class="flex items-center">
          <!--标签-->
          <div class="h-[28px] px-2.5 rounded-lg flex items-center" :class="[
            data.scrollingDataList[scrollingDataIndex].stepStatus == '4' ? 'bg-red' : '',
            data.scrollingDataList[scrollingDataIndex].stepStatus == '2' ? 'bg-yellow' : '',
            data.scrollingDataList[scrollingDataIndex].stepStatus == '1' ? 'bg-green' : '',
          ]">
            <span class="text-sm font-medium leading-5 text-white">{{
              scrollMap[data.scrollingDataList[scrollingDataIndex].stepStatus].label1 }}</span>
          </div>
          <!--名称-->
          <span class="ml-[14px] text-white text-base font-medium leading-6 cursor-pointer hover:text-main"
            @click="clickScrollingItem(scrollingDataIndex)">{{ data.scrollingDataList[scrollingDataIndex].projectName
            }}</span>
          <!--提示-->
          <span class="ml-[70px] text-sm leading-5" style="color: rgba(255, 255, 255, 0.70);">{{
            scrollMap[data.scrollingDataList[scrollingDataIndex].stepStatus].label2 }}</span>
          <!--阶段+环节-->
          <span class="text-white text-sm leading-6">{{ '【' + data.scrollingDataList[scrollingDataIndex].periodName + '】'
          }}
            {{ data.scrollingDataList[scrollingDataIndex].currentStepName }}</span>
          <!--已延期-->
          <div v-if="data.scrollingDataList[scrollingDataIndex].stepStatus == '4'"
            class="ml-[70px] flex items-center gap-x-1.5">
            <span class="text-sm leading-5" style="color: rgba(255, 255, 255, 0.70);">已延期:</span>
            <span class="ddin-n text-red font-bold text-xl leading-[22px]">{{
              data.scrollingDataList[scrollingDataIndex].dayNum }}</span>
            <span class="text-sm leading-5" style="color: rgba(255, 255, 255, 0.70);">天</span>
          </div>
        </div>
        <!--右-->
        <div class="flex items-center cursor-pointer text-white hover:text-main" @click="goMoreWarning">
          <span class="text-sm leading-6">更多通知</span>
          <img src="./icon/RightArrowSvg.svg" alt="" class="ml-1.5 w-[14px] h-[14px]">
        </div>
      </div>
      <!--滚动预警区域不存在时的占位-->
      <div v-if="!(data?.scrollingDataList && data?.scrollingDataList.length > 0 && false)"
        class="mt-[31px] w-full h-[58px]"></div>
      <!--加载部分-->
      <div class="w-full px-5 flex flex-col" v-loading="loading" style="min-height: calc(100vh - 211px);">
        <!--功能面板-->
        <div v-if="(data?.featurePanelIsShow && data?.featurePanelRespList?.length > 0)"
          class="mt-5 w-full flex flex-col">
          <!--功能面板标题-->
          <title-comp title="功能面板" :type="1" />
          <!--功能面板内容-->
          <div class="mt-4 grid gap-x-6 gap-y-6" :class="[
            panelList.length === 1 ? 'grid-cols-1' : '',
            panelList.length === 2 ? 'grid-cols-2' : '',
            panelList.length === 3 ? 'grid-cols-3' : '',
            panelList.length === 4 ? 'grid-cols-4' : '',
            panelList.length >= 5 ? 'grid-cols-5' : '',
          ]">
            <div v-for="(item, index) in panelList" :key="index"
              class="h-[172px] rounded-2xl bg-[#F3FCFF] flex flex-col items-center hover:bg-[#EBF1F3] cursor-pointer"
              @click="handlePanelClick(item)">
              <img :src="item.svg" alt="" class="mt-[14px] w-[100px] h-[100px]">
              <span class="mt-[14px] text-black text-xl leading-[28px]">{{ item.name }}</span>
            </div>
          </div>
        </div>
        <!---功能面板不存在时的占位-->
        <!--				<div v-if="!(data?.featurePanelIsShow && data?.featurePanelRespList?.length > 0)"-->
        <!--				     class="w-full h-[147px]"></div>-->
        <!--我的工作台-->
        <div v-if="data?.projectProcessProgressIsShow || data?.projectStatusIsShow || data?.projectScheduleIsShow"
          class="mt-5 mb-8 w-full flex flex-col">
          <!--工作台标题-->
          <title-comp title="我的工作台" :type="1" />
          <!--工作台内容-->
          <!--项目处理进度分布-->
          <project-progress-distribution v-if="data?.projectProcessProgressIsShow"
            :data="data?.projectProcessProgressResp" class="mt-4" />
          <!--项目状态分布-->
          <project-status-distribution v-if="data?.projectStatusIsShow" title-name="项目状态分布" class="mt-4" />
          <KeyNodeCard v-if="data?.keyStepIsShow" class="mt-4" />
          <!--项目阶段分布-->
          <project-progress-statistics v-if="data?.projectScheduleIsShow" title-name="项目阶段分布" class="mt-4" />
        </div>
      </div>
    </div>
    <!--抽屉-->
    <el-drawer v-model="showSettingDrawer" title="首页显示设置" modal-class="setting-drawer text-sm" direction="rtl" :size="796"
      destroy-on-close :close-on-click-modal="false" :close-on-press-escape="false">
      <setting-drawer @function-panel-setting-on-ok="functionPanelSettingOnOk" @workbench-setup-on-ok="workbenchSetupOnOk"
        @on-cancel="settingDrawerOnCancel" />
    </el-drawer>
  </div>
</template>

<script>
import * as constants from '@/utils/constant.js'
import RingChart from '@/components/RingChart'
import ProjectStatusDistributionPie from "@/views/index/components/ProjectStatusDistributionPie";
import SettingDrawer from "@/views/index/setting-drawer/SettingDrawer";
import TitleComp from "@/views/index/components/TitleComp";
import ProjectProgressDistribution from "@/views/index/project-progress-distribution/ProjectProgressDistribution";
import ProjectStatusDistribution from "@/views/index/project-status-distribution/ProjectStatusDistribution";
import ProjectProgressStatistics from "@/views/index/project-progress-statistics/ProjectProgressStatistics";
import KeyNodeCard from './KeyNodeCard.vue';
import mixinPanel from "@/views/index/mixin/mixinPanel";
import { ruProjectBaseinfo_queryHomePage } from "@/api/pm/ruProjectBaseinfo";
// import service from "@utils/request";

export default {
  name: 'Index',
  mixins: [
    mixinPanel,
  ],
  components: {
    ProjectProgressStatistics,
    ProjectProgressDistribution,
    TitleComp,
    SettingDrawer,
    ProjectStatusDistributionPie,
    RingChart,
    ProjectStatusDistribution,
    KeyNodeCard
  },
  data() {
    return {
      // 搜索模式，搜项目或搜知识库
      searchMode: '搜项目',
      // 是否展示首页显示设置抽屉
      showSettingDrawer: false,
      constants,
      keyword: '',
      data: null,
      loading: false,
      // 滚动预警数据的index
      scrollingDataIndex: null,
      scrollTimer: null,
      // 项目延期'4'，环节暂停'2'，环节正常推进'1'
      scrollMap: {
        '4': {
          label1: '项目延期',
          label2: '延期阶段：',
        },
        '2': {
          label1: '环节暂停',
          label2: '暂停阶段：',
        },
        '1': {
          label1: '环节重启提醒',
          label2: '重启阶段：',
        },
      },
    }
  },
  computed: {
    // 功能面板列表
    panelList() {
      let list = [];
      for (let i = 0; i < this.data?.featurePanelRespList?.length; i++) {
        const findItem = this.allPanel.find(item => item.name === this.data?.featurePanelRespList[i].name);
        if (findItem) {
          list.push({
            ...findItem,
            ...this.data?.featurePanelRespList[i],
          });
        }
      }
      return list;

      // 去除['知识库', '角色权限', '成员列表', '消息通知', '模板管理']
      // const list = this.allPanel.filter(item => {
      // 	return !['知识库', '角色权限', '成员列表', '消息通知', '模板管理'].includes(item.name);
      // })
      // return list;
    },
  },
  created() {
    this.getData();
  },
  beforeUnmount() {
    this.clearScrollTimer();
  },
  methods: {
    goMoreWarning() {
      const map = {
        '1': 'progress',
        '2': 'progress',
        '4': 'delay_remind',
      }
      this.$router.push({
        path: `/message`,
        state: {
          params: {
            messageType: map[this.data.scrollingDataList[this.scrollingDataIndex].stepStatus],
          }
        }
      })
    },
    async getData() {
      this.loading = true;
      const { result } = await ruProjectBaseinfo_queryHomePage();
      console.log('result', result);
      this.data = result;
      // this.data.scrollingDataList = [
      // 	{
      // 		projectId: '1',
      // 		stepStatus: '4',
      // 		projectName: '项目1',
      // 		periodName: '阶段1',
      // 		currentStepName: '环节1',
      // 		dayNum: 10,
      // 	},
      // 	{
      // 		projectId: '2',
      // 		stepStatus: '2',
      // 		projectName: '项目2',
      // 		periodName: '阶段2',
      // 		currentStepName: '环节2',
      // 	},
      // 	{
      // 		projectId: '3',
      // 		stepStatus: '1',
      // 		projectName: '项目3',
      // 		periodName: '阶段3',
      // 		currentStepName: '环节3',
      // 	},
      // ];
      this.scrollingDataIndex = 0;
      this.startScrollTimer();
      this.loading = false;
    },
    // 搜索
    handleSearch() {
      if (this.searchMode === '搜项目') {
        this.$router.push({
          name: 'ProjectList',
          state: {
            params: {
              "keyword": this.keyword,
            }
          }
        })
      } else if (this.searchMode === '搜知识库') {
        this.$router.push({
          name: 'Policy',
          state: {
            params: {
              "keyword": this.keyword,
            }
          }
        })
      }
    },
    // 点击滚动预警区域，跳转到项目详情
    clickScrollingItem(index) {
      console.log('index', index);
      this.$router.push({
        path: `/project/detail/${this.data.scrollingDataList[index].projectId}`,
      })
    },
    clearScrollTimer() {
      if (this.scrollTimer) {
        clearInterval(this.scrollTimer);
        this.scrollTimer = null;
      }
    },
    startScrollTimer() {
      if (this.scrollTimer === null) {
        this.scrollTimer = setInterval(() => {
          if (this.scrollingDataIndex === null) {
            this.scrollingDataIndex = 0;
          } else {
            this.scrollingDataIndex = (this.scrollingDataIndex + 1) % this.data?.scrollingDataList?.length;
          }
        }, 3000);
      }
    },
    handleView(item) {
      console.log('item', item);
    },
    functionPanelSettingOnOk(params) {
      console.log('functionPanelSettingOnOk');
      this.getData();
      this.showSettingDrawer = false;
    },
    workbenchSetupOnOk(params) {
      console.log('workbenchSetupOnOk');
      this.getData();
      this.showSettingDrawer = false;
    },
    settingDrawerOnCancel() {
      console.log('settingDrawerOnCancel');
      this.showSettingDrawer = false;
    },
    handlePanelClick(item) {
      console.log('item', item);
      if (item.path) {
        this.$router.push(item.path);
      } else {
        this.$message({
          type: 'warning',
          message: '此功能正在开发中',
        });
      }
    },
    handleCommand(item) {
      this.searchMode = item;
    },
  }
};
</script>

<style lang="scss">
.index {
  .search-input.el-input {
    .el-input {
      &__wrapper {
        box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
        border-radius: 16px;
        padding: 1px 24px;
      }
    }

    .el-button.el-button--large {
      padding: 0 23px;
    }
  }
}
</style>

