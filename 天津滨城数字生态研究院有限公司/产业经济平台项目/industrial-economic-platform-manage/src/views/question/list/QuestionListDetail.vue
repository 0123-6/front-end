<template>
  <!--最外层-->
  <div class="question-list-detail tw-w-full tw-min-h-full tw-flex tw-flex-col tw-bg-[#F2F3F5] tw-pl-[24px] tw-pr-[24px]">
    <!--面包屑-->
    <bread-crumbs :list="breadCrumbsList" class="tw-mt-[12px]"/>
    <!--白色区域-->
    <div class="tw-mt-[6px] tw-mb-[23px] tw-bg-white tw-rounded tw-flex-1 tw-pl-[23px] tw-pr-[23px] tw-flex tw-flex-col">
      <!--限制最大宽度-->
      <div class="tw-w-full tw-max-w-[1080px] tw-min-h-[500px] tw-flex tw-flex-col"
           v-loading="loading">
        <span class="tw-mt-[16px] tw-font-medium tw-text-[#000000] tw-text-base tw-leading-[22px]">问题详情</span>
        <!--头像+时间-->
        <div class="tw-mt-[33px] tw-flex tw-items-center">
          <!--头像-->
          <div class="tw-flex tw-items-center">
            <img :src="data?.creator?.avatar ? data?.creator?.avatar : DefaultAvatarSvg" alt="" style="width: 22px;height: 22px;" class="tw-rounded-full">
            <span class="tw-ml-[6px] tw-text-sm tw-text-[#1A262C] hpj-text-hidden">{{data?.creator?.username}}</span>
          </div>
          <span class="tw-ml-[19px] tw-text-sm tw-text-[#646464] tw-leading-[20px]" style="">提问于{{data?.created_at}}</span>
        </div>
        <!--机构-->
        <span class="tw-mt-[11px] tw-text-sm tw-text-[#646464] tw-leading-[20px]">机构：{{data?.creator?.organization}}</span>
        <!--问题本身-->
        <span class="tw-mt-[15px] tw-text-[#1A262C] tw-font-medium tw-text-[22px] tw-leading-[30px] tw-break-all">{{data?.question}}</span>
        <!--问答答案+反馈-->
        <div class="tw-mt-[43px] tw-flex tw-items-center" style="">
          <span class="tw-mr-[13px] tw-text-[18px] tw-font-medium tw-text-[#1A262C] tw-leading-[24px]">问题答案</span>
          <el-tooltip v-if="data?.like === 1" popper-class="question-list-detail" content="喜欢" placement="top">
            <img v-if="data?.like === 1" src="../icon/FeedbackLikeSvg.svg" alt="" style="">
          </el-tooltip>
          <el-tooltip v-if="data?.like === -1" popper-class="question-list-detail" content="不喜欢" placement="top">
            <img v-if="data?.like === -1" src="../icon/FeedbackUnlikeSvg.svg" alt="" style="">
          </el-tooltip>
        </div>
        <!--答案-->
        <div v-if="data?.answer" class="tw-mt-[14px]">
          <Viewer :initialValue="data?.answer"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Viewer } from '@toast-ui/vue-editor';
import { get } from '@/utils/request';
import DefaultAvatarSvg from '../icon/DefaultAvatarSvg.svg';
import BreadCrumbs from '@/components/BreadCrumbs';

export default {
  name: 'QuestionListDetail',
  components: {
    BreadCrumbs,
    Viewer,
  },
  data() {
    return {
      breadCrumbsList: [
        { name: '问答管理' },
        { name: '问题列表', path: '/question/list' },
        { name: '问题详情' },
      ],
      // 加载中
      loading: false,
      // 数据
      data: {},
      // 默认头像
      DefaultAvatarSvg,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 获取数据
    async getData() {
      const params = {
        id: this.$route.params.id,
      };
      this.loading = true;
      const { data } = await get(`/oam/question/${params.id}`);
      this.data = data;
      this.loading = false;
    },
  },
};
</script>

<style scoped lang="less">
.question-list-detail {
  box-sizing: border-box;
  line-height: 1;
  * {
    box-sizing: border-box;
  }
}
</style>
<style>
.question-list-detail.el-tooltip__popper.is-dark {
  background-color: rgba(43, 42, 42, 0.7);
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #FFFFFF;
  border-radius: 8px;
}
.question-list-detail.el-tooltip__popper[x-placement^="top"] .popper__arrow {
  border-top-color: #6a6969;
}
.question-list-detail.el-tooltip__popper[x-placement^="top"] .popper__arrow::after {
  border-top-color: #6a6969;
}
</style>
