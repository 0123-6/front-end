<template>
  <!--最外层-->
  <div class="question-list tw-w-full tw-min-h-full tw-flex tw-flex-col tw-bg-[#F2F3F5] tw-pl-[24px] tw-pr-[24px]">
    <!--面包屑-->
    <bread-crumbs :list="breadCrumbsList" class="tw-mt-[12px]"/>
    <!--白色区域-->
    <div class="tw-mt-[6px] tw-mb-[23px] tw-bg-white tw-rounded tw-flex-1 tw-pl-[23px] tw-pr-[23px] tw-flex tw-flex-col">
      <span class="tw-mt-[16px] tw-font-medium tw-text-[#000000] tw-text-base tw-leading-[22px]">问题列表</span>
      <!--筛选-->
      <el-input
        class="ee-input tw-mt-[15px]"
        v-model="keyword"
        placeholder="请输入问题/提问人"
        size="small"
        @keydown.enter.native="changeKeyword"
        style="width: 300px">
        <i slot="suffix" class="el-icon el-icon-search" @click="changeKeyword"></i>
      </el-input>
      <!--分割线-->
      <div class="tw-mt-[16px] tw-h-[1px] tw-bg-[#F3F1F1]"
           style="width: calc(100% + 23px);"/>
      <!--表格-->
      <div class="tw-mt-[19px] tw-flex tw-flex-col">
        <el-table
          ref="table"
          v-loading="loading"
          :data="list"
          tooltip-effect="dark"
          stripe
          @filter-change="changeFilter"
          @sort-change="changeSort"
        >
          <!--序号-->
          <el-table-column label="序号" prop="id" width="80" align="center"/>
          <!--问题-->
          <el-table-column label="问题" prop="question" min-width="300" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="tw-cursor-pointer hover:tw-text-main" @click="handleView(scope.row)">{{scope.row?.question}}</span>
            </template>
          </el-table-column>
          <!--类别-->
          <el-table-column label="类别" prop="converse_type_desc" width="100" align="left" column-key="type"
                           :filters="[
                             {text: '经济', value: 'economy'},
                             {text: '企业', value: 'industrial'},
                             {text: '政策', value: 'policy'},
                           ]"/>
          <!--提问人-->
          <el-table-column label="提问人" prop="creator" width="150" align="left" sortable="custom">
            <template slot-scope="scope">
              <div class="tw-flex tw-items-center">
                <img :src="scope.row?.creator?.avatar ? scope.row?.creator?.avatar : DefaultAvatarSvg" alt="" style="width: 22px;height: 22px;" class="tw-rounded-full">
                <span class="tw-ml-[6px] tw-text-sm tw-text-[#1A262C] hpj-text-hidden">{{scope.row.creator.username}}</span>
              </div>
            </template>
          </el-table-column>
          <!--机构-->
          <el-table-column label="机构" prop="creator.organization" width="200" align="left" show-overflow-tooltip/>
          <!--提问时间created_at-->
          <el-table-column label="提问时间" prop="created_at" width="200" sortable="custom"/>
          <!--反馈时间updated_at-->
          <el-table-column label="反馈时间" prop="updated_at" width="200" sortable="custom"/>
          <!--反馈like-->
          <el-table-column label="反馈" prop="like" width="100" align="center">
            <template slot-scope="scope">
              <div class="tw-w-full tw-flex tw-justify-center tw-items-center">
                <el-tooltip v-if="scope?.row?.like === 1" content="喜欢" placement="top">
                  <img v-if="scope?.row?.like === 1" src="../icon/FeedbackLikeSvg.svg" alt="" style="">
                </el-tooltip>
                <el-tooltip v-if="scope?.row?.like === -1" content="不喜欢" placement="top">
                  <img v-if="scope?.row?.like === -1" src="../icon/FeedbackUnlikeSvg.svg" alt="" style="">
                </el-tooltip>
                <span v-if="scope?.row?.like === 0" class="tw-text-sm">-</span>
              </div>
            </template>
          </el-table-column>
          <!--操作-->
          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="medium" @click="handleView(scope.row)">查看</el-button>
              <el-button type="text" size="medium" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="total_num > 10"
          class="ee-pagination tw-mb-[24px]"
          background
          layout="total,prev, pager, next,sizes,jumper"
          :current-page.sync="page_num"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="page_size"
          :total="total_num"
          @size-change="changeSize"
          @current-change="changeNum">
        </el-pagination>
      </div>
    </div>
    <!--删除弹框-->
    <dialog-prompt v-if="showDeleteDialog"
                   @on-ok="deleteDialogOnOk"
                   @on-cancel="deleteDialogOnCancel">
      <template slot="content">
        <span class="tw-mt-[44px] tw-text-base tw-text-[#262626] tw-flex tw-items-center">确定删除<span class="tw-max-w-[180px] tw-text-[#356DF6] tw-pl-[4px] tw-pr-[4px] hpj-text-hidden">{{singleSelection?.question}}</span>吗？</span>
      </template>
    </dialog-prompt>
  </div>
</template>

<script>
import mixinList from '@/utils/mixinList';
import DefaultAvatarSvg from '../icon/DefaultAvatarSvg.svg';
import BreadCrumbs from '@/components/BreadCrumbs';
import DialogPrompt from '@/components/DialogPrompt';

export default {
  name: 'QuestionList',
  mixins: [
    mixinList
  ],
  components: {
    BreadCrumbs,
    DialogPrompt,
  },
  data() {
    return {
      breadCrumbsList: [
        {
          name: '问答管理',
        },
        {
          name: '问题列表',
        },
      ],
      DefaultAvatarSvg,
      url: '/oam/question',
    };
  },
  methods: {
    handleView(item) {
      this.$router.push({
        path: `/question/list/detail/${item.id}`,
      });
    },
  },
};
</script>

<style scoped lang="less">
.question-list {
  box-sizing: border-box;
  line-height: 1;
  * {
    box-sizing: border-box;
  }
}
</style>
