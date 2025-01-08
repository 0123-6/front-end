<template>
  <div class="digital-economy tw-w-full tw-flex tw-flex-col">
    <div class="wrap-inner scroll-content">
      <!--标题和简介-->
      <div
        class="tw-w-full tw-flex tw-flex-col tw-items-center tw-text-[#1D2129] tw-bg-white tw-box-border tw-pl-10 tw-pr-10"
        style="box-shadow: 0px 0px 6px 0px rgba(19, 38, 82, 0.08); border-radius: 4px 4px 0px 0px">
        <span class="tw-mt-[57px] tw-font-medium tw-text-[28px] tw-leading-[28px] tw-tracking-[-1.2px]">数字经济产业发展指数</span>
        <span class="tw-mb-[55px] tw-mt-3 tw-max-w-[1220px] tw-text-sm tw-leading-[23px] tw-tracking-[-0.6px]">
          北京大数据研究院发布的数据经济产业发展指数，聚焦区域发展和企业微观主体，构建了数字经济产业的发展政策环境、规模质量、头部企业情况、产业创新及投资热度五大一级指标，通过区域的政策发布、机构设立、企业运营、头部企业、研发投入、科研创新和投融资热度等维度，能够有效衡量各城市数字产业化的综合发展情况，协助深化认识各区域数字经济发展规律，提升数字经济发展水平，增强城市的经济实力，以及提升数字政府的治理水平。</span>
      </div>
      <!--地图-->
      <div class="chart-wrap tw-w-full tw-h-[800px] tw-box-border tw-relative tw-flex">
        <span class="tw-text-sm tw-font-medium tw-text-[#1A262C] tw-absolute tw-top-[23px] tw-left-[22px] tw-tracking-[-0.6px]">区域分布</span>
        <img v-if="false" src="./icon/map/北京大数据.svg" alt="" class="tw-absolute tw-top-[110px] tw-left-[53px]" style="width: 7.03vw;min-width: 100px;" />
        <!--省市选择器-->
        <div class="tw-absolute tw-top-[32px] tw-flex tw-rounded tw-cursor-pointer"
             style="left: calc(50% - 62px)">
          <div v-for="(item, index) in mapTypeList"
               :key="index"
               class="tw-w-[62px] tw-h-[36px] tw-flex tw-justify-center tw-items-center tw-rounded tw-cursor-pointer"
               @click="changeMapType(item.value)"
               :class="[mapType === item.value ? 'tw-bg-[rgba(53,109,246,0.04)]' : 'tw-bg-[#F9F9F9]']"
          >
            <span class="tw-text-lg tw-font-medium" :class="[mapType === item.value ? 'tw-text-[#356DF6]' : 'tw-text-[#1D2129]']">{{item?.name}}</span>
          </div>
        </div>
        <!--右侧部分-->
        <div class="tw-absolute tw-top-[78px] tw-flex tw-flex-col tw-w-[183px]" style="right: 5.31vw">
          <!--区域-->
          <div
            class="tw-w-full tw-h-[97px] tw-flex tw-items-center tw-rounded-lg tw-pl-5"
            style="background: linear-gradient(319deg, rgba(208, 224, 255, 0.02) 0%, rgba(163, 190, 255, 0.09) 100%)">
            <img src="./icon/map/AreaSvg.svg" alt="" />
            <div class="tw-ml-5 tw-flex tw-flex-col tw-self-start">
              <span class="tw-mt-5 tw-text-base tw-text-[#86909C]">区域</span>
              <span class="tw-mt-[14px] tw-text-[18px] tw-leading-[20px] tw-font-medium tw-text-[#356DF6] hpj-text-hidden-2">{{hoverItem?.name ? hoverItem?.name : '暂无'}}</span>
            </div>
          </div>
          <!--指数-->
          <div
            class="tw-mt-4 tw-w-full tw-h-[97px] tw-flex tw-items-center tw-rounded-lg tw-pl-5"
            style="background: linear-gradient(319deg, rgba(111, 204, 187, 0.02) 0%, rgba(111, 204, 187, 0.09) 100%)">
            <img src="./icon/map/IndexSvg.svg" alt="" />
            <div class="tw-ml-5 tw-flex tw-flex-col tw-self-start">
              <span class="tw-mt-5 tw-text-base tw-text-[#86909C]">指数</span>
              <span class="tw-mt-[14px] tw-text-[24px] tw-leading-[26px] tw-font-medium tw-text-[#4AAF9C]">{{hoverItem?.total_index ? Number(hoverItem?.total_index)?.toFixed(3) : '暂无' }}</span>
            </div>
          </div>
          <!--排名-->
          <div
            class="tw-mt-4 tw-w-full tw-h-[97px] tw-flex tw-items-center tw-rounded-lg tw-pl-5"
            style="background: linear-gradient(319deg, rgba(244, 204, 108, 0.02) 0%, rgba(244, 204, 108, 0.09) 100%)">
            <img src="./icon/map/RankSvg.svg" alt="" />
            <div class="tw-ml-5 tw-flex tw-flex-col tw-self-start">
              <span class="tw-mt-5 tw-text-base tw-text-[#86909C]">排名</span>
              <span class="tw-mt-[14px] tw-text-[24px] tw-leading-[26px] tw-font-medium tw-text-[#EAB73C]">{{hoverItem?.order ? hoverItem?.order : '暂无'}}</span>
            </div>
          </div>
          <!--更新时间-->
          <div
            class="tw-mt-4 tw-w-full tw-h-[97px] tw-flex tw-items-center tw-rounded-lg tw-pl-5"
            style="background: linear-gradient(319deg, rgba(239, 143, 106, 0.02) 0%, rgba(239, 143, 106, 0.09) 100%)">
            <img src="./icon/map/DateSvg.svg" alt="" />
            <div class="tw-ml-5 tw-flex tw-flex-col tw-self-start">
              <span class="tw-mt-5 tw-text-base tw-text-[#86909C]">更新时间</span>
              <span class="tw-mt-[14px] tw-text-[24px] tw-leading-[26px] tw-font-medium tw-text-[#EF8F6A]">{{hoverItem?.update_time ? hoverItem?.update_time : '暂无'}}</span>
            </div>
          </div>
        </div>
        <!--地图本身-->
        <div class="tw-absolute tw-top-[95px] tw-h-[643px]"
             style="width: calc(100% - 5.31vw - 183px);max-width: 1343px;"
             :style="map1Style">
          <gis-map id="map1"
                   :mapValue="mapType === 'china' ? map1.value : map1.valueAllCity"
                   :mapType="mapType"
                   :option="map1.mapOption"
                   @changeName="changeName"
                   @changeValue="changeValue" />
        </div>
        <!--        <map-chart v-show="false" ref="chart0" :chartData="mapData" height="726px" :show-back="false" @changeAreaCode="changeAreaCode" />-->
      </div>
      <!--选择器-->
      <div class="tabs-row d-flex tw-flex-col">
        <!--定位和对比区域-->
        <div class="tw-mt-[33px] d-flex ai-center tw-pl-5">
          <div class="d-flex ai-center">
            <div class="tw-text-sm tw-font-medium tw-text-[#86909C] tw-tracking-[-0.6px]">当前定位：</div>
            <el-select v-model="currentLocation" placeholder="请选择当前定位" size="mini" clearable>
              <el-option v-for="(item, index) in currentLocationList"
                         :key="index"
                         :label="item.name"
                         :value="item.adcode" />
            </el-select>
          </div>
          <div class="tw-ml-4 d-flex ai-center">
<!--            <button class="tw-w-[122px] tw-h-[28px] tw-bg-white tw-rounded-sm tw-flex tw-justify-center tw-items-center tw-box-border tw-border tw-border-solid"-->
<!--                    :class="[currentLocation ? 'tw-cursor-pointer tw-border-main hover:tw-border-main-hover active:tw-border-main-active tw-text-main hover:tw-text-main-hover active:tw-text-main-active' : 'tw-cursor-not-allowed tw-border-[#e5e5e5] tw-text-[#e5e5e5]']"-->
<!--                    :disabled=""-->
<!--                    style="background-color: white;">-->
<!--              <span class="tw-text-sm "></span>-->
<!--            </button>-->
<!--            v-if="regionTree.length > 0"-->
            <cascader-select
              :props="regionProps"
              ref="CascaderSelect"
              :disabled="!currentLocation || (selectedContrastAreaList.length >= maxLength - 1)"
              mode="button"
              :value-levels="cascaderSelectLevel"
              :disabled-list="[currentLocation]"
              :multiple="true"
              :showValueList="false"
              :strictly="true"
              :tabs="cascaderTabs"
              placeholder="+添加对比区域"
              :show-button-icon="false"
              :options="regionTree"
              :defaultValue="defaultValue"
              :defaultProps="defaultProps"
              level-prop="regionLevel"
              @confirm="confirmRegion" />
            <!--对比区域列表-->
            <div class="tw-flex-1 tw-flex tw-items-center tw-flex-shrink-0">
              <!--前4个-->
              <div v-for="(item, index) in selectedContrastAreaList.slice(0, 4)"
                   :key="index"
                   class="tw-flex-shrink-0 tw-box-border tw-h-[28px] tw-ml-2 tw-bg-[#F6F6F6] tw-rounded-sm tw-pl-1 tw-pr-1 tw-flex tw-items-center tw-text-[#5B5858]"
                   style="border: 1px solid rgba(225,225,225,0.21);">
                <el-tooltip v-if="item.names.split('/')[item.names.split('/').length - 1]?.length > 4"
                            :key="item.names.split('/')[item.names.split('/').length - 1]"
                            placement="top"
                            popper-class="digital-economy-tooltip"
                            :content="item.names.split('/')[item.names.split('/').length - 1]">
                  <span v-if="item.names.split('/')[item.names.split('/').length - 1]?.length > 4" class="tw-max-w-[65px] tw-text-sm  hpj-text-hidden tw-tracking-[-0.6px]">{{item.names.split('/')[item.names.split('/').length - 1]}}</span>
                </el-tooltip>
                <span v-if="!(item.names.split('/')[item.names.split('/').length - 1]?.length > 4)" class="tw-max-w-[65px] tw-text-sm  hpj-text-hidden tw-tracking-[-0.6px]">{{item.names.split('/')[item.names.split('/').length - 1]}}</span>
                <span class="el-icon-circle-close tw-ml-1 tw-cursor-pointer hover:tw-text-main"
                      @click="clickDeleteContrastArea(item)"></span>
              </div>
              <!--第4个及后面的，展示悬浮框的按钮-->
              <el-popover
                placement="top"
                v-if="selectedContrastAreaList.length >= 5"
                width="297"
                trigger="hover"
                popper-class="popper-nopadding">
                <!--展示悬浮框的按钮-->
                <div v-if="selectedContrastAreaList.length >= 5"
                     slot="reference"
                     class="tw-ml-2 tw-w-[43px] tw-flex-shrink-0 tw-box-border tw-h-[28px] tw-bg-[#F6F6F6] tw-rounded-sm tw-pl-1 tw-pr-1 tw-flex tw-justify-center tw-items-center tw-text-[#5B5858]">
                  <span class="tw-text-sm tw-font-medium tw-tracking-[-0.6px]">+{{selectedContrastAreaList.length - 4}}</span>
                </div>
                <!--悬浮框-->
                <div class="tw-w-full tw-box-border tw-grid tw-grid-cols-3 tw-gap-x-3 tw-gap-y-2.5"
                     style="padding: 22px 23px 22px 26px;">
                  <div v-for="(item, index) in selectedContrastAreaList.slice(4)"
                       :key="index"
                       class="tw-w-full tw-flex-shrink-0 tw-box-border tw-h-[28px] tw-mr-2 tw-bg-[#F6F6F6] tw-rounded-sm tw-pl-1 tw-pr-1 tw-flex tw-items-center tw-text-[#5B5858]"
                       style="border: 1px solid rgba(225,225,225,0.21);">
                    <el-tooltip v-if="item.names.split('/')[item.names.split('/').length - 1]?.length > 3"
                                :key="item.names.split('/')[item.names.split('/').length - 1]"
                                placement="top"
                                popper-class="digital-economy-tooltip"
                                :content="item.names.split('/')[item.names.split('/').length - 1]">
                      <span v-if="item.names.split('/')[item.names.split('/').length - 1]?.length > 3" class="tw-flex-1 tw-text-sm  hpj-text-hidden tw-tracking-[-0.6px]">{{item.names.split('/')[item.names.split('/').length - 1]}}</span>
                    </el-tooltip>
                    <span v-if="!(item.names.split('/')[item.names.split('/').length - 1]?.length > 3)" class="tw-flex-1 tw-text-sm  hpj-text-hidden tw-tracking-[-0.6px]">{{item.names.split('/')[item.names.split('/').length - 1]}}</span>
                    <span class="el-icon-circle-close tw-ml-1 tw-cursor-pointer hover:tw-text-main"
                          @click="clickDeleteContrastArea(item)"></span>
                  </div>
                </div>
              </el-popover>
            </div>
          </div>
        </div>
        <!--导航栏-->
        <div class="tw-mt-5 tw-w-full tw-flex tw-justify-between tw-items-center">
          <el-tabs v-model="tabIndex" class="tw-ml-[33px] ee-tabs" @tab-click="handleScroll">
            <el-tab-pane v-if="showTabs['0']" label="综合得分" name="0"></el-tab-pane>
            <el-tab-pane v-if="showTabs['1']" label="政策与环境" name="1"></el-tab-pane>
            <el-tab-pane v-if="showTabs['2']" label="规模与质量" name="2"></el-tab-pane>
            <el-tab-pane v-if="showTabs['3']" label="头部企业" name="3"></el-tab-pane>
            <el-tab-pane v-if="showTabs['4']" label="产业创新能力" name="4"></el-tab-pane>
            <el-tab-pane v-if="showTabs['5']" label="产业投资热度" name="5"></el-tab-pane>
          </el-tabs>
          <!--报告说明-->
          <div class="tw-mr-[41px] tw-flex tw-items-center">
            <span v-if="false" class="tw-text-sm tw-text-[#86909C]">报告说明</span>
            <el-popover placement="bottom" width="148" trigger="hover" popper-class="popper-nopadding">
              <div class="tw-w-full tw-box-border tw-flex tw-flex-col tw-pt-2 tw-pb-2">
                <div
                  class="tw-w-full tw-box-border tw-pl-4 tw-pr-4 tw-h-[28px] tw-flex tw-justify-between tw-items-center hover:tw-bg-[#f1f5fe] tw-group tw-cursor-pointer"
                  @click="clickDownloadReport">
                  <span class="tw-text-sm tw-text-[#86909C] group-hover:tw-text-[#6A94F7]">2021年报告</span>
                  <img src="./icon/DownloadSvg.svg" alt="" />
                </div>
              </div>
              <div class="tw-ml-5 tw-flex tw-items-center" slot="reference">
                <img src="./icon/DownloadLightTwoSvg.svg" alt="" />
                <span class="tw-ml-1 tw-text-sm tw-text-[#356EF5]">下载报告</span>
              </div>
            </el-popover>
          </div>
        </div>
      </div>
      <!--下面部分-->
      <div class="tw-w-full tw-flex tw-flex-col" v-loading="loading">
        <!--综合得分-->
        <div v-if="showTabs['0']" class="scroll-item">
          <!--标题-->
          <div class="tw-mt-6 d-flex ai-center scroll-anchor">
            <img src="./icon/MenuSvg.svg" alt="" style="width: 31px;height: 31px;"/>
            <span class="tw-text-lg tw-font-medium tw-text-[#1D2129] tw-tracking-[-0.77px]">综合得分</span>
            <el-tooltip popper-class="digital-economy" placement="top" effect="light">
              <tooltip-slot slot="content" content="聚焦产业发展政策环境、规模质量、头部企业情况、产业创新及投资热度，科学客观地综合反映各地区数字经济产业发展现状。"/>
              <img src="./icon/WhatSvg.svg" alt="" style="margin-left: 11px;width: 18px;height: 18px;"/>
            </el-tooltip>
          </div>
          <el-row type="flex" :gutter="18" class="mb15 tw-mt-2">
            <el-col :span="12">
              <div class="shadow-row rose-wrap tw-h-[405px]">
                <div class="chart-title">总指数排名</div>
                <div class="d-flex ai-center jc-around">
                  <div class="rose-box">
                    <area-rose-chart ref="chart1" :chartData="cityIndexRankData" :legend="{ show: false }" width="320px" height="296px" :option="cityIndexRankOption" :hide-overlap="false"/>
                    <div class="rose-heart">
                      <!--                    <div>数字经济</div>-->
                      <div>总指数排名</div>
                      <!--                    <div class="title">TOP {{maxLength}}</div>-->
                    </div>
                  </div>
                  <div class="rose-legend d-flex ai-center">
                    <div v-for="(n, i) in cityIndexRankData.datas" :key="n.name" class="d-flex ai-center item">
                      <span class="icon" :style="{ background: roseColor[i] }"></span>
                      <el-tooltip v-if="n.name?.length > 4" placement="top" popper-class="digital-economy-tooltip" :content="n.name" :key="n.name">
                        <span v-if="n.name?.length > 4" class="name hpj-text-hidden">{{ n.name }}</span>
                      </el-tooltip>
                      <span v-if="!(n.name?.length > 4)" class="name hpj-text-hidden">{{ n.name }}</span>
                      <span class="value">{{ n.value }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <el-row type="flex" class="shadow-row">
                <div class="tw-w-full tw-h-[405px] tw-bg-white">
                  <!--上面，选择对比区域-->
                  <div class="tw-pt-[21px] tw-bg-white tw-w-full tw-box-border tw-pl-[33px] tw-pr-[33px] tw-flex tw-items-center">
                    <!--综合发展对比 tw-mt-[22px] tw-ml-[22px]-->
                    <span class="tw-text-base tw-font-medium tw-text-[#1A262C] tw-tracking-[-0.6px]">综合发展对比</span>
                    <!--已选区域-->
                    <div class="tw-flex-1 tw-flex tw-items-center tw-flex-shrink-0">
                      <!--前1个-->
                      <div v-for="(item, index) in selectedCompareAreaList.slice(0, 1)"
                           :key="index"
                           class="tw-flex-shrink-0 tw-box-border tw-h-[28px] tw-ml-2 tw-bg-[#F6F6F6] tw-rounded-sm tw-pl-1 tw-pr-1 tw-flex tw-items-center tw-text-[#5B5858]"
                           style="border: 1px solid rgba(225,225,225,0.21);">
                        <el-tooltip v-if="item?.name?.length > 4"
                                    :key="item?.name"
                                    placement="top" popper-class="digital-economy-tooltip" :content="item?.name">
                          <span v-if="item?.name?.length > 4" class="tw-max-w-[65px] tw-text-sm  hpj-text-hidden tw-tracking-[-0.6px]">{{ item?.name }}</span>
                        </el-tooltip>
                        <span v-if="!(item?.name?.length > 4)" class="tw-max-w-[65px] tw-text-sm  hpj-text-hidden tw-tracking-[-0.6px]">{{ item?.name }}</span>
                        <span class="el-icon-circle-close tw-ml-1 tw-cursor-pointer hover:tw-text-main"
                              @click="clickDeleteCompareArea(item)"></span>
                      </div>
                      <!--第2个及后面的，展示悬浮框的按钮-->
                      <el-popover
                        placement="top"
                        v-if="selectedCompareAreaList.length >= 2"
                        width="297"
                        trigger="hover"
                        popper-class="popper-nopadding">
                        <!--展示悬浮框的按钮-->
                        <div v-if="selectedCompareAreaList.length >= 2"
                             slot="reference"
                             class="tw-ml-2 tw-w-[43px] tw-flex-shrink-0 tw-box-border tw-h-[28px] tw-bg-[#F6F6F6] tw-rounded-sm tw-pl-1 tw-pr-1 tw-flex tw-justify-center tw-items-center tw-text-[#5B5858]">
                          <span class="tw-text-sm tw-font-medium tw-tracking-[-0.6px]">+{{selectedCompareAreaList.length - 1}}</span>
                        </div>
                        <!--悬浮框-->
                        <div class="tw-w-full tw-box-border tw-grid tw-grid-cols-3 tw-gap-x-3 tw-gap-y-2.5"
                             style="padding: 22px 23px 22px 26px;">
                          <div v-for="(item, index) in selectedCompareAreaList.slice(1)"
                               :key="index"
                               class="tw-w-full tw-flex-shrink-0 tw-box-border tw-h-[28px] tw-mr-2 tw-bg-[#F6F6F6] tw-rounded-sm tw-pl-1 tw-pr-1 tw-flex tw-items-center tw-text-[#5B5858]"
                               style="border: 1px solid rgba(225,225,225,0.21);">
                            <el-tooltip v-if="item?.name?.length > 3"
                                        :key="item?.name + index"
                                        placement="top"
                                        popper-class="digital-economy-tooltip"
                                        :content="item?.name">
                              <span v-if="item?.name?.length > 3" class="tw-flex-1 tw-text-sm  hpj-text-hidden tw-tracking-[-0.6px]">{{ item?.name }}</span>
                            </el-tooltip>
                            <span v-if="!(item?.name?.length > 3)" class="tw-flex-1 tw-text-sm  hpj-text-hidden tw-tracking-[-0.6px]">{{ item?.name }}</span>
                            <span class="el-icon-circle-close tw-ml-1 tw-cursor-pointer hover:tw-text-main"
                                  @click="clickDeleteCompareArea(item)"></span>
                          </div>
                        </div>
                      </el-popover>
                    </div>
                    <!--添加对比区域按钮 和 对应的悬浮框-->
                    <el-popover
                      placement="bottom-end"
                      width="400"
                      trigger="click"
                      popper-class="popper-nopadding">
                      <!--添加对比区域按钮-->
                      <button slot="reference"
                              class="tw-w-[122px] tw-h-[28px] tw-bg-white tw-rounded-sm tw-flex tw-justify-center tw-items-center tw-box-border tw-cursor-pointer tw-border tw-border-solid
                             tw-border-main hover:tw-border-main-hover active:tw-border-main-active tw-text-main hover:tw-text-main-hover active:tw-text-main-active"
                              style="background-color: white;">
                        <span class="tw-text-sm ">+添加对比区域</span>
                      </button>
                      <!--对应的悬浮框-->
                      <div class="tw-w-full tw-box-border tw-flex tw-flex-wrap tw-pt-2 tw-pb-2">
                        <div v-for="(item, index) in cityIndexRankData.datas"
                             :key="index"
                             class="tw-h-[30px] tw-flex tw-justify-center tw-items-center tw-box-border tw-pl-2 tw-pr-2"
                             :class="[selectedCompareAreaList.findIndex((_item) => (_item.name === item.name)) === -1 ? 'tw-text-[#646464] hover:tw-text-main-hover active:tw-text-main-active tw-cursor-pointer' : 'tw-text-[#8c8c8c] tw-cursor-not-allowed']"
                             @click="clickAddCompareArea(item)">
                          <span class="tw-text-sm">{{item?.name}}</span>
                        </div>
                      </div>
                    </el-popover>
                  </div>
                  <!--下面，雷达图本身 showGrowCompareData-->
                  <radar-component
                    ref="chart2"
                    :option="chart2Option"
                    class-name="grow-compare"
                    :chartData="showGrowCompareData"/>
                </div>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <!--数字经济政策与环境-->
        <div v-if="showTabs['1']" class="scroll-item">
          <!--标题-->
          <div class="tw-mt-6 d-flex ai-center scroll-anchor">
            <img src="./icon/StarSvg.svg" alt="" style="width: 31px;height: 31px;"/>
            <span class="tw-text-lg tw-font-medium tw-text-[#1D2129] tw-tracking-[-0.77px]">数字经济政策与环境</span>
            <el-tooltip popper-class="digital-economy" placement="top" effect="light">
              <tooltip-slot slot="content" content="反映各地区数字经济产业政策氛围、机构设置等发展环境综合情况。"/>
              <img src="./icon/WhatSvg.svg" alt="" style="margin-left: 11px;width: 18px;height: 18px;"/>
            </el-tooltip>
          </div>
          <el-row type="flex" :gutter="18" class="mb15 tw-mt-2">
            <!--左，政策与环境得分排名-->
            <el-col :span="8">
              <div class="shadow-row chart-wrap env-wrap tw-flex tw-flex-col">
                <span class="tw-mt-[22px] tw-ml-[22px] tw-text-base tw-font-medium tw-text-[#1A262C] tw-tracking-[-0.6px]">政策与环境得分排名</span>
                <div class="tw-w-full tw-box-border tw-flex tw-flex-col tw-pl-[10.25%] tw-pr-[18%] tw-pt-[14px]">
                  <div v-for="(item, index) in envRankData"
                       :key="index"
                       class="tw-mt-7 tw-w-full tw-flex tw-items-center tw-h-[20px] tw-box-border tw-pt-0.5 tw-pb-0.5 hover:tw-pt-0 hover:tw-pb-0">
                    <div class="tw-w-[50px] tw-min-w-[50px] tw-flex tw-justify-end">
                      <el-tooltip v-if="item.name.length > 3"
                                  :key="item.name + index"
                                  placement="top"
                                  popper-class="digital-economy-tooltip"
                                  :content="item.name">
                        <span v-if="item.name.length > 3" class="tw-font-medium tw-text-sm tw-text-[#4B5666] hpj-text-hidden">{{ item.name }}</span>
                      </el-tooltip>
                      <span v-if="!(item.name.length > 3)" class="tw-font-medium tw-text-sm tw-text-[#4B5666] hpj-text-hidden">{{ item.name }}</span>
                    </div>
                    <div class="tw-ml-[14px] tw-flex-1 tw-h-full tw-rounded-[3px] tw-bg-[rgba(137,126,220,0.1)] tw-flex tw-items-center tw-relative"
                         style="transition: all 0.1s;">
                      <div
                        class="tw-h-full tw-bg-[#5C82DF] tw-rounded-[3px]"
                        :style="{ width: item.value * 100 + '%', minWidth: item.value * 100 + '%' }"></div>
                      <span class="tw-ml-1.5 tw-font-semibold tw-text-base tw-text-[#4B5666]" style="letter-spacing: -0.69px">{{ item.value }}</span>
                    </div>
                  </div>
                  <!--如果少于maxLength个，则填充-->
                  <div class="tw-w-full tw-flex tw-flex-col">
                    <div v-for="(item, index) in (maxLength - envRankData.length)"
                         :key="index"
                         class="tw-mt-7 tw-w-full tw-flex tw-items-center tw-h-[20px] tw-box-border tw-pt-0.5 tw-pb-0.5 hover:tw-pt-0 hover:tw-pb-0">
                      <div class="tw-w-[50px] tw-min-w-[50px] tw-flex tw-justify-end">
                        <span class="tw-font-medium tw-text-sm tw-text-[#4B5666] hpj-text-hidden">{{ item?.name }}</span>
                      </div>
                      <div class="tw-ml-[14px] tw-flex-1 tw-h-full tw-rounded-[3px] tw-bg-[rgba(137,126,220,0.1)] tw-flex tw-items-center tw-relative"
                           style="transition: all 0.1s;">
                        <!--                      <div-->
                        <!--                        class="tw-h-full tw-bg-[#5C82DF] tw-rounded-[3px]"-->
                        <!--                        :style="{ width: item.value * 100 + '%', minWidth: item.value * 100 + '%' }"></div>-->
                        <span class="tw-ml-1.5 tw-font-semibold tw-text-base tw-text-[#4B5666]" style="letter-spacing: -0.69px">{{ item?.value }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <!--              <div class="env-ranks">-->
                <!--                <div v-for="(n, i) in envRankData"-->
                <!--                     :key="n.name"-->
                <!--                     class="item d-flex ai-center">-->
                <!--                  <div class="icon" :class="`top${i + 1}`">TOP {{ i + 1 }}</div>-->
                <!--                  <div class="flex-1">-->
                <!--                    <div class="d-flex ai-center jc-between">-->
                <!--                      <div class="name">{{ n.name }}</div>-->
                <!--                      <div class="value">{{ n.value }}</div>-->
                <!--                    </div>-->
                <!--                    <el-progress-->
                <!--                      :percentage="n.value * 100"-->
                <!--                      :show-text="false"-->
                <!--                      color="#356DF6"-->
                <!--                      define-back-color="rgba(53, 109, 246, 0.10)"></el-progress>-->
                <!--                  </div>-->
                <!--                </div>-->
                <!--              </div>-->
              </div>
            </el-col>
            <!--右-->
            <el-col :span="16">
              <!--数字经济产业政策数量-->
              <div class="shadow-row mb15">
                <base-bar-chart ref="chart3" :chartData="policyData" :option="policyDataOption" height="367px" color="#897EDC"/>
              </div>
              <!--数字经济产业相关联盟、协会及研究机构数量-->
              <div class="tw-h-[437px] shadow-row tw-bg-white tw-flex tw-flex-col">
                <span class="tw-mt-[22px] tw-ml-[22px] tw-text-base tw-font-medium tw-text-[#1A262C] tw-tracking-[-0.6px]">数字经济产业相关联盟、协会及研究机构数量</span>
                <div class="tw-h-[401px] tw-flex tw-justify-around">
                  <!--地图本身-->
                  <div class="tw-h-[401px]" style="width: calc(100%  - 271px);max-width: 516px;">
                    <gis-map id="map3"
                             :map-type="mapType2"
                             :mapValue="orgData"
                             :option="orgOption" />
                  </div>
                  <!--右-->
                  <div class="chart-wrap tw-mt-[30px] tw-w-[271px] tw-h-[371px] tw-box-border tw-pr-6">
                    <el-table :data="orgData.slice(0, 10)" stripe style="width: 100%;">
                      <el-table-column prop="date" label="序号" width="80" align="center">
                        <template v-slot="sc">
                          <div v-if="sc.row.name">{{ sc.$index + 1 }}</div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="name" label="区域" align="left">
                        <template slot-scope="scope">
                          <el-tooltip v-if="scope?.row?.name.length > 5"
                                      :key="scope?.row?.name"
                                      placement="top"
                                      popper-class="digital-economy-tooltip"
                                      :content="scope?.row?.name"
                          >
                            <span v-if="scope?.row?.name.length > 5" class="tw-w-full hpj-text-hidden">{{scope?.row?.name}}</span>
                          </el-tooltip>
                          <span v-if="!(scope?.row?.name.length > 5)" class="tw-w-full hpj-text-hidden">{{scope?.row?.name}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="value" label="数量(个)" width="80" align="center"> </el-table-column>
                    </el-table>
                  </div>
                </div>
                <div class="d-flex ai-center jc-around">
                  <!--                <map-chart-->
                  <!--                  ref="chart4"-->
                  <!--                  class-name="org-map"-->
                  <!--                  :chartData="orgMapData"-->
                  <!--                  height="417px"-->
                  <!--                  :show-back="false"-->
                  <!--                  :visual-map="{ show: false }" />-->
                  <!--                <div class="tw-w-[300px] tw-h-[300px]">-->
                  <!--                  <gis-map :mapValue="value"/>-->
                  <!--                </div>-->
                  <!--                <div class="org-grid">-->
                  <!--                  <el-table :data="orgList" stripe style="width: 100%">-->
                  <!--                    <el-table-column prop="date" label="序号" align="center">-->
                  <!--                      <template v-slot="sc">{{ sc.$index + 1 }}</template>-->
                  <!--                    </el-table-column>-->
                  <!--                    <el-table-column prop="name" label="区域" show-overflow-tooltip />-->
                  <!--                    <el-table-column prop="value" label="数量" show-overflow-tooltip />-->
                  <!--                  </el-table>-->
                  <!--                </div>-->
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <!--数字经济规模与质量-->
        <div v-if="showTabs['2']" class="scroll-item">
          <!--标题-->
          <div class="tw-mt-6 d-flex ai-center scroll-anchor">
            <img src="./icon/MoneySvg.svg" alt="" style="width: 31px;height: 31px;"/>
            <span class="tw-text-lg tw-font-medium tw-text-[#1D2129] tw-tracking-[-0.77px]">数字经济规模与质量</span>
            <el-tooltip popper-class="digital-economy" placement="top" effect="light">
              <tooltip-slot slot="content" content="反映各地区数字经济行业中企业数量和企业建设质量的情况"/>
              <img src="./icon/WhatSvg.svg" alt="" style="margin-left: 11px;width: 18px;height: 18px;"/>
            </el-tooltip>
          </div>
          <el-row type="flex" class="tw-mt-2 shadow-row">
            <el-col :span="24">
              <scatter-chart :chartData="scaleAndQuality.scoreRanking.data"
                             :option="scaleAndQuality.scoreRanking.option"
                             ref="chart6"
                             height="447px" />
            </el-col>
          </el-row>
          <div class="mb15 tw-mt-[13px] tw-w-full tw-flex tw-h-[441px]">
            <div class="shadow-row mb15 tw-rounded tw-h-full"
                 style="width: calc(50% - 8px);box-shadow: 0px 0px 14px 0px rgba(19,38,82,0.08);">
              <base-bar-chart :chartData="scaleAndQuality.registeredCapital.data"
                              :option="scaleAndQuality.registeredCapital.option"
                              height="441px"
                              ref="chart4"
                              color="#E8A961" />
            </div>
            <div class="shadow-row mb15 tw-rounded tw-h-full tw-ml-4"
                 style="width: calc(50% - 8px); box-shadow: 0px 0px 14px 0px rgba(19,38,82,0.08);">
              <base-bar-chart :chartData="scaleAndQuality.enterpriseNumber.data"
                              :option="scaleAndQuality.enterpriseNumber.option"
                              height="441px"
                              ref="chart5"
                              color="#5C82DF" />
            </div>
          </div>
        </div>
        <!--头部企业情况-->
        <div v-if="showTabs['3']" class="scroll-item">
          <!--标题-->
          <div class="tw-mt-6 d-flex ai-center scroll-anchor">
            <img src="./icon/HouseSvg.svg" alt="" style="width: 31px;height: 31px;"/>
            <span class="tw-text-lg tw-font-medium tw-text-[#1D2129] tw-tracking-[-0.77px]">头部企业情况</span>
            <el-tooltip popper-class="digital-economy" placement="top" effect="light">
              <tooltip-slot slot="content" content="反映数字经济行业优质企业区域分布情况以及区域企业竞争力水平。"/>
              <img src="./icon/WhatSvg.svg" alt="" style="margin-left: 11px;width: 18px;height: 18px;"/>
            </el-tooltip>
          </div>
          <!--头部企业情况得分排名-->
          <div class="tw-mt-2 tw-w-full tw-flex tw-h-[428px] tw-rounded"
               style="box-shadow: 0px 0px 14px 0px rgba(19,38,82,0.08);">
            <base-bar-chart :chartData="headCompanySituation.rankingOfLeadingEnterpriseStatusIndex.data"
                            :option="headCompanySituation.rankingOfLeadingEnterpriseStatusIndex.option"
                            height="428px"
                            ref="chart7"
                            color="#5C82DF"/>
          </div>
          <!--各类头部企业数量排名-->
          <div class="shadow-row mb15 head-company tw-mt-2 tw-flex tw-flex-col tw-bg-white">
            <div class="tw-mt-6 tw-ml-6 tw-text-base tw-font-medium tw-text-[#1D2129]">各类头部企业数量排名</div>
            <div class="wrap d-flex">
              <div class="left">
                <div class="item" style="visibility: hidden">-</div>
                <div v-for="(n, index) in headCompanyData[0] ? headCompanyData[0].list : []" :key="index" class="item name ell">
                  <el-tooltip v-if="n.name.length > 4"
                              :key="n.name + index"
                              placement="top"
                              popper-class="digital-economy-tooltip"
                              :content="n.name">
                    <span v-if="n.name.length > 4">{{ n.name }}</span>
                  </el-tooltip>
                  <span v-if="!(n.name.length > 4)">{{ n.name }}</span>
                </div>
              </div>
              <el-row class="right flex-1" type="flex" :gutter="10">
                <el-col v-for="n in headCompanyData" :key="n.type" :span="6">
                  <div class="d-flex ai-center item">
                    <div class="name"></div>
                    <div class="type" :style="{ color: n.color }">{{ n.type }}</div>
                  </div>
                  <div v-for="(m, index) in n.list" :key="index" class="d-flex ai-center item">
                    <div class="progress flex-1">
                      <el-progress
                        :show-text="false"
                        text-inside
                        :percentage="m?.percentage"
                        :color="n.color"
                        :define-back-color="n.backColor"
                        :stroke-width="15"
                        stroke-linecap="square"></el-progress>
                      <div class="value"
                           :style="{ left: `${Math.min(m.percentage, 76)}%` }"
                      >{{ m.value }}</div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
        <!--产业创新能力-->
        <div v-if="showTabs['4']" class="scroll-item">
          <!--标题-->
          <div class="tw-mt-6 d-flex ai-center scroll-anchor">
            <img src="./icon/LightSvg.svg" alt="" style="width: 31px;height: 31px;"/>
            <span class="tw-text-lg tw-font-medium tw-text-[#1D2129] tw-tracking-[-0.77px]">产业创新能力</span>
            <el-tooltip popper-class="digital-economy" placement="top" effect="light">
              <tooltip-slot slot="content" content="反映数字经济产业发展所需的技术投入情况和产出情况。"/>
              <img src="./icon/WhatSvg.svg" alt="" style="margin-left: 11px;width: 18px;height: 18px;"/>
            </el-tooltip>
          </div>
          <!--第一行 产业创新能力得分排名 R&D经费占GDP比重-->
          <div class="d-flex ai-center mb15 tw-mt-2">
            <!--产业创新能力得分排名-->
            <div class="shadow-row chart-wrap" style="width: 34%; height: 581px; margin-right: 18px">
              <div class="tw-mt-5 tw-ml-6 tw-text-base tw-font-medium tw-text-[#1D2129]">产业创新能力得分排名</div>
              <div class="innovate-grid">
                <el-table :data="innovateData" stripe style="width: 100%">
                  <el-table-column prop="date" label="排名" width="80" align="center">
                    <template v-slot="sc">
                      <div v-if="sc?.row?.name && sc.$index < 3" :class="`rank-icon rank${sc.$index + 1}`"></div>
                      <div v-else-if="sc?.row?.name">{{ sc.$index + 1 }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="地区" align="left">
                    <template slot-scope="scope">
                      <div class="tw-w-full hpj-text-hidden">{{scope?.row?.name}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="value" label="得分" width="80"> </el-table-column>
                </el-table>
              </div>
            </div>
            <!--R&D经费占GDP比重-->
            <div class="shadow-row flex-1">
              <!--            <base-bar-chart :chartData="industrialInnovation.rDExpenditureAsPercentageOfGDP.data"-->
              <!--                            :option="industrialInnovation.rDExpenditureAsPercentageOfGDP.option"-->
              <!--                            height="581px"-->
              <!--                            color="#897EDC" />-->
              <!--            <base-bar-chart :chartData="industrialInnovation.rDExpenditureAsPercentageOfGDP.data"-->
              <!--                            :option="industrialInnovation.rDExpenditureAsPercentageOfGDP.option"-->
              <!--                            height="581px"-->
              <!--                            color="#897EDC" />-->
              <base-bar-chart :chartData="industrialInnovation.rDExpenditureAsPercentageOfGDP.data"
                              :option="industrialInnovation.rDExpenditureAsPercentageOfGDP.option"
                              height="581px"
                              ref="chart8"
                              color="#5C82DF"/>
              <!--            <bar-group-chart-->
              <!--              :showCross="false"-->
              <!--              ref="chart6"-->
              <!--              stack="Total"-->
              <!--              :chartData="R_DData"-->
              <!--              option=""-->
              <!--              height="581px"-->
              <!--              :color="['#356DF6', '#E8A961']"-->
              <!--              :seriesItemStyle="{ borderRadius: [0, 0, 0, 0] }" />-->
            </div>
          </div>
          <!--第二行 知识产权数量图-->
          <div class="shadow-row mb15 chart-wrap tw-flex tw-flex-col tw-min-h-[581px]">
            <span class="tw-ml-6 tw-mt-5 tw-text-base tw-font-medium tw-text-[#1D2129] tw-tracking-[-0.77px]">知识产权数量图</span>
            <!--3个气泡图-->
            <div class="tw-mt-9 tw-pl-[34px] tw-pr-[34px] tw-flex tw-justify-around tw-items-center">
              <div v-for="(item, index) in industrialInnovation.numberOfIntellectualPropertyRights"
                   class="tw-w-[33%] tw-h-[485px] tw-flex tw-flex-col"
                   :key="index">
                <!--标题-->
                <div class="tw-flex tw-items-center">
                  <div class="tw-w-[1px] tw-h-[14px] tw-bg-[#356DF6]"/>
                  <span class="tw-ml-1.5 tw-text-sm tw-text-[#1D2129]">{{item.title}}</span>
                </div>
                <graph-component v-if="item.data.length > 0"
                                 :id2="item.title"
                                 class="tw-mt-2 tw-w-full tw-flex-1"
                                 :nodes="item.data"/>
              </div>
            </div>
            <!--          <div class="d-flex ai-center">-->
            <!--            <div v-for="n in innovateIndexData" :key="n.title" class="flex-1 bubble-wrap">-->
            <!--              <div class="title d-flex ai-center">{{ n.title }}</div>-->
            <!--              <div class="list flex-center ai-center">-->
            <!--                <div-->
            <!--                  v-for="(m, mi) in n.list"-->
            <!--                  :key="m.name"-->
            <!--                  class="bubble flex-center ai-center"-->
            <!--                  :style="{ width: m.size, height: m.size, background: `rgba(154, 182, 251, ${1 - mi * 0.05})` }">-->
            <!--                  {{ m.name }}-->
            <!--                </div>-->
            <!--              </div>-->
            <!--            </div>-->
            <!--          </div>-->
          </div>
        </div>
        <!--产业投资热度-->
        <div v-if="showTabs['5']" class="scroll-item">
          <!--标题-->
          <div class="tw-mt-6 d-flex ai-center scroll-anchor">
            <img src="./icon/FireSvg.svg" alt="" style="width: 31px;height: 31px;"/>
            <span class="tw-text-lg tw-font-medium tw-text-[#1D2129] tw-tracking-[-0.77px]">产业投资热度</span>
            <el-tooltip popper-class="digital-economy" placement="top" effect="light">
              <tooltip-slot slot="content" content="反映数字经济产业领域投融资活跃度。"/>
              <img src="./icon/WhatSvg.svg" alt="" style="margin-left: 11px;width: 18px;height: 18px;"/>
            </el-tooltip>
          </div>
          <div class="shadow-row mb15 chart-wrap tw-mt-2 tw-flex tw-flex-col">
            <span class="tw-ml-6 tw-mt-6 tw-text-base tw-font-medium tw-text-[#1D2129]">数字经济企业融资额分布热力图</span>
            <div class="tw-flex tw-justify-around">
              <!--地图本身-->
              <div class="tw-h-[643px]" style="width: calc(100% - 4.22vw - 354px);max-width: 1255px;">
                <gis-map id="map2"
                         :map-type="mapType2"
                         :mapValue="industrialInvestmentEnthusiasm.heatMap.value"
                         :option="industrialInvestmentEnthusiasm.heatMap.mapOption" />
              </div>
              <!--右-->
              <div class="chart-wrap" style="width: 354px; height: 483px; margin-right: 4.22vw;">
                <el-table :data="industrialInvestmentEnthusiasm.scoreList" stripe style="width: 100%">
                  <el-table-column prop="date" label="排名" width="80" align="center">
                    <template v-slot="sc">
                      <div v-if="sc?.row?.name && sc.$index < 3" :class="`rank-icon rank${sc.$index + 1}`"></div>
                      <div v-else-if="sc?.row?.name">{{ sc.$index + 1 }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="地区" align="left">
                    <template slot-scope="scope">
                      <div class="tw-w-full hpj-text-hidden">{{scope?.row?.name}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="value" label="得分" width="80" align="center"> </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
          <div class="tw-mt-2 tw-w-full tw-flex tw-h-[336px]">
            <div class="shadow-row mb15 tw-rounded tw-h-full"
                 style="width: calc(50% - 8px);box-shadow: 0px 0px 14px 0px rgba(19,38,82,0.08);">
              <base-bar-chart ref="chart9"
                              :chartData="industrialInvestmentEnthusiasm.financingAmount.data"
                              :option="industrialInvestmentEnthusiasm.financingAmount.option"
                              height="336px"/>
            </div>
            <div class="shadow-row mb15 tw-rounded tw-h-full tw-ml-4"
                 style="width: calc(50% - 8px); box-shadow: 0px 0px 14px 0px rgba(19,38,82,0.08);">
              <base-bar-chart ref="chart10"
                              :chartData="industrialInvestmentEnthusiasm.financingRound.data"
                              :option="industrialInvestmentEnthusiasm.financingRound.option"
                              color="#897EDC"
                              height="336px"/>
              <!--            <bar-group-chart-->
              <!--              :showCross="false"-->
              <!--              ref="chart10"-->
              <!--              stack="Ad"-->
              <!--              :chartData="financeTimesData"-->
              <!--              :color="['#084695', '#356DF6', '#7BA9F1', '#6740B6', '#7D6DF1', '#8AE2F5']"-->
              <!--              :seriesItemStyle="{ borderRadius: [0, 0, 0, 0] }"-->
              <!--              :grid="{ left: 30, right: 30 }"-->
              <!--              :xAxisLabel="{ rotate: 30 }" />-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import axios from 'axios';
import { debounce } from 'lodash';
import { roseColor } from '@/utils/chartColor';
import mixinScroll from '@/utils/mixinScroll';
// import mixinRegion from "@/utils/mixinRegion";
import AreaRoseChart from '@/components/AreaRoseChart';
import BaseBarChart from '@/components/BaseBarChart';
import ScatterChart from '@/components/ScatterChart';
import GisMap from "@/views/economy-index/digital-economy/components/GISMap/Gis-Map";
import { colorList, map2ColorList, reverseMapColorList } from '@/views/economy-index/digital-economy/static';
import GraphComponent from "@/views/economy-index/digital-economy/components/GraphComponent";
import RadarComponent from './components/RadarComponent';
import request from "@/utils/request";
import CascaderSelect from './components/CascaderSelect.vue';
import {mapGetters} from "vuex";
import TooltipSlot from "@/views/economy-index/digital-economy/components/TooltipSlot";

// 直辖市
const centralCityCodes = [110000, 120000, 310000, 500000];

export default {
  name: 'digital-economy',
  mixins: [mixinScroll],
  components: {
    TooltipSlot,
    GraphComponent,
    GisMap,
    AreaRoseChart,
    BaseBarChart,
    RadarComponent,
    ScatterChart,
    CascaderSelect
  },
  data() {
    return {
      regionProps: {
        value: 'value',
        label: 'label',
        level: 'level',
        children: 'children'
      },
      // 客户级别，省级客户1 or 市级客户2
      orgLevel: null,
      // 最大长度限制
      maxLength: 15,
      // 加载中
      loading: false,
      // 地图相关
      // 显示省还是市，省:china, 市:chinaAllCity, 具体某个省:省的adcode
      mapType: 'china',
      // 下面的2个地图展示的type，可能为china, chinaAllCity, 具体某个省的adcode
      mapType2: 'china',
      mapTypeList: [
        {
          name: '省',
          value: 'china',
        },
        {
          name: '市',
          value: 'chinaAllCity',
        },
      ],
      // 地图的动态样式
      map1Style: {
        left: 0,
      },
      map1: {
        value: [],
        valueAllCity: [],
        mapOption: {
          visualMap: {
            left: 54,
            bottom: 32,
            type: 'piecewise',
            orient: 'vertical',
            itemWidth: 16,
            itemHeight: 16,
            itemGap: 12,
            selectedMode: false,
            textGap: 12,
            textStyle: {
              color: '#828282',
              fontSize: 14,
              lineHeight: 14,
            },
            precision: 1,
            pieces: [
              { min: 0.0, max: 0.2, },
              { min: 0.2, max: 0.4, },
              { min: 0.4, max: 0.6, },
              { min: 0.6, max: 0.8, },
              { min: 0.8, max: 1.0, },
            ],
            inRange: {
              color: reverseMapColorList,
            }
          },
          series: [{
            width: '58%',
            right: '13%',
            top: 30,
            name: 'hhh',
            type: 'map',
            map: 'china',
            itemStyle: {
              borderColor: '#3C5979',
              borderWidth: 0.2,
              areaColor: '#E3ECF6',
            },
            emphasis: {
              label: {
                show: false,
              },
              itemStyle: {
                areaColor: '#356EF5',
              },
            },
            select: {
              disabled: true,
            },
          }],
        },
      },
      hoverItem: null,
      // 当前定位
      currentLocation: null,
      currentLocationList: [],
      // 对比区域
      defaultProps: {
        value: 'regionCode',
        label: 'regionName',
        level: 'regionLevel'
      },
      defaultValue: {},
      regionLevel: null,
      // 其它
      selectedContrastAreaList: [],
      scrollOffset: -84,
      roseColor,
      indexType: 0,
      regionData: [],
      areaId: '',
      tabIndex: 0,
      showTabs: {
        0: true,
        1: true,
        2: true,
        3: true,
        4: true,
        5: true
      },
      // 总指数排名
      cityIndexRankData: {
        datas: []
      },
      cityIndexRankOption: {
        // 悬浮提示
        tooltip: {
          show: true,
          trigger: 'item',
          // axisPointer: {
          //   type: 'shadow',
          // },
        },
        // 默认展示文字，溢出不需要隐藏
      },
      // 综合发展对比
      // 选择的对比区域
      selectedCompareAreaList: [],
      colorList,
      chart2Option: {
        color: colorList,
        radar: {
          center: ['42%', '50%'],
          radius: 110,
          splitArea: {
            areaStyle: {
              color: '#fefefe',
            },
          },
          splitNumber: 3,
          splitLine: {
            lineStyle: {
              color: '#f2f2f2',
            },
          },
          axisName: {
            color: '#1A262C',
          },
          axisLine: {
            lineStyle: {
              color: '#f5f5f5',
            }
          },
          indicator: [
            { name: '政策与环境', max: 1 },
            { name: '产业投资热度', max: 1 },
            { name: '产业创新能力', max: 1 },
            { name: '头部企业', max: 1 },
            { name: '规模与质量', max: 1 }
          ],
          nameGap: 2,
        },
        legend: {
          type: 'scroll',
          show: true,
          top: 20,
          // bottom: 20,
          left: '80%',
          height: 310,
          // right: 16,
          orient: 'vertical',
          itemWidth: 8,
          itemHeight: 8,
          itemStyle: {
          },
          textStyle: {
            color: '#86909C',
            fontSize: 14,
            width: 50,
            overflow: 'truncate',
          },
          pageIconColor:'#C2CCDB',
          pageIconInactiveColor:'#DEE7F6',
        },
        // title: {
        //   show: true,
        //   top: 22,
        //   left: 25,
        //   text: '综合发展对比',
        //   textStyle: {
        //     color: '#1A262C',
        //     fontWeight: 500,
        //     fontSize: 14
        //   },
        // },
      },
      // 全部的综合发展对比
      allGrowCompareData: {
        data: []
      },
      // 展示的综合发展对比
      showGrowCompareData: {
        data: [],
      },
      // 数字经济政策与环境
      // 政策与环境得分排名
      envRankData: [],
      // 数字经济产业政策数量
      policyDataOption: {
        title: {
          show: true,
          top: 22,
          left: 25,
          text: '数字经济产业政策数量',
          textStyle: {
            color: '#1A262C',
            fontWeight: 500,
            fontSize: 16,
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            label: {
              backgroundColor: '#6a7985'
            },
            lineStyle: {
              color: 'rgba(53, 109, 246, 0.10)',
              width: '40',
              type: 'solid'
            }
          },
          // 将formatter添加单位，通过设置valueFormatter
          valueFormatter: (value) => {
            return value + '(个)';
          },
        },
        yAxis: {
          show: true,
          type: 'value',
          splitNumber: 8,
          minInterval: 1,
          name: '(个)',
          nameLocation: 'end',
          nameTextStyle: {
            fontSize: 12,
            fontWeight: 500,
            color: '#86909C',
            padding: [0, 0, 0, -40],
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#E5E6EB',
            }
          },
        },
      },
      policyData: {
        barWidth: 14,
        xdata: [],
        ydata: []
      },
      // 数字经济产业相关联盟、协会及研究机构数量
      orgData: [],
      orgOption: {
        visualMap: {
          show: false,
          left: 54,
          bottom: 32,
          type: 'piecewise',
          orient: 'vertical',
          inverse: true,
          itemWidth: 30,
          itemHeight: 13,
          itemGap: 0,
          itemSymbol: 'rect',
          selectedMode: false,
          textGap: 12,
          textStyle: {
            color: '#828282',
            fontSize: 13,
            lineHeight: 13,
          },
          precision: 0,
          splitNumber: 5,
          min: 0,
          max: 0,
          // pieces: [
          //   { min: 0, max: 10, },
          //   { min: 10, max: 20, },
          //   { min: 20, max: 30, },
          //   { min: 0.6, max: 0.8, },
          //   { min: 0.8, max: 1.0, },
          // ],
          inRange: {
            color: reverseMapColorList,
          },
        },
        series: [{
          // width: 'calc(100% - 38px)',
          // width: '50%',
          // top: 22,
          // left: 19,
          // right: 19,
          name: 'hhh',
          type: 'map',
          // map: 'china',
          itemStyle: {
            borderColor: '#3C5979',
            borderWidth: 0.2,
            areaColor: '#E3ECF6',
          },
          emphasis: {
            itemStyle: {
              areaColor: '#356EF5',
            },
            // 不显示值
            label: {
              show: false,
            },
            // label: {
            //   show: true,
            //   color: '#fff',
            //   fontSize: 12,
            //   fontWeight: 500,
            //   formatter: function (params) {
            //
            //     return params?.data?.name + '\n' + params?.data?.value;
            //   }
            // },
          },
          select: {
            disabled: true,
          },
        }],
        // 高亮显示省份+值
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: function (params) {
            return params?.name + '\n' + ( (params?.value || params?.value===0)  ? params?.value+'(个)' : '-');
          }
        },
      },
      // 数字经济规模与质量
      scaleAndQuality: {
        // 企业本地区数字经济企业注册资本总数
        registeredCapital: {
          data: {
            barWidth: 14,
            xdata: [],
            ydata: []
          },
          option: {
            title: {
              show: true,
              top: 22,
              left: 25,
              text: '本地区数字经济企业注册资本总数',
              textStyle: {
                color: '#1D2129',
                fontWeight: 500,
                fontSize: 16
              },
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'line',
                label: {
                  backgroundColor: '#6a7985'
                },
                lineStyle: {
                  color: 'rgba(53, 109, 246, 0.10)',
                  width: '40',
                  type: 'solid'
                }
              },
              // formatter: (params) => {
              //   const { name, value } = params[0];
              //   return name + '\n' + ( (value || value===0)  ? (value + '(万元)') : '-');
              // },
              // 将formatter添加单位，通过设置valueFormatter
              valueFormatter: (value) => {
                return value + '(万元)';
              },
            },
            yAxis: {
              show: true,
              type: 'value',
              splitNumber: 8,
              name: '(万元)',
              nameLocation: 'end',
              nameTextStyle: {
                fontSize: 12,
                fontWeight: 500,
                color: '#86909C',
                padding: [0, 0, 0, -50],
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#E5E6EB',
                }
              },
            },
          }
        },
        // 企业本地区数字经济企业数量
        enterpriseNumber: {
          data: {
            barWidth: 14,
            xdata: [],
            ydata: []
          },
          option: {
            title: {
              show: true,
              top: 22,
              left: 25,
              text: '本地区数字经济企业数量',
              textStyle: {
                color: '#1D2129',
                fontWeight: 500,
                fontSize: 16
              },
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'line',
                label: {
                  backgroundColor: '#6a7985'
                },
                lineStyle: {
                  color: 'rgba(53, 109, 246, 0.10)',
                  width: '40',
                  type: 'solid'
                }
              },
              // formatter: (params) => {
              //   const { name, value } = params[0];
              //   return name + '\n' + ( (value || value===0)  ? (value + '(个)') : '-');
              // },
              // 将formatter添加单位，通过设置valueFormatter
              valueFormatter: (value) => {
                return value + '(个)';
              },
            },
            yAxis: {
              show: true,
              type: 'value',
              splitNumber: 8,
              minInterval: 1,
              name: '(个)',
              nameLocation: 'end',
              nameTextStyle: {
                fontSize: 12,
                fontWeight: 500,
                color: '#86909C',
                padding: [0, 0, 0, -40],
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#E5E6EB',
                }
              },
            },
          }
        },
        // 经济规模与质量得分排名
        scoreRanking: {
          data: {
            barWidth: 14,
            xdata: [],
            ydata: []
          },
          option: {
            title: {
              show: true,
              top: 22,
              left: 25,
              text: '经济规模与质量得分排名',
              textStyle: {
                color: '#1D2129',
                fontWeight: 500,
                fontSize: 16
              },
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'none',
                label: {
                  backgroundColor: '#6a7985'
                },
                lineStyle: {
                  color: 'rgba(53, 109, 246, 0.10)',
                  width: '40',
                  type: 'solid'
                }
              }
            },
            // xAxis: {
            //   axisLine: {
            //     show: false
            //   },
            // },
            yAxis: {
              show: true,
              type: 'value',
              splitNumber: 8,
              name: '',
              nameLocation: 'end',
              nameTextStyle: {
                fontSize: 12,
                fontWeight: 500,
                color: '#86909C',
                padding: [0, 0, 0, -50],
              },
              splitLine: {
                show: false
              },
            },
          }
        }
      },
      // 头部企业情况
      headCompanySituation: {
        // 头部企业情况得分排名
        rankingOfLeadingEnterpriseStatusIndex: {
          data: {
            barWidth: 14,
            xdata: [],
            ydata: []
          },
          option: {
            title: {
              show: true,
              top: 22,
              left: 25,
              text: '头部企业情况得分排名',
              textStyle: {
                color: '#1D2129',
                fontWeight: 500,
                fontSize: 16
              },
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'line',
                label: {
                  backgroundColor: '#6a7985'
                },
                lineStyle: {
                  color: 'rgba(53, 109, 246, 0.10)',
                  width: '40',
                  type: 'solid'
                }
              }
            },
            yAxis: {
              show: true,
              type: 'value',
              splitNumber: 8,
              minInterval: 0.01,
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#E5E6EB',
                }
              },
            },
          },
        },
      },
      // 产业创新能力
      industrialInnovation: {
        // 产业创新能力得分排名
        rankingOfIndustrialInnovationCapacityScore: {},
        // R&D经费占GDP比重
        rDExpenditureAsPercentageOfGDP: {
          data: {
            barWidth: 14,
            xdata: [],
            ydata: []
          },
          option: {
            title: {
              show: true,
              top: 22,
              left: 25,
              text: 'R&D经费占GDP比重',
              textStyle: {
                color: '#1D2129',
                fontWeight: 500,
                fontSize: 16
              },
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'line',
                label: {
                  backgroundColor: '#6a7985'
                },
                lineStyle: {
                  color: 'rgba(53, 109, 246, 0.10)',
                  width: '40',
                  type: 'solid'
                }
              },
              // formatter: (params) => {
              //   const { name, value } = params[0];
              //   return name + '\n' + ( (value || value===0)  ? (value + '%') : '-');
              // },
              // 将formatter添加单位，通过设置valueFormatter
              valueFormatter: (value) => {
                return value + '%';
              },
            },
            yAxis: {
              show: true,
              type: 'value',
              splitNumber: 8,
              minInterval: 0.1,
              name: '(%)',
              nameLocation: 'end',
              nameTextStyle: {
                fontSize: 12,
                fontWeight: 500,
                color: '#86909C',
                padding: [0, 0, 0, -40],
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#E5E6EB',
                }
              },
            },
            // label: {
            //   show: false,
            //   position: 'top',
            //   color: '#86909C',
            //   fontSize: 14,
            //   letterSpacing: -1,
            //   lineHeight: 20,
            //   fontWeight: 500,
            //   formatter: function (params) {
            //     return params.value + '%'
            //   },
            // },
          }
        },
        // 知识产权数量图
        numberOfIntellectualPropertyRights: [
          {
            title: '软著数量分布',
            data: [],
          },
          {
            title: '专利数量分布',
            data: [],
          },
          {
            title: '商标数量分布',
            data: [],
          }
        ],
      },
      // 产业投资热度
      industrialInvestmentEnthusiasm: {
        // 数字经济企业融资额分布热力图
        heatMap: {
          value: [],
          mapOption: {
            visualMap: {
              text: ['', '单位：(亿元)'],
              showLabel: true,
              left: 54,
              bottom: 32,
              type: 'piecewise',
              orient: 'vertical',
              inverse: true,
              itemWidth: 30,
              itemHeight: 13,
              itemGap: 0,
              itemSymbol: 'rect',
              selectedMode: false,
              textGap: 12,
              textStyle: {
                color: '#828282',
                fontSize: 13,
                lineHeight: 13,
              },
              precision: 1,
              pieces: [
                { max: 0.1, },
                { min: 0.1, max: 1, },
                { min: 1, max: 200, },
                { min: 200, max: 400, },
                { min: 400, max: 600, },
                { min: 600, max: 800, },
                { min: 800, max: 1000, },
                { min: 1000, },
              ],
              inRange: {
                color: map2ColorList,
              },
            },
            series: [{
              // width: '60%',
              // right: '20%',
              // top: 50,
              name: 'hhh',
              type: 'map',
              map: 'china',
              itemStyle: {
                borderColor: '#3C5979',
                borderWidth: 0.2,
                areaColor: '#F4CECD',
              },
              emphasis: {
                label: {
                  show: false,
                },
                itemStyle: {
                  areaColor: '#A62A23',
                },
              },
              select: {
                disabled: true,
              },
            }],
            // 高亮显示省份+值
            tooltip: {
              show: true,
              trigger: 'item',
              formatter: function (params) {
                return params?.name + '\n' + ( (params?.value || params?.value===0)  ? (params?.value + '亿元') : '-');
              },
            },
          },
        },
        // 得分
        scoreList: [],
        // 融资额度
        financingAmount: {
          data: {
            barWidth: 14,
            xdata: [],
            ydata: []
          },
          option: {
            title: {
              show: true,
              top: 22,
              left: 25,
              text: '融资额度',
              textStyle: {
                color: '#1D2129',
                fontWeight: 500,
                fontSize: 16
              },
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'line',
                label: {
                  backgroundColor: '#6a7985'
                },
                lineStyle: {
                  color: 'rgba(53, 109, 246, 0.10)',
                  width: '40',
                  type: 'solid'
                }
              },
              valueFormatter: (value) => {
                return value + '(亿元)';
              },
            },
            yAxis: {
              show: true,
              type: 'value',
              splitNumber: 8,
              name: '(亿元)',
              nameLocation: 'end',
              nameTextStyle: {
                fontSize: 12,
                fontWeight: 500,
                color: '#86909C',
                padding: [0, 0, 0, -40],
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#E5E6EB',
                }
              },
            },
          }
        },
        // 融资轮次
        financingRound: {
          data: {
            barWidth: 14,
            xdata: [],
            ydata: []
          },
          option: {
            title: {
              show: true,
              top: 22,
              left: 25,
              text: '融资轮次',
              textStyle: {
                color: '#1D2129',
                fontWeight: 500,
                fontSize: 16
              },
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'line',
                label: {
                  backgroundColor: '#6a7985'
                },
                lineStyle: {
                  color: 'rgba(53, 109, 246, 0.10)',
                  width: '40',
                  type: 'solid'
                }
              },
              // 通过valueFormat来添加单位
              valueFormatter: (value) => {
                return value + '(次)';
              },
            },
            yAxis: {
              show: true,
              type: 'value',
              splitNumber: 8,
              minInterval: 1,
              name: '(次数)',
              nameLocation: 'end',
              nameTextStyle: {
                fontSize: 12,
                fontWeight: 500,
                color: '#86909C',
                padding: [0, 0, 0, -40],
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#E5E6EB',
                }
              },
            },
          },
        }
      },
      // old
      // 各类头部企业数量排名
      headCompanyData: [
        {
          type: '上市企业数量',
          color: '#E8A961',
          backColor: 'rgba(232, 169, 97, 0.08)',
          list: []
        },
        {
          type: '独角兽企业数量',
          color: '#356DF6',
          backColor: 'rgba(53, 109, 246, 0.08)',
          list: []
        },
        {
          type: '瞪羚企业数量',
          color: '#6FCCBB',
          backColor: 'rgba(111, 204, 187, 0.08)',
          list: []
        },
        {
          type: '高新技术企业数量',
          color: '#897EDC',
          backColor: 'rgba(137, 126, 220, 0.08)',
          list: []
        }
      ],
      // 产业创新能力得分排名
      innovateData: [],
      innovateIndexData: [
        {
          title: '软著数量分布',
          list: []
        },
        {
          title: '专利数量分布',
          list: []
        },
        {
          title: '商标数量分布',
          list: []
        }
      ],
      financeMapData: {
        code: 'china',
        name: '中国',
        min: 0,
        max: 0,
        isInit: false, // 初始化组件historyList使用
        data: []
      },
    };
  },
  computed: {
    ...mapGetters(['iep_platform_MENU_ID']),
    // 省市区选择器的父级adcode
    cascaderProvinceCode() {
      const currentLocationObject = this.currentLocationList.find((_item) => _item.adcode == this.currentLocation);
      if (currentLocationObject && currentLocationObject.level === 2) {
        return currentLocationObject.parentAdcode;
      }
      return null;
    },
    // 省市区选择器可选的级别，省1，市2
    cascaderSelectLevel() {
      let selectLevelList = [];
      const currentLocationObject = this.currentLocationList.find((_item) => _item.adcode == this.currentLocation);
      if (currentLocationObject) {
        // 如果currentLocationObject.adcode是直辖市的adcode，selectLevelList的规则：如果对比区域为[],则为[1,2];如果对比区域的第一个的regionLevel为1时，selectLevelList为[1];如果对比区域的第一个的regionLevel为2时,selectLevelList为[2]
        if (centralCityCodes.includes(currentLocationObject.adcode)) {
          if (this.selectedContrastAreaList.length === 0) {
            selectLevelList = [1, 2];
          } else {
            const { regionLevel } = this.selectedContrastAreaList[0];
            selectLevelList = [regionLevel];
          }
        } else {
          selectLevelList = [currentLocationObject.level];
        }
      }
      return selectLevelList;
    },
    cascaderTabs() {
      let list = [];
      const currentLocationObject = this.currentLocationList.find((_item) => _item.adcode == this.currentLocation);
      if (currentLocationObject) {
        if (centralCityCodes.includes(currentLocationObject.adcode)) {
          list = ['province', 'city'];
        } else {
          list = currentLocationObject.level === 1 ? ['province'] : ['province', 'city'];
        }
      }
      return list;
    },
  },
  watch: {
    currentLocation(val) {
      // 清空对比区域数据
      this.$refs.CascaderSelect.clearValueList();
      this.selectedContrastAreaList = [];
      this.getIndexData();
    },
  },
  created() {
    // console.log('localStorage.getItem(\'iep_platform_region_dict\'): ', localStorage.getItem('iep_platform_region_dict'));
    this.regionTree = JSON.parse(localStorage.getItem('iep_platform_region_dict'))[0]?.children;
    this.debounceResizeChart = debounce(this.resizeChart, 0);
    window.addEventListener('resize', this.debounceResizeChart);
    // 获取地图数据
    this.getGisInfo();
    this.getGisInfoAllCity();
    // 获取当前定位列表
    this.getCurrentLocationList().then(res => {
      // 获取指数信息
      this.getIndexData();
    });
  },
  mounted() {
    // 监听窗口大小变化，更新 mapContainerStyle 中的 left 属性
    window.addEventListener('resize', this.updateMap1Style);
    this.updateMap1Style(); // 初始化设置一次
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.debounceResizeChart);
    // 在组件销毁前移除窗口大小变化的监听器
    window.removeEventListener('resize', this.updateMap1Style);
  },
  methods: {
    // 对比区域组件的方法
    confirmRegion(list) {
      console.log('confirmRegion: ', list);
      this.selectedContrastAreaList = list;
      this.getIndexData();
      // if (val.length > 0) {
      //   const { children, regionCode, province, city, district } = val[0];
      //   let list = [];
      //   if (province.regionCode) {
      //     list.push(province);
      //   }
      //   if (city.regionCode && !list.find((n) => n.regionCode == city.regionCode)) {
      //     list.push(city);
      //   }
      //   if (district.regionCode) {
      //     list.push(district);
      //   }
      //   this.regionList = list.concat(children);
      //   this.regionCode = regionCode;
      // } else {
      //   this.regionList = [];
      //   this.regionCode = '';
      // }
    },
    // 监听窗口大小变化，更新 mapContainerStyle 中的 left 属性
    updateMap1Style() {
      this.map1Style.left = Math.max((window.innerWidth - 1920)/2, 0) + 'px';
    },
    // 添加对比区域
    clickAddCompareArea(item) {
      const index = this.selectedCompareAreaList.findIndex((_item) => (_item.name === item.name));
      if (index === -1) {
        this.selectedCompareAreaList.push(item);
        this.changeGrowCompareData();
      }
    },
    // 当前定位删除对比区域
    clickDeleteContrastArea(item) {
      // 调用ref为CascaderSelect内部的删除方法
      this.$refs.CascaderSelect.removeValue(item);
    },
    // 删除对比区域
    clickDeleteCompareArea(item) {
      // 只有1项时，不可删除
      if (this.selectedCompareAreaList.length === 1) {
        // 提示不可删除
        this.$message({
          type: 'warning',
          message: '至少保留一个对比区域'
        });
        return;
      }
      const index = this.selectedCompareAreaList.findIndex((_item) => (_item.name === item.name));
      if (index > -1) {
        this.selectedCompareAreaList.splice(index, 1);
        this.changeGrowCompareData();
      }
    },
    // 改变综合发展对比 对比区域
    changeGrowCompareData() {
      let newList = [];
      for(let i = 0; i < this.selectedCompareAreaList.length; i += 1) {
        const item = this.selectedCompareAreaList[i];
        const index = this.allGrowCompareData.data.findIndex((_item) => (_item.name === item.name));
        if (index > -1) {
          newList.push(this.allGrowCompareData.data[index]);
        }
      }
      this.showGrowCompareData.data = newList;
    },
    // 将地图数据补充完整，补充没有数据的省份，用0填充
    fillMapDataWithZero(list) {
      const newList = [...list];
      const provinceList = this.$china.features;
      for(let i=0;i<provinceList.length;i++) {
        const province = provinceList[i];
        const provinceName = province.properties.name;
        const provinceData = newList.find((item) => item.name === provinceName);
        if(!provinceData) {
          newList.push({
            name: provinceName,
            value: 0,
          });
        }
      }
      return newList;
    },
    // 获取当前定位列表
    async getCurrentLocationList() {
      // this.currentLocationList = [
      //   {
      //     name: '安徽省',
      //     adcode: 340000,
      //     level: 1,
      //     // 上级adcode
      //     parentAdcode: 100000,
      //   },
      //   {
      //     name: '合肥市',
      //     adcode: 340100,
      //     level: 2,
      //     // 上级adcode
      //     parentAdcode: 340000,
      //   },
      // ];
      const {data} = await request({
        url: '/user/user/org',
        method: 'get',
      })
      console.log('当前定位列表', data);
      this.currentLocationList = [];
      if (data?.province) { // 如果存在province，省级用户
        if (!(data?.city)) {
          // 如果city不存在，说明是省级客户
          this.currentLocationList.push({
            name: data.provinceName,
            adcode: Number(data.province),
            level: 1,
            // 上级adcode
            parentAdcode: 100000,
          });
          // 判断data?.province是否为直辖市的adcode，如果为直辖市的adcode，说明是市级客户
          const isMunicipality = centralCityCodes.includes(Number(data.province));
          if (isMunicipality) {
            // 如果是直辖市
            this.orgLevel = 2;
          } else {
            // 不是直辖市, 为省级客户,添加对应的省会城市数据，待完成
            this.orgLevel = 1;
          }
        } else {
          // 为市级客户
          this.orgLevel = 2;
          this.currentLocationList.push({
            name: data.provinceName,
            adcode: Number(data.province),
            level: 1,
            // 上级adcode
            parentAdcode: 100000,
          });
          this.currentLocationList.push({
            name: data.cityName,
            adcode: Number(data.city),
            level: 2,
            // 上级adcode
            parentAdcode: Number(data.province),
          });
        }
      } else {// 不存在province，说明是市级用户
        this.orgLevel = 2;
        this.currentLocationList.push({
          name: data.cityName,
          adcode: Number(data.city),
          level: 2,
          // 上级adcode
          parentAdcode: data?.province ? Number(data?.province) : 100000,
        });
      }
      // 放一些默认值，北京市，上海市，广州市，深圳市
      // const defaultList = [
      //   {
      //     name: '北京市',
      //     adcode: 110000,
      //     level: 1,
      //     // 上级adcode
      //     parentAdcode: 100000,
      //   },
      //   {
      //     name: '上海市',
      //     adcode: 310000,
      //     level: 1,
      //     // 上级adcode
      //     parentAdcode: 100000,
      //   },
      //   {
      //     name: '广州市',
      //     adcode: 440100,
      //     level: 2,
      //     // 上级adcode
      //     parentAdcode: 440000,
      //   },
      //   {
      //     name: '深圳市',
      //     adcode: 440300,
      //     level: 2,
      //     // 上级adcode
      //     parentAdcode: 440000,
      //   },
      //   {
      //     name: '新疆维吾尔自治区',
      //     adcode: 650000,
      //     level: 1,
      //     // 上级adcode
      //     parentAdcode: 100000,
      //   },
      //   {
      //     name: '哈密市',
      //     adcode: 650500,
      //     level: 2,
      //     // 上级adcode
      //     parentAdcode: 650000,
      //   },
      //   {
      //     name: '北屯市',
      //     adcode: 659005,
      //     level: 2,
      //     // 上级adcode
      //     parentAdcode: 650000,
      //   },
      // ];
      // this.currentLocationList = [...defaultList, ...this.currentLocationList];
    },
    // 获取指数信息前，对数据进行处理
    beforeSetIndexData() {
      this.selectedCompareAreaList = [];
      this.mapType2 = 'china';
    },
    // 获取指数信息
    async getIndexData() {
      this.loading = true;
      // 对下面的数据进行处理
      this.beforeSetIndexData();
      // 参数
      const currentLocationObject = this.currentLocationList.find((_item) => _item.adcode == this.currentLocation);
      let params = {
        org_level: this.orgLevel,
      };
      if (this.orgLevel === 1) {
        this.mapType2 = 'china';
      } else {
        this.mapType2 = 'chinaAllCity';
      }
      if (currentLocationObject) {
        let area_level = currentLocationObject.level;
        let org_level = this.orgLevel;
        // 如果currentLocationObject.adcode是直辖市的adcode，area_level的规则：如果对比区域的第一个的regionLevel为1时，area_level为1;如果对比区域的第一个的regionLevel为2时,area_level为2
        if (centralCityCodes.includes(currentLocationObject.adcode) && this.selectedContrastAreaList.length > 0) {
          const { regionLevel } = this.selectedContrastAreaList[0];
          if (regionLevel === 1) {
            area_level = 1;
            org_level = 1;
          } else if (regionLevel === 2) {
            area_level = 2;
            org_level = 2;
          }
        }
        params = {
          current_area: currentLocationObject.adcode,
          area_level,
          // 对比区域列表
          compare_area: this.selectedContrastAreaList.map((item) => item.regionCode),
          org_level,
        }
        // 设置mapType2
        if (area_level === 1) {
          this.mapType2 = 'china';
        } else if (area_level === 2) {
          // 如果currentLocationObject.adcode是直辖市的adcode,mapType2为chinaAllCity,否则为currentLocationObject.parentAdcode
          // if (centralCityCodes.includes(currentLocationObject.adcode)) {
          //   this.mapType2 = 'chinaAllCity';
          // } else {
          //   this.mapType2 = currentLocationObject.parentAdcode;
          // }
          this.mapType2 = 'chinaAllCity';
        }
      }
      const res = await axios.get('/pythonApi/index/detail', {
        params,
      });
      const data = res.data.data;
      // 总指数排名
      this.cityIndexRankData.datas = data.total_index.map((item) => ({
        ...item,
        value: Number(item.value).toFixed(3)
      }));
      this.allGrowCompareData.data = data.total_index.map((item, index) => ({
        ...item,
        value: [
          Number(item.policy_env_score).toFixed(3),
          Number(item.invest_hot_score).toFixed(3),
          Number(item.cq_score).toFixed(3),
          Number(item.topn_score).toFixed(3),
          Number(item.size_score).toFixed(3),
        ],
        symbol: 'none',
        symbolSize: 6,
        areaStyle: {
          opacity: 0.12
        },
        lineStyle: {
          width: 1,
          opacity: 0.47
        }
      }));
      let newItem = null;
      if (this.currentLocation) {
        newItem = this.allGrowCompareData.data.find((item) => item.adcode == this.currentLocation);
      } else {
        newItem = this.allGrowCompareData.data[0];
      }
      this.selectedCompareAreaList.push(newItem);
      this.changeGrowCompareData();
      // 政策与环境得分排名
      this.envRankData = data.policy_env.score_list.map((item) => ({
        ...item,
        value: Number(item.value).toFixed(3)
      }));
      // 数字经济产业政策数量
      // 将data.policy_env.policy_num_list根据value排序
      // data.policy_env.policy_num_list.sort((a, b) => b.value - a.value);
      this.policyData.xdata = data.policy_env.policy_num_list.map((item) => item.name);
      this.policyData.ydata = data.policy_env.policy_num_list.map((item) => item.value);
      // 数字经济产业相关联盟、协会及研究机构数量
      // data.policy_env.research_org_num_list.sort((a, b) => b.value - a.value);
      this.orgData = data.policy_env.research_org_num_list.map((item) => ({
        ...item,
      }));
      // 如果orgData的长度小于10，将其补充到10
      if (this.orgData.length < 10) {
        const orgDataLength = this.orgData.length;
        for (let i = 0; i < 10 - orgDataLength; i++) {
          this.orgData.push({
            name: '',
            value: '',
          });
        }
      }
      this.orgOption.visualMap.max = Math.max(...this.orgData.map((item) => item?.value)) + 1;
      console.log('max: ', this.orgOption.visualMap.max);
      // this.orgData = this.fillMapDataWithZero(this.orgData);
      // 数字经济规模与质量 scaleAndQuality
      // 企业本地区数字经济企业注册资本总数 registeredCapital
      this.scaleAndQuality.registeredCapital.data.xdata = data.size_quality.map((item) => item.name);
      this.scaleAndQuality.registeredCapital.data.ydata = data.size_quality.map((item) => Number(item.reg_capital_total/10000).toFixed(2));
      // 企业本地区数字经济企业数量 enterpriseNumber
      this.scaleAndQuality.enterpriseNumber.data.xdata = data.size_quality.map((item) => item.name);
      this.scaleAndQuality.enterpriseNumber.data.ydata = data.size_quality.map((item) => item.local_ent_num);
      // 经济规模与质量得分排名 scoreRanking
      this.scaleAndQuality.scoreRanking.data.xdata = data.size_quality.map((item) => item.name);
      this.scaleAndQuality.scoreRanking.data.ydata = [data.size_quality.map((item) => Number(item.score).toFixed(3))];
      // 头部企业情况
      // 头部企业情况得分排名
      this.headCompanySituation.rankingOfLeadingEnterpriseStatusIndex.data.xdata = data.topn_ent_list.map((item) => item.name);
      this.headCompanySituation.rankingOfLeadingEnterpriseStatusIndex.data.ydata = data.topn_ent_list.map((item) => item.score);
      // 各类头部企业数量排名
      // 上市企业数量
      const maxListCompanyNum = Math.max(...data.topn_ent_list.map((item) => item.list_company_num));
      this.headCompanyData[0].list = data.topn_ent_list.map((item) => {
        return {
          value: item.list_company_num,
          name: item.name,
          percentage: maxListCompanyNum > 0 ? ((item.list_company_num) * 100) / maxListCompanyNum : 0,
        };
      });
      // 如果list的长度小于this.maxLength，将其补充到this.maxLength
      if (this.headCompanyData[0].list.length < this.maxLength) {
        const listLength = this.headCompanyData[0].list.length;
        for (let i = 0; i < this.maxLength - listLength; i++) {
          this.headCompanyData[0].list.push({
            name: '',
            value: '',
            percentage: 0,
          });
        }
      }
      // 独角兽企业数量
      const maxUnicornsNum = Math.max(...data.topn_ent_list.map((item) => item.unicorns_num));
      this.headCompanyData[1].list = data.topn_ent_list.map((item) => {
        return {
          value: item.unicorns_num,
          name: item.name,
          percentage: maxUnicornsNum > 0 ? ((item.unicorns_num) * 100) / maxUnicornsNum : 0,
        };
      });
      // 如果this.headCompanyData[1].list的长度小于this.maxLength，将其补充到this.maxLength
      if (this.headCompanyData[1].list.length < this.maxLength) {
        const unicornsLength = this.headCompanyData[1].list.length;
        for (let i = 0; i < this.maxLength - unicornsLength; i++) {
          this.headCompanyData[1].list.push({
            name: '',
            value: '',
            percentage: 0,
          });
        }
      }
      // 瞪羚企业数量
      const maxGazelleNum = Math.max(...data.topn_ent_list.map((item) => item.gazelle_num));
      console.log('maxGazelleNum: ', maxGazelleNum);
      this.headCompanyData[2].list = data.topn_ent_list.map((item) => {
        return {
          value: item.gazelle_num,
          name: item.name,
          percentage: maxGazelleNum > 0 ? ((item.gazelle_num) * 100) / maxGazelleNum : 0,
        };
      });
      // 如果this.headCompanyData[2].list的长度小于this.maxLength，将其补充到this.maxLength
      if (this.headCompanyData[2].list.length < this.maxLength) {
        const gazelleLength = this.headCompanyData[2].list.length;
        for (let i = 0; i < this.maxLength - gazelleLength; i++) {
          this.headCompanyData[2].list.push({
            name: '',
            value: '',
            percentage: 0,
          });
        }
      }
      // 高新技术企业数量
      const maxHighTechEntNum = Math.max(...data.topn_ent_list.map((item) => item.high_tech_ent_num));
      this.headCompanyData[3].list = data.topn_ent_list.map((item) => {
        return {
          value: item.high_tech_ent_num,
          name: item.name,
          percentage: maxHighTechEntNum > 0 ? ((item.high_tech_ent_num) * 100) / maxHighTechEntNum : 0,
        };
      });
      // 如果this.headCompanyData[3].list的长度小于this.maxLength，将其补充到this.maxLength
      if (this.headCompanyData[3].list.length < this.maxLength) {
        const highTechEntLength = this.headCompanyData[3].list.length;
        for (let i = 0; i < this.maxLength - highTechEntLength; i++) {
          this.headCompanyData[3].list.push({
            name: '',
            value: '',
            percentage: 0,
          });
        }
      }
      // 产业创新能力
      // 产业创新能力得分排名
      this.innovateData = data.creative_power.map((item) => {
        return {
          ...item,
          value: Number(item.score).toFixed(3),
        };
      });
      // 如果this.innovateData的长度小于this.maxLength，将其补充到this.maxLength
      if (this.innovateData.length < this.maxLength) {
        const innovateDataLength = this.innovateData.length;
        for (let i = 0; i < this.maxLength - innovateDataLength; i++) {
          this.innovateData.push({
            name: '',
            value: '',
          });
        }
      }
      // R&D经费占GDP比重
      this.industrialInnovation.rDExpenditureAsPercentageOfGDP.data.xdata = data.creative_power.map((item) => item.name);
      this.industrialInnovation.rDExpenditureAsPercentageOfGDP.data.ydata = data.creative_power.map((item) => Number(item.rd_to_gdp_percent).toFixed(2));
      // 知识产权数量图
      // 软著数量分布
      this.industrialInnovation.numberOfIntellectualPropertyRights[0].data = data.intellectual_property.map((item) => ({
        name: item.name,
        value: item.software_copyright_num,
      }));
      // 专利数量分布
      this.industrialInnovation.numberOfIntellectualPropertyRights[1].data = data.intellectual_property.map((item) => ({
        name: item.name,
        value: item.patent_num,
      }));
      // 商标数量分布
      this.industrialInnovation.numberOfIntellectualPropertyRights[2].data = data.intellectual_property.map((item) => ({
        name: item.name,
        value: item.brand_num,
      }));
      // 产业投资热度
      // 数字经济企业融资额分布热力图
      this.industrialInvestmentEnthusiasm.heatMap.value = data.invest_hot.map((item) => ({
        ...item,
        value: Number(item.finance_amount).toFixed(2),
      }));
      // this.industrialInvestmentEnthusiasm.heatMap.value = this.fillMapDataWithZero(this.industrialInvestmentEnthusiasm.heatMap.value);
      // 产业投资热度得分
      this.industrialInvestmentEnthusiasm.scoreList = data.invest_hot.map((item) => ({
        name: item.name,
        value: Number(item.score).toFixed(3)
      }));
      // 如果this.industrialInvestmentEnthusiasm.scoreList的长度小于this.maxLength，将其补充到this.maxLength
      if (this.industrialInvestmentEnthusiasm.scoreList.length < this.maxLength) {
        const scoreListLength = this.industrialInvestmentEnthusiasm.scoreList.length;
        for (let i = 0; i < this.maxLength - scoreListLength; i++) {
          this.industrialInvestmentEnthusiasm.scoreList.push({
            name: '',
            value: '',
          });
        }
      }
      // 融资额度
      this.industrialInvestmentEnthusiasm.financingAmount.data.xdata = data.invest_hot.map((item) => item.name);
      this.industrialInvestmentEnthusiasm.financingAmount.data.ydata = data.invest_hot.map((item) => Number(item.finance_amount).toFixed(2));
      // 融资轮次
      this.industrialInvestmentEnthusiasm.financingRound.data.xdata = data.invest_hot.map((item) => item.name);
      this.industrialInvestmentEnthusiasm.financingRound.data.ydata = data.invest_hot.map((item) => Number(item.finance_round_num));
      this.loading = false;
    },
    // 下载clickDownloadReport
    clickDownloadReport() {
      window.open(
        'https://zhishu-economy.oss-cn-hangzhou.aliyuncs.com/index-report/2021-%E4%B8%AD%E5%9B%BD%E6%95%B0%E5%AD%97%E7%BB%8F%E6%B5%8E%E4%BA%A7%E4%B8%9A%E5%8F%91%E5%B1%95%E6%8C%87%E6%95%B0%E6%8A%A5%E5%91%8A.pdf'
      );
    },
    // 获取GIS信息
    async getGisInfo() {
      const res = await axios.get('/pythonApi/index/total/1');
      this.map1.value = res.data.data.map((item) => ({
        ...item,
        value: item.total_index
      }));
      this.map1.value = this.fillMapDataWithZero(this.map1.value);
      this.changeValue(110000);
    },
    async getGisInfoAllCity() {
      const res = await axios.get('/pythonApi/index/total/2');
      this.map1.valueAllCity = res.data.data.map((item) => ({
        ...item,
        value: item.total_index
      }));
      this.map1.valueAllCity = this.fillMapDataWithZero(this.map1.valueAllCity);
    },
    changeMapType(type) {
      this.mapType = type;
      this.changeValue(110000);
    },
    changeName(name) {
      if (this.mapType === 'china') {
        this.hoverItem = this.map1.value.find((item) => item.name == name);
      } else {
        this.hoverItem = this.map1.valueAllCity.find((item) => item.name == name);
      }
      if (!this.hoverItem) {
        this.hoverItem = {
          name,
        }
      }
      console.log('hoverItem', this.hoverItem);
    },
    changeValue(adcode) {
      // 从mapValue中找到对应的数据
      if (this.mapType === 'china') {
        this.hoverItem = this.map1.value.find((item) => item.adcode == adcode);
      } else {
        this.hoverItem = this.map1.valueAllCity.find((item) => item.adcode == adcode);
      }
      console.log('hoverItem', this.hoverItem);
    },
    resizeChart() {
      for (let i = 0; i < 11; i++) {
        if (this.$refs[`chart${i}`] && this.$refs[`chart${i}`].chart) {
          console.log('开始调整第', i, '个图表')
          this.$refs[`chart${i}`].chart.resize();
        }
      }
    }
  },
};
</script>

<style lang="less">
@import '~@/styles/variables.less';

.economy-index {
  .el-tabs__header {
    margin: 0;
  }
  .bubble-wrap {
    padding: 40px 18px 18px;
    .title {
      color: #1a262c;
      font-size: 14px;
      font-weight: 500;
      &::before {
        content: '';
        margin-right: 6px;
        width: 2px;
        height: 14px;
        background: #356df6;
      }
    }
    .list {
      padding-top: 10px;
      flex-wrap: wrap;
    }
    .bubble {
      margin: 3px;
      min-width: 80px;
      min-height: 80px;
      border-radius: 100%;
      color: #1a262c;
      font-size: 14px;
    }
  }
  .rose-wrap {
    background: #fff;
  }
  .rose-box {
    position: relative;
    width: 320px;
  }
  .rose-legend {
    flex: 1;
    flex-wrap: wrap;
    justify-content: space-around;
    max-height: 280px;
    max-width: 485px;
    overflow-x: hidden;
    overflow-y: auto;
    .item {
      margin: 9px 12px;
      width: 100px;
    }
    .icon {
      width: 8px;
      height: 8px;
      min-width: 8px;
      min-height: 8px;
      border-radius: 8px;
    }
    .name {
      margin-left: 8px;
      color: #86909c;
      font-size: 12px;
      font-weight: 400;
      width: 50px;
      min-width: 50px;
    }
    .value {
      margin-left: 3px;
      color: #4b5666;
      //font-family: D-DIN-Bold;
      font-family: ui-sans-serif, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: -1px;
    }
  }
  .rose-heart {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #4b5666;
    text-align: center;
    font-size: 14px;
    .title {
      margin-top: 2px;
      font-family: D-DIN-Bold;
      font-size: 24px;
      font-weight: 700;
    }
  }
  .env-ranks {
    margin: 23px 0 0;
    padding: 0 49px;
    .item {
      padding: 10px 0;
    }
    .icon {
      margin-right: 13px;
      width: 60px;
      height: 21px;
      line-height: 22px;
      color: #4b5666;
      text-align: center;
      font-family: D-DIN-Bold;
      font-size: 16px;
      font-weight: 700;
      border-radius: 21px;
      &.top1,
      &.top2,
      &.top3 {
        color: #fff;
      }
      &.top1 {
        background: #f4cc6c;
      }
      &.top2 {
        background: #bebebe;
      }
      &.top3 {
        background: #ef8f6a;
      }
    }
    .name {
      color: #4b5666;
      font-size: 14px;
      font-weight: 500;
    }
    .value {
      color: #4b5666;
      font-family: D-DIN-Bold;
      font-size: 16px;
      font-weight: 700;
    }
  }
  .env-wrap {
    height: 822px;
    box-sizing: border-box;
    background: #fff;
  }
  .org-map {
    width: 60% !important;
  }
  .org-grid {
    width: 30%;
  }
  .head-company {
    height: 602px;
    .wrap {
      margin: 0 auto !important;
      width: 94%;
    }
    .left {
      margin-right: 13px;
      width: 60px;
    }
    .progress {
      position: relative;
    }
    .item {
      padding: 8.5px 0;
    }
    .type {
      font-size: 16px;
      font-weight: 500;
    }
    .name {
      color: #4b5666;
      font-size: 14px;
      line-height: 15px;
      font-weight: 500;
      text-align: right;
    }
    .value {
      padding-left: 5px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      color: #4b5666;
      font-family: D-DIN-Bold;
      font-size: 18px;
      font-weight: 400;
    }
    .el-progress-bar__outer,
    .el-progress-bar__inner {
      border-radius: 2px;
    }
  }
  .innovate-grid {
    padding: 18px 18px 7px;
  }
  .rank-icon {
    margin: 0 auto;
    width: 25px;
    height: 22px;
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
    &.rank1 {
      background-image: url('@/assets/images/rank1.png');
    }
    &.rank2 {
      background-image: url('@/assets/images/rank2.png');
    }
    &.rank3 {
      background-image: url('@/assets/images/rank3.png');
    }
  }
  .tab-item {
    padding-left: 20px;
    position: relative;
    height: 40px;
    color: @text-lighter;
    cursor: pointer;
    &.active,
    &:hover {
      background: #d9e2fb;
      color: #356df6;
      &::before {
        width: 2px;
      }
      .svg-icon {
        fill: #356df6;
      }
    }
    &::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: 0;
      background: #356df6;
    }
    .svg-icon {
      margin-right: 5px;
    }
  }
  .wrap-inner {
    padding: 24px 24px 56px 264px;
    height: calc(100vh - 65px);
    overflow-y: auto;
    box-sizing: border-box;
  }
  .tabs-row {
    position: sticky;
    top: -24px;
    margin-top: 0;
    background: #fff;
    box-shadow: 0px 0px 16px 0px rgba(20, 38, 82, 0.07);
    z-index: 1;
  }
  .btn-locate {
    margin-right: 10px;
  }
  .btn-download {
    margin-left: 10px;
  }
  .el-button--primary.is-plain,
  .el-button--primary.is-plain:hover {
    padding-left: 16px !important;
    padding-right: 16px !important;
    border-radius: 2px;
    border: 1px solid #356df6;
    color: rgba(53, 109, 246, 1);
    background: #fff;
  }
  .el-button--primary.is-plain:hover {
    background: #ecf5ff;
  }
  .el-table__row {
    height: 30px !important;
  }
  .el-table__cell {
    padding: 3px 0 !important;
  }
  .el-table td.el-table__cell {
    border-bottom: none;
  }
}
</style>

<style>
.digital-economy.el-tooltip__popper.is-light {
  background-color: white;
  border: unset;
  width: 297px;
  height: 152px;
  box-shadow: 0px 0px 14px 0px rgba(19,38,82,0.08);
  padding: 0;
}
.digital-economy.el-tooltip__popper[x-placement^=top] .popper__arrow::after {
  border-top-color: white;
}
.digital-economy.el-tooltip__popper.is-light[x-placement^=top] .popper__arrow {
  border-top-color: white;
}
.digital-economy .chart-title {
  padding: 16px;
  color: #1A262C;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.6px;
}
.digital-economy-tooltip.el-tooltip__popper.is-dark {
  width: max-content;
}
</style>
