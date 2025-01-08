<template>
  <!--最外层-->
  <div class="tw-w-full tw-flex tw-flex-col">
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
      <el-table-column label="序号" prop="id" width="80" align="center" sortable="custom"/>
      <!--提问内容-->
      <el-table-column label="提问内容" prop="question" min-width="300" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="tw-cursor-pointer hover:tw-text-main" @click="handleView(scope.row)">{{scope.row?.question}}</span>
        </template>
      </el-table-column>
      <!--反馈like-->
      <el-table-column label="反馈" prop="like" width="100" align="center">
        <template slot-scope="scope">
          <div class="tw-w-full tw-flex tw-justify-center tw-items-center">
            <el-tooltip v-if="scope?.row?.like === 1" content="喜欢" placement="top">
              <img v-if="scope?.row?.like === 1" src="../../../icon/FeedbackLikeSvg.svg" alt="" style="">
            </el-tooltip>
            <el-tooltip v-if="scope?.row?.like === -1" content="不喜欢" placement="top">
              <img v-if="scope?.row?.like === -1" src="../../../icon/FeedbackUnlikeSvg.svg" alt="" style="">
            </el-tooltip>
            <span v-if="scope?.row?.like === 0" class="tw-text-sm">-</span>
          </div>
        </template>
      </el-table-column>
      <!--创建时间-->
      <el-table-column label="创建时间" prop="created_at" width="200" sortable="custom"/>
      <!--反馈时间-->
      <el-table-column label="反馈时间" prop="updated_at" width="200" sortable="custom"/>
      <!--操作-->
      <el-table-column label="操作" width="100" fixed="right" align="left">
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
import DialogPrompt from '@/components/DialogPrompt';

export default {
  name: 'QuestionListTable',
  props: {
    converse_id: {
      type: Number,
      required: true,
    },
    filterDate: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  mixins: [
    mixinList,
  ],
  components: {
    DialogPrompt,
  },
  data() {
    return {
      url: '/oam/question',
    };
  },
  watch: {
    filterDate: {
      handler(val) {
        // 如果存在filterDate，就把filterDate的值赋值给params
        if (this.filterDate && this.filterDate.length > 0) {
          [this.extraParams.start_date, this.extraParams.end_date] = this.filterDate;
        } else {
          this.extraParams.start_date = '';
          this.extraParams.end_date = '';
        }
        this.page_num = 1;
        this.getData();
      },
      deep: true,
    }
  },
  created() {
    this.extraParams.converse_id = this.converse_id;
  },
  methods: {
    handleView(item) {
      // 打开新窗口
      // eslint-disable-next-line no-restricted-globals
      window.open(`${location.origin + location.pathname}#/question/list/detail/${item.id}`);
    },
  },
};
</script>

<style scoped>

</style>
