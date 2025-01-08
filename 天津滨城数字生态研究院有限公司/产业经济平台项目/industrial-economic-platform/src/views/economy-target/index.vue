<template>
  <!--最外层-->
  <div class="tw-min-w-[1200px] tw-w-full tw-h-full tw-flex tw-flex-col tw-items-center"
       style="height: calc(100vh - 67px)"
  >
    <div class="tw-mt-[22px] tw-pt-[20px] tw-mb-[22px] tw-w-[1200px] tw-min-w-[1200px] tw-flex-1 tw-bg-white tw-flex tw-flex-col tw-relative">
      <!--上面-->
      <div class="tw-pl-[45px] tw-flex tw-flex-col search-bar">
        <el-breadcrumb class="ee-breadcrumb" separator="/">
          <el-breadcrumb-item>宏观经济</el-breadcrumb-item>
          <el-breadcrumb-item class="is-active">经济指标归因</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="tw-mt-[14px] tw-flex tw-items-center">
          <el-autocomplete
            popper-class="search-bar-popper"
            :debounce="0"
            ref="search-inner"
            select-when-unmatched
            class="inline-input"
            v-model="keywords"
            :fetch-suggestions="querySearch"
            :trigger-on-focus="true"
            placeholder="搜索指标"
            @select="getData"
            @keydown.enter.native="getData"
            style="width: 542px;height: 42px;"
            @click="getData"
          ></el-autocomplete>
          <div @click="getData"
               class="tw-flex tw-justify-center tw-items-center tw-bg-[#356df6] tw-cursor-pointer"
               style="width: 67px;height: 42px;border-radius: 0 4px 4px 0;">
            <img src="./icon/search.svg" alt="">
          </div>
        </div>
        <div class="tw-mt-5 tw-flex tw-items-center tw-text-sm">
          <div class="tw-text-[#bfbfbf] tw-border-solid tw-border-b tw-border-white"
               style="border-top: 0;border-right: 0;border-left: 0;"
          >推荐搜索：</div>
          <div v-for="(item,index) in searchList"
                :key="index"
               style="border-top: 0;border-right: 0;border-left: 0;"
                @click="clickSearchList(item)"
                class="tw-ml-5 tw-text-[#356DF6] tw-cursor-pointer tw-border-solid tw-border-b hover:tw-text-[#6995FF] tw-border-white hover:tw-border-[#6995FF]">
            {{item}}
          </div>
        </div>
      </div>
      <!--下面-->
      <div id="main"
           class="tw-mt-4 tw-w-full tw-flex-1"></div>
      <div class="tw-mt-4 tw-flex tw-items-center tw-absolute tw-top-[140px] tw-left-[45px] tw-text-[24px] tw-border tw-border-solid tw-border-[#e2e2e2] tw-rounded tw-p-1.5 tw-bg-white"
           v-show="haveData">
        <i class="el-icon-zoom-in tw-pl-1 tw-pr-1"
           :class="[option.series.zoom < 5 ? 'tw-cursor-pointer tw-text-[#262626] hover:tw-text-[#356df6]' : 'tw-cursor-not-allowed tw-text-[#8c8c8c]']"
           @click="clickGraphLarge"></i>
        <i class="el-icon-zoom-out tw-pl-1 tw-pr-1"
           :class="[option.series.zoom > 0.5 ? 'tw-cursor-pointer tw-text-[#262626] hover:tw-text-[#356df6]' : 'tw-cursor-not-allowed tw-text-[#8c8c8c]']"
           @click="clickGraphSmall"></i>
        <i class="el-icon-c-scale-to-original tw-pl-1 tw-pr-1"
           :class="[option.series.zoom !== 1 ? 'tw-cursor-pointer tw-text-[#262626] hover:tw-text-[#356df6]' : 'tw-cursor-not-allowed tw-text-[#8c8c8c]']"
           @click="clickGraphNormal"></i>
      </div>
      <div v-show="!haveData"
           class="tw-w-full tw-mt-[144px] tw-flex tw-flex-col tw-items-center tw-absolute tw-top-[80px]">
        <img src="./icon/NoDataSvg.svg" alt="">
        <span class="tw-mt-[-80px] tw-text-base tw-text-[#c1c1c1]">未搜索到相关的指标</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getGraphByKeywordAndDepth, graphOption } from '@/views/economy-target/util';
import { graphAllData } from '@/views/economy-target/static';

export default {
  name: 'EconomyTarget',
  data() {
    return {
      searchList: ['宏观经济', '财政收支', '消费'],
      keywords: '宏观经济',
      searchedKeywords: null,
      haveData: false,
      option: graphOption,
      myChart: null
    };
  },
  mounted() {
    const chartDom = document.getElementById('main');
    this.myChart = this.$echarts.init(chartDom);
    this.myChart.on('mousedown', (params) => {
      // 将nodes设置为fixed为false
      // eslint-disable-next-line no-shadow
      const option = this.myChart.getOption();
      option.series[0].force.layoutAnimation = true;
      const { nodes } = option.series[0];
      nodes.forEach((item) => {
        // eslint-disable-next-line no-param-reassign
        item.fixed = false;
      });
      console.log('params: ', params);
      option.series[0].nodes[params.dataIndex].x = params.event.offsetX;
      option.series[0].nodes[params.dataIndex].y = params.event.offsetY;
      option.series[0].nodes[params.dataIndex].fixed = true;
      this.myChart.setOption(option);
    });
    this.myChart.on('mouseup', (params) => {
      // 将nodes设置为fixed为false
      // eslint-disable-next-line no-shadow
      const option = this.myChart.getOption();
      option.series[0].force.layoutAnimation = true;
      const { nodes } = option.series[0];
      nodes.forEach((item) => {
        // eslint-disable-next-line no-param-reassign
        item.fixed = false;
      });
      console.log('params: ', params);
      option.series[0].nodes[params.dataIndex].x = params.event.offsetX;
      option.series[0].nodes[params.dataIndex].y = params.event.offsetY;
      option.series[0].nodes[params.dataIndex].fixed = true;
      this.myChart.setOption(option);
    });
    this.getData();
  },
  methods: {
    getData() {
      // 将input失去焦点,先查询input标签
      const { input } = this.$refs['search-inner'].$refs;
      input.blur();
      if (this.keywords === this.searchedKeywords) {
        return;
      }
      this.searchedKeywords = this.keywords;
      this.option.series.width = document.getElementById('main').offsetWidth;
      this.option.series.height = document.getElementById('main').offsetHeight;
      this.option.series.zoom = 1;
      this.option.series.force.layoutAnimation = false;
      const newGraph = getGraphByKeywordAndDepth(graphAllData, this.keywords, 3);
      this.option.series.nodes = JSON.parse(JSON.stringify(newGraph.nodes));
      this.option.series.edges = JSON.parse(JSON.stringify(newGraph.edges));
      this.haveData = newGraph.nodes.length > 0;
      if (newGraph.nodes.length > 0) {
        this.option.series.nodes[0].x = this.option.series.width / 2;
        this.option.series.nodes[0].y = this.option.series.height / 2;
        this.option.series.nodes[0].fixed = true;
        // 放大和缩小的中心点为一级菜单，即第一个节点
        // this.option.series.center = [this.option.series.nodes[0].x, this.option.series.nodes[0].y];
      }
      if (this.option.series.nodes.length <= 20) {
        this.option.series.force.gravity = 0;
      } else {
        this.option.series.force.gravity = this.option.series.nodes.length / 350;
      }
      this.myChart.setOption(JSON.parse(JSON.stringify(this.option)), true);
    },
    clickSearchList(item) {
      this.keywords = item;
      this.getData();
    },
    querySearch(queryString, cb) {
      // 从graphAllData中查询
      const allNodes = graphAllData.nodes.map((item) => ({ value: item.name }));
      const results = queryString ? allNodes.filter((item) => item.value.includes(queryString)) : [];
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    clickGraphLarge() {
      if (this.option.series.zoom < 5) {
        this.option.series.zoom = Math.min(this.option.series.zoom * 1.2, 5);
        this.myChart.setOption(JSON.parse(JSON.stringify(this.option)));
      }
    },
    clickGraphSmall() {
      if (this.option.series.zoom > 0.5) {
        this.option.series.zoom = Math.max(this.option.series.zoom * 0.8, 0.5);
        this.myChart.setOption(JSON.parse(JSON.stringify(this.option)));
      }
    },
    clickGraphNormal() {
      if (this.option.series.zoom !== 1) {
        this.option.series.zoom = 1;
        this.myChart.setOption(JSON.parse(JSON.stringify(this.option)));
      }
    },
  }
};
</script>

<style lang="less" scoped>
@import '~@/styles/variables.less';
.search-bar {
  .el-input {
    //margin-top: 50px;
    width: 640px;
    height: 42px;
    span {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  ::v-deep .el-input__inner {
    height: 42px;
    border-radius: 4px 0 0 4px;
  }
}
</style>

<style>
.search-bar-popper .popper__arrow{
  display: none!important;
}

.el-autocomplete-suggestion li {
  height: 44px!important;
  line-height: 44px!important;
  font-size: 14px;
  color: #1A262C;
  padding: 0 33px!important;
}

.el-autocomplete-suggestion li.highlighted,
.el-autocomplete-suggestion li:hover {
  background-color: #D7E2FD!important;
  color: #356DF6!important;
  height: 44px!important;
  line-height: 44px!important;
}

.el-autocomplete-suggestion {
  background: #FFFFFF!important;
  border: unset!important;
  box-shadow: 2px 2px 8px 0px rgba(19,38,82,0.12)!important;
  border-radius: 4px!important;
  overflow: hidden!important;
}

.el-autocomplete-suggestion__wrap {
  padding: 5px 0!important;
}
</style>
