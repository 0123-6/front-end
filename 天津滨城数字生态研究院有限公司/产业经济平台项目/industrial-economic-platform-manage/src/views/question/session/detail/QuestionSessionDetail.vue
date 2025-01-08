<template>
  <!--最外层-->
  <div class="question-session-detail tw-w-full tw-min-h-full tw-flex tw-flex-col tw-bg-[#F2F3F5] tw-pl-[24px] tw-pr-[24px]">
    <!--面包屑-->
    <bread-crumbs :list="breadCrumbsList" class="tw-mt-[12px]"/>
    <!--白色区域-->
    <div class="tw-mt-[6px] tw-pb-[23px] tw-mb-[23px] tw-bg-white tw-rounded tw-flex-1 tw-pl-[23px] tw-pr-[23px] tw-flex tw-flex-col">
      <!--限制最大宽度-->
      <div class="tw-w-full tw-max-w-[1080px] tw-min-h-[500px] tw-flex tw-flex-col"
           v-loading="loading">
        <span class="tw-mt-[16px] tw-font-medium tw-text-[#000000] tw-text-base tw-leading-[22px]">会话详情</span>
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
        <div class="tw-mt-[15px] tw-flex tw-items-center">
          <div class="tw-flex-shrink-0 tw-w-[52px] tw-h-[27px] tw-flex tw-justify-center tw-items-center"
               style="border-radius: 8px 8px 0px 8px;"
               :style="data?.type ? typeMap[data.type].style : null">
            <span class="tw-text-base tw-font-medium">{{data?.type ? typeMap[data.type].name : null}}</span>
          </div>
          <span class="tw-ml-[11px] tw-text-[#1A262C] tw-font-medium tw-text-[22px] tw-leading-[30px] tw-break-all">{{data?.title}}</span>
        </div>
        <!--问题列表title-->
        <div class="tw-mt-[24px] tw-flex tw-items-center" style="">
          <div class="tw-w-[2px] tw-h-[16px] tw-bg-main"/>
          <span class="tw-ml-[9px] tw-text-base tw-font-medium tw-text-[#1A262C] tw-leading-[22px]">问题列表</span>
        </div>
        <!--提问时间筛选-->
        <div class="tw-mt-[11px] tw-flex tw-items-center">
          <span class="tw-ml-[6px] tw-mr-[9px] tw-text-sm tw-text-[#646464] tw-leading-[20px]">提问时间</span>
          <el-date-picker
            v-model="filterDate"
            type="daterange"
            range-separator="-"
            start-placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            end-placeholder="选择日期">
          </el-date-picker>
        </div>
        <!--表格-->
        <question-list-table class="tw-mt-[8px] tw-flex tw-flex-col"
                             :filter-date="filterDate"
                             :converse_id="Number($route.params.id)"/>
      </div>
    </div>
  </div>
</template>

<script>
import { get } from '@/utils/request';
import DefaultAvatarSvg from '../../icon/DefaultAvatarSvg.svg';
import BreadCrumbs from '@/components/BreadCrumbs';
import QuestionListTable from '@/views/question/session/detail/components/QuestionListTable';

export default {
  name: 'QuestionSessionDetail',
  components: {
    QuestionListTable,
    BreadCrumbs,
  },
  data() {
    return {
      breadCrumbsList: [
        { name: '问答管理' },
        { name: '会话列表', path: '/question/session' },
        { name: '会话详情' },
      ],
      // 加载中
      loading: false,
      // 数据
      data: {},
      // 默认头像
      DefaultAvatarSvg,
      // type英文对应中文
      typeMap: {
        economy: {
          name: '经济',
          style: {
            color: 'rgba(246,189,53,1)',
            background: 'rgba(246,189,53,0.22)',
          },
        },
        industrial: {
          name: '企业',
          style: {
            color: 'rgba(53,109,246,1)',
            background: 'rgba(53,109,246,0.22)',
          },
        },
        policy: {
          name: '政策',
          style: {
            color: '#F53838',
            background: 'rgba(255,141,141,0.22)',
          },
        },
      },
      // 时间筛选
      filterDate: [],
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 获取数据
    async getData() {
      const params = {
        id: Number(this.$route.params.id),
      };
      this.loading = true;
      const { data } = await get(`/oam/converse/${params.id}`);
      this.data = data;
      this.loading = false;
    },
  },
};
</script>

<style scoped lang="less">
.question-session-detail {
  box-sizing: border-box;
  line-height: 1;
  * {
    box-sizing: border-box;
  }
}
</style>
<style>
.question-session-detail.el-tooltip__popper.is-dark {
  background-color: rgba(43, 42, 42, 0.7);
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #FFFFFF;
  border-radius: 8px;
}
.question-session-detail.el-tooltip__popper[x-placement^="top"] .popper__arrow {
  border-top-color: #6a6969;
}
.question-session-detail.el-tooltip__popper[x-placement^="top"] .popper__arrow::after {
  border-top-color: #6a6969;
}
</style>
