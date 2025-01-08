<template>
  <!--最外层-->
  <div class="home-page tw-w-full tw-flex tw-flex-col">
    <!--联系我们-->
    <el-popover placement="left" width="259" trigger="hover" popper-class="popper-nopadding home-page-popover" :visible-arrow="false" :offset="0">
      <!--联系我们固定卡片-->
      <div slot="reference"
           class="tw-z-40 tw-w-[49px] tw-h-[171px] tw-fixed tw-bottom-[230px] tw-right-0 tw-flex tw-flex-col tw-justify-center tw-items-center"
           style="background: linear-gradient(156deg, #FAFCFF 0%, #FFFFFF 100%);box-shadow: 0px 2px 8px 0px rgba(19,38,82,0.16);border-radius: 8px 0px 0px 8px;">
        <div class="tw-w-[24px] tw-h-[24px]">
          <img src="./icon/connect/联系我们.svg" alt="" style="width: 100%;height: 100%;">
        </div>
        <div class="tw-flex tw-flex-col tw-items-center tw-text-base tw-font-medium tw-text-[#5B5858] tw-leading-6">
          <span>联</span>
          <span>系</span>
          <span>我</span>
          <span>们</span>
        </div>
      </div>
      <!--悬浮内容-->
      <div class="tw-w-full tw-h-[171px] tw-flex tw-flex-col tw-rounded-lg tw-box-border tw-pl-[27px]"
           style="background: linear-gradient(156deg, #FAFCFF 0%, #FFFFFF 100%);box-shadow: 0px 2px 8px 0px rgba(19,38,82,0.16);">
        <!--电话-->
        <div class="tw-mt-[25px] tw-flex tw-items-center">
          <div class="tw-w-[16px] tw-h-[16px] tw-flex tw-justify-center tw-items-center">
            <img src="./icon/connect/电话.svg" alt="" style="width: 100%;height: 100%;">
          </div>
          <span class="tw-ml-2.5 tw-text-sm tw-text-[#646464] tw-leading-5">电话</span>
        </div>
        <span class="tw-text-sm tw-text-[#646464] tw-leading-5">暂无数据</span>
        <!--邮箱-->
        <div class="tw-mt-[38px] tw-flex tw-items-center">
          <div class="tw-w-[16px] tw-h-[16px] tw-flex tw-justify-center tw-items-center">
            <img src="./icon/connect/邮箱.svg" alt="" style="width: 100%;height: 100%;">
          </div>
          <span class="tw-ml-2.5 tw-text-sm tw-text-[#646464] tw-leading-5">邮箱</span>
        </div>
        <span class="tw-mt-1.5 tw-text-sm tw-text-[#646464] tw-leading-5">cooperation@zhishu-tech.com</span>
      </div>
    </el-popover>
    <!--轮播图-->
    <div class="tw-h-[452px] tw-relative tw-flex tw-justify-center tw-overflow-hidden">
      <div class="tw-h-full tw-bg-[#f8fcff]" style="width: calc((100% - 1920px) / 2);"/>
      <img src="./icon/bannerbg.svg" alt="" style="width: 1920px;min-width: 1920px;">
      <div class="tw-h-full tw-bg-white" style="width: calc((100% - 1920px) / 2);"/>
      <div class="tw-absolute tw-top-[122px] tw-left-[21.30%] tw-flex tw-flex-col" style="">
        <span class="tw-font-semibold tw-text-[#333333] tw-text-[40px] tw-leading-[40px] tw-tracking-[-1.71px]">产业经济智能决策平台</span>
        <span class="tw-mt-3 tw-w-[31.20vw] tw-min-w-[433px] tw-max-w-[600px] tw-text-[#333333] tw-text-[23px] tw-leading-[35px] tw-tracking-[-0.99px]">打造“知识+数据+算法”驱动的产业经济治理模式，赋能经济高质量增长与可持续发展</span>
        <!--按钮-->
        <div v-show="!isLogin" class="tw-mt-[43px] tw-w-[120px] tw-h-[36px] tw-bg-[#356EF5] hover:tw-bg-[#5988FB] active:tw-bg-[#2C60DF] tw-rounded-[6px] tw-flex tw-justify-center tw-items-center tw-text-sm tw-text-white tw-cursor-pointer tw-tracking-[-0.6px]"
             @click="handleExperience">立即体验</div>
      </div>
    </div>
    <!--产品亮点-->
    <div class="tw-pt-[88px] tw-pb-[94px] tw-flex tw-flex-col tw-items-center tw-bg-[#FBFDFF]">
      <!--产品亮点 标题-->
      <div class="tw-flex tw-items-center">
        <TitleImg/>
        <span class="tw-ml-4 tw-font-medium tw-text-[#333333] tw-text-[34px] tw-leading-[34px] tw-tracking-[-1.46px]">产品亮点</span>
      </div>
      <!--卡片-->
      <div class="tw-mt-9 tw-w-[1200px] tw-grid tw-grid-cols-2 tw-gap-x-[22px] tw-gap-y-[25px]">
        <div v-for="(item, index) in list"
             :key="index"
             class="tw-w-[589px] tw-h-[242px] tw-rounded tw-shadow-[0px_2px_8px_0px_rgba(19,38,82,0.04)] hover:tw-shadow-[0px_2px_18px_0px_rgba(19,38,82,0.15)] tw-flex tw-flex-col tw-box-border tw-pl-[43px] tw-pr-[39px]"
             style="background: linear-gradient(156deg, #FAFCFF 0%, #FFFFFF 100%);">
          <div class="tw-mt-9 tw-flex tw-items-center">
            <img :src="item.icon" alt="">
            <span class="tw-ml-[18px] tw-tracking-[-0.94px] tw-text-[22px] tw-leading-[22px] tw-font-medium tw-text-[#333333]">{{item?.title}}</span>
          </div>
          <span class="tw-mt-[17px] tw-w-full tw-text-base tw-text-[#646464] tw-leading-[26px] tw-tracking-[-0.69px]">{{item?.content}}</span>
        </div>
      </div>
    </div>
    <!--核心功能 宏观经济动态感知-->
    <div class="tw-h-[727px] tw-bg-[#F3F9FF] tw-flex tw-flex-col tw-items-center">
      <!--核心功能 标题-->
      <div class="tw-mt-[74px] tw-flex tw-items-center">
        <TitleImg/>
        <span class="tw-ml-4 tw-font-medium tw-text-[#333333] tw-text-[34px] tw-leading-[34px] tw-tracking-[-1.46px]">核心功能</span>
      </div>
      <!--宏观经济动态感知-->
      <div class="tw-flex">
        <!--左侧-->
        <InnerContent title="宏观经济动态感知"
                      content="建立经济运行指标，覆盖全方位的重点领域，强化对经济态势的日常监测，动态跟踪经济发展的现状和趋势；构建经济分析指数，评估产业发展的情况及阶段，客观认识经济发展水平，辅助宏观决策治理与政策出台。"
                      inner-class="tw-mt-[146px]"/>
        <!--右侧-->
        <img src="./icon/宏观经济动态感知.svg" alt="" style="margin-top: 36px;margin-left: 43px;">
      </div>
    </div>
    <!--经济发展指数评估-->
    <div class="tw-h-[648px] tw-bg-[#FBFDFF] tw-flex tw-justify-center">
      <!--左侧-->
      <img src="./icon/经济发展指数评估.svg" alt="" style="width: 694px;height: 532px;margin-top: 54px;">
      <!--右侧-->
      <InnerContent title="经济发展指数评估"
                    content="建立科学的评价指标体系，构建精细的评估算法模型，客观呈现和科学评判全国各区域经济产业发展水平，精准定位产业布局和重点企业，为政府部门产业规划、产业政策制度提供有力支撑，为数字中国建设赋能添力。"
                    inner-class="tw-mt-[232px] tw-ml-[36px]"/>
    </div>
    <!--产业发展深度穿透-->
    <div class="tw-h-[648px] tw-bg-[#F3F9FF] tw-flex tw-justify-center">
      <!--左侧-->
      <InnerContent title="产业发展深度穿透"
                    content="以区域重点产业为核心，从创新、人才、资金等多角度绘制产业图谱，深度透视产业结构、产业创新、产业融资与产业链生态，构建产业评估评价模型，对产业发展态势进行科学研判；对标其他区域产业情况，为产业升级提供科学分析支撑，加强区域产业培育。"
                    inner-class="tw-mt-[232px]"/>
      <!--右侧-->
      <img src="./icon/产业发展深度穿透.svg" alt="" style="width: 636px;height: 486px;margin-top: 84px;margin-left: 81px;">
    </div>
    <!--产业招商精准推荐-->
    <div class="tw-h-[648px] tw-bg-[#FBFDFF] tw-flex tw-justify-center">
      <!--左侧-->
      <img src="./icon/产业招商精准推荐.svg" alt="" style="width: 701px;height: 493px;margin-top: 60px;">
      <!--右侧-->
      <InnerContent title="产业招商精准推荐"
                    content="针对产业链薄弱环节，通过产业链招商与多条件查企业两种模式，基于大数据算法匹配与推荐模型，推荐适合招引的高质量企业名单，辅助招商人员快速锁定招商目标，高效精准达成招商工作。"
                    inner-class="tw-mt-[222px] tw-ml-[39px]"/>
    </div>
    <!--产业政策一键触达-->
    <div class="tw-h-[650px] tw-bg-[#F3F9FF] tw-flex tw-justify-center">
      <!--左侧-->
      <InnerContent title="产业政策一键触达"
                    content="通过自然语言处理技术，提取政策文件的要素条件，与企业画像多维度数据进行碰撞，实现惠企政策的精准匹配与自动推送，解决政策找不到企业的难题，为市场主体提供精细化的管理服务。"
                    inner-class="tw-mt-[218px]"/>
      <!--右侧-->
      <img src="./icon/产业政策一键触达.svg" alt="" style="width: 613px;height: 517px;margin-top: 67px;margin-left: 118px;">
    </div>
    <!--合作机构-->
    <div class="tw-h-[446px] tw-bg-[#FBFDFF] tw-flex tw-flex-col tw-items-center">
      <div class="tw-mt-[66px] tw-flex tw-items-center">
        <TitleImg/>
        <span class="tw-ml-4 tw-font-medium tw-text-[#333333] tw-text-[34px] tw-leading-[34px] tw-tracking-[-1.46px]">合作机构</span>
      </div>
      <!--卡片-->
      <div class="tw-mt-[72px] tw-h-[126px] tw-flex tw-items-center">
        <div class="tw-w-[537px] tw-h-full tw-flex tw-justify-center tw-items-center tw-bg-white tw-rounded-[6px] tw-shadow-[0px_0px_8px_0px_rgba(19,38,82,0.04)] hover:tw-shadow-[0px_2px_18px_0px_rgba(19,38,82,0.15)]">
          <img src="./icon/footer/国家工程实验室.svg" alt="" style="width: 70%;">
        </div>
        <div class="tw-ml-7 tw-w-[537px] tw-flex tw-justify-center tw-items-center tw-h-full tw-bg-white tw-rounded-[6px] tw-shadow-[0px_0px_8px_0px_rgba(19,38,82,0.04)] hover:tw-shadow-[0px_2px_18px_0px_rgba(19,38,82,0.15)]">
          <img src="./icon/footer/北京大数据.svg" alt="" style="width: 45%;">
        </div>
      </div>
    </div>
    <!--备案号-->
    <div class="tw-h-[67px] tw-flex tw-justify-center tw-items-center tw-bg-[#F8F9FA tw-text-sm tw-text-[#86909C]">
      <span class="tw-mr-4"><span style="font-family: arial,serif;"> © </span>2023 产业经济智能决策平台</span>
      <span class="tw-cursor-pointer" @click="goBeian">京ICP备2022021810号-2</span>
    </div>
    <!--弹框-->
    <login-dialog v-if="showLoginDialog" @close="closeLoginDialog" @goRegister="goRegister" @goFindPassword="goFindPassword"></login-dialog>
    <register-dialog v-if="showRegisterDialog" @close="closeRegisterDialog" @goLogin="goLogin"></register-dialog>
    <find-password-dialog v-if="showFindPasswordDialog" @close="closeFindPasswordDialog" @goLogin="goLogin"></find-password-dialog>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import img1 from './icon/1.svg';
import img2 from './icon/2.svg';
import img3 from './icon/3.svg';
import img4 from './icon/4.svg';
import TitleImg from '@/views/home-page/components/TitleImg';
import InnerContent from '@/views/home-page/components/InnerContent';
import LoginDialog from '@/layout/components/LoginDialog';
import RegisterDialog from '@/layout/components/RegisterDialog';
import FindPasswordDialog from "@/layout/components/FindPasswordDialog";

export default defineComponent({
  name: 'HomePage',
  components: {
    FindPasswordDialog,
    InnerContent,
    TitleImg,
    LoginDialog,
    RegisterDialog,
  },
  computed: {
    ...mapGetters(['iep_platform_TOKEN', 'iep_platform_ROUTERS_INFO']),
    isLogin() {
      return this.iep_platform_TOKEN?.token || false;
    },
  },
  data() {
    return {
      showLoginDialog: false,
      showRegisterDialog: false,
      showFindPasswordDialog: false,
      list: [
        {
          icon: img1,
          title: '基于知识与规则重塑治理体系与决策模式',
          content: '依托相关领域、行业专家，围绕政府经济治理业务进行深入分析与研究，构建产业经济分析体系，输出经济监测指标体系、产业分析指数、产业链图谱、产业报告等知识资产。',
        },
        {
          icon: img2,
          title: '多源异构数据的融合分析与交叉验证',
          content: '从多源渠道获取各类经济相关数据，包括全量的企业数据、政策数据和舆情数据等，融合结构化数据与非结构化数据，经过比对、治理、打标、分析、挖掘等流程，形成海量体系化经济数据。',
        },
        {
          icon: img3,
          title: '前沿人工智能技术深度赋能业务场景',
          content: '应用大模型、AIGC、知识图谱、自然语言处理等前沿的人工智能技术解决业务痛点，深度赋能宏观经济、产业分析、招商引资、企业服务等场景，提供智能问答、自动生成、预测预警、智能匹配、智能推送等组件辅助决策。',
        },
        {
          icon: img4,
          title: '标准的SaaS化平台支持快速上线服务',
          content: '提供标准化SaaS服务平台，开箱即用，使用成本低、上线速度快、按功能采购、按周期付费，提供专业运营和运维，用户拥有很强的自主选择权。',
        },
      ],
    };
  },
  methods: {
    // 立即体验
    handleExperience() {
      this.showLoginDialog = true;
    },
    goBeian() {
      window.open('http://beian.miit.gov.cn/');
    },
    closeLoginDialog() {
      this.showLoginDialog = false;
    },
    closeRegisterDialog() {
      this.showRegisterDialog = false;
    },
    goLogin() {
      this.showRegisterDialog = false;
      this.showFindPasswordDialog = false;
      this.showLoginDialog = true;
    },
    goRegister() {
      this.showLoginDialog = false;
      this.showRegisterDialog = true;
    },
    closeFindPasswordDialog() {
      this.showFindPasswordDialog = false;
    },
    goFindPassword() {
      this.showLoginDialog = false;
      this.showFindPasswordDialog = true;
    },
  },
});
</script>

<style lang="less">
.home-page-popover {
  margin-right: 9px!important;
}
</style>
