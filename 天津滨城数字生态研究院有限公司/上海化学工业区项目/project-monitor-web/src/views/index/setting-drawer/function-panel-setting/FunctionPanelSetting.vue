<template>
  <!--最外层-->
  <div class="function-panel-setting flex-grow flex-shrink-0 w-full flex flex-col">
    <!--上面内容-->
    <div class="w-full flex-1 flex flex-col" v-loading="loading">
      <!--标题-->
      <div class="mb-4 flex justify-between items-center">
        <title-comp title="常用功能设置" :type="2" />
        <el-checkbox v-model="commonShow" label="不显示" size="large" />
      </div>
      <!--全部9个卡片-->
      <div v-if="unselectedPanels.length > 0" class="mb-5 grid grid-cols-4 gap-[14px]">
        <div v-for="(item, index) in unselectedPanels" :key="item.name"
          class="h-[144px] rounded-2xl bg-[#F3FCFF] flex flex-col items-center hover:bg-[#EBF1F3] cursor-pointer"
          @click="clickUnselectedPanel(index)">
          <img :src="item.svg" alt="" class="mt-[14px] w-[80px] h-[80px]">
          <span class="mt-[14px] text-black text-base leading-[22px]">{{ item.name }}</span>
        </div>
      </div>
      <!--已选择-->
      <div class="w-full flex flex-col">
        <!--标题-->
        <div class="flex items-center">
          <span class="text-black text-base font-medium leading-6">已选择</span>
          <span class="text-xs text-black-three">（长按拖动调整显示顺序）</span>
        </div>
        <!--存在已选择列表-->
        <vue-draggable ref="el" v-model="selectedPanels" v-if="selectedPanels.length > 0"
          class="mt-[14px] grid grid-cols-4 gap-[14px]">
          <div v-for="(item, index) in selectedPanels" :key="item.name"
            class="h-[144px] rounded-2xl bg-[#F3FCFF] flex flex-col items-center hover:bg-[#EBF1F3] cursor-pointer relative border border-main"
            @click="clickSelectedPanel(index)">
            <img :src="item.svg" alt="" class="mt-[14px] w-[80px] h-[80px]">
            <span class="mt-[14px] text-black text-base leading-[22px]">{{ item.name }}</span>
            <!--右上角icon-->
            <img src="./icon/trueSvg2.svg" alt="" class="absolute top-0 right-0">
            <!--						<div class="w-[32px] h-[22px] rounded-2xl bg-red absolute top-0 right-0"></div>-->
          </div>
        </vue-draggable>
        <!--没有已选择的-->
        <img v-else src="../../icon/noDataSvg.svg" alt="" class="mt-4 w-[342px] h-[226px] self-center">
      </div>
    </div>
    <!--底部按钮-->
    <div class="mt-6 mb-6 flex justify-end items-center">
      <!--取消-->
      <el-button @click="onCancel">取消</el-button>
      <!--确定-->
      <el-button type="primary" @click="onOk">确定</el-button>
    </div>
  </div>
</template>

<script>
import { VueDraggable } from 'vue-draggable-plus'

import TitleComp from "@/views/index/components/TitleComp";
import mixinPanel from "@/views/index/mixin/mixinPanel";
import request from "@/utils/request";

export default {
  name: 'FunctionPanelSetting',
  mixins: [
    mixinPanel,
  ],
  emits: [
    'on-ok',
    'on-cancel',
  ],
  components: {
    TitleComp,
    VueDraggable
  },
  data() {
    return {
      // 不显示常用功能
      commonShow: null,
      // 未选择列表
      unselectedPanels: [],
      // 已选择列表
      selectedPanels: [],
      loading: false,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      this.loading = true;
      const { result } = await request({
        url: '/admin/homePageShow/list',
        method: 'get',
      });
      for (let i = 0; i < result.commonList.length; i++) {
        result.commonList[i].homePageShowDTO = {
          ...result.commonList[i].homePageShowDTO,
          moduleName: result.commonList[i].moduleName,
        }
      }
      for (let i = 0; i < this.allPanel.length; i++) {
        const findItem = result.commonList.find(item => item.homePageShowDTO.moduleCode == this.allPanel[i].code);
        if (findItem) {
          this.allPanel[i].homePageShowDTO = findItem.homePageShowDTO;
        } else {
          this.allPanel[i].homePageShowDTO = {
            itemOrder: 99
          }
        }
      }
      // 将allPanel排序，依据是homePageShowDTO.itemOrder
      this.allPanel.sort((a, b) => {
        return a.homePageShowDTO.itemOrder - b.homePageShowDTO.itemOrder;
      });
      // 将allPanel分为2组，已选择和未选择，依据是homePageShowDTO.isShow
      this.allPanel.forEach(item => {
        if (item.homePageShowDTO.moduleCode) {
          if (item.homePageShowDTO.isShow == 0) {
            this.selectedPanels.push(item);
          } else {
            this.unselectedPanels.push(item);
          }
        }
      })
      console.log('result', result);
      this.commonShow = result.commonShow === 1;
      this.loading = false;
    },
    clickUnselectedPanel(index) {
      // 将点击的功能面板从未选择列表中删除，并添加到已选择列表中
      this.selectedPanels.push(this.unselectedPanels.splice(index, 1)[0]);
    },
    clickSelectedPanel(index) {
      // 将点击的功能面板从已选择列表中删除，并添加到未选择列表中
      this.unselectedPanels.push(this.selectedPanels.splice(index, 1)[0]);
    },
    async onOk() {
      // 将已选择列表中的功能面板的isShow设置为0，未选择列表中的功能面板的isShow设置为1
      this.selectedPanels.forEach(item => {
        item.homePageShowDTO.isShow = 0;
      });
      this.unselectedPanels.forEach(item => {
        item.homePageShowDTO.isShow = 1;
      });
      // 将已选择列表中的功能面板的itemOrder设置为其在列表中的索引+1，未选择列表中的功能面板的itemOrder设置为索引+已选择列表长度+1
      this.selectedPanels.forEach((item, index) => {
        item.homePageShowDTO.itemOrder = index + 1;
      });
      this.unselectedPanels.forEach((item, index) => {
        item.homePageShowDTO.itemOrder = index + this.selectedPanels.length + 1;
      });
      const params = {
        commonShow: this.commonShow ? 1 : 0,
        homePageShowDTOS: [
          ...this.selectedPanels.map(item => item.homePageShowDTO),
          ...this.unselectedPanels.map(item => item.homePageShowDTO),
        ],
      }
      await request({
        url: '/admin/homePageShow/edit',
        method: 'put',
        data: params,
      })
      this.$message({
        message: '修改常用功能设置成功',
        type: 'success',
      });
      this.$emit('on-ok');
    },
    onCancel() {
      this.$emit('on-cancel');
    },
  },
};
</script>

<style lang="scss">
.function-panel-setting {}
</style>
